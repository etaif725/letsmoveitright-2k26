/**
 * api.ts
 * Talk to the Granot leads posting gateway.
 * Builds the URL-encoded payload, POSTs it, and parses the response.
 */

import type { FormState, LeadPayload, SubmitResult } from "@/types";
import { toE164, toLeadPhoneDigits } from "@/lib/phone";
import { isoToMMDDYYYY, splitName } from "./formatting";

// Always proxy through our Express server to avoid CORS issues.
// In dev, Vite forwards /api/* to localhost:3000. In production,
// Express serves both the SPA and the API routes.
const API_URL = "/api/submit-lead";

/** 101 = local (same state), 102 = long distance. */
function detectServiceType(originState: string, destState: string): number {
  if (!originState || !destState) return 102;
  return originState === destState ? 101 : 102;
}

/** Map form state → flat lead payload matching the Granot API schema. */
export function buildPayload(form: FormState): LeadPayload {
  const { first, last } = splitName(form.fullName);
  return {
    servtypeid: detectServiceType(form.pickupState, form.destState),
    firstname: first,
    lastname: last,
    ozip: form.pickupZip,
    ocity: form.pickupCity,
    ostate: form.pickupState,
    dzip: form.destZip,
    dcity: form.destCity,
    dstate: form.destState,
    movedte: isoToMMDDYYYY(form.moveDate),
    movesize: form.moveSize,
    email: form.email.trim(),
    phone1: toLeadPhoneDigits(form.phone) ?? "",
    consent: "1",
    label: "website-quote-form",
  };
}

/**
 * Parse the Granot HTTP response.
 * Format: "leadid,errid,msg,sold,match"
 * errid 0 = success, anything else = error.
 */
function parseResponse(raw: string): SubmitResult {
  const parts = raw.split(",");
  const leadId = parts[0]?.trim();
  const errid = parts[1]?.trim();
  const msg = parts[2]?.trim();

  if (errid === "0") {
    return { ok: true, msg: "Quote request submitted successfully!", leadId };
  }
  return { ok: false, msg: msg || "Submission failed. Please try again." };
}

/**
 * Fire-and-forget email notification via the backend's /api/submit
 * endpoint. The server builds the branded HTML email from the raw
 * data. Never blocks the primary lead-gateway submission or
 * surfaces errors to the user.
 */
function sendEmailNotification(form: FormState): void {
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: form.fullName.trim(),
      email: form.email.trim(),
      phone: toE164(form.phone) ?? "",
      movingFrom:
        form.pickupRaw.trim() ||
        `${form.pickupCity}, ${form.pickupState} ${form.pickupZip}`.trim(),
      movingTo:
        form.destRaw.trim() ||
        `${form.destCity}, ${form.destState} ${form.destZip}`.trim(),
      moveDate: form.moveDate,
      moveSize: form.moveSize,
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error(
          "Email notification failed:",
          res.status,
          errBody?.error || res.statusText,
          errBody?.detail || errBody?.details || "",
        );
      }
    })
    .catch((err) => {
      console.error("Email notification error:", err);
    });
}

/** POST the lead to the gateway and return a typed result. */
export async function submitLead(form: FormState): Promise<SubmitResult> {
  const payload = buildPayload(form);
  const params = new URLSearchParams(
    Object.entries(payload).map(([k, v]) => [k, String(v)])
  );

  // Send email notification in parallel (fire-and-forget)
  sendEmailNotification(form);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const text = await res.text();
    return parseResponse(text);
  } catch (err) {
    console.error("Lead submission error:", err);
    return {
      ok: false,
      msg: "Network error — please check your connection and try again.",
    };
  }
}
