import { Resend } from "resend";
import { createRequire } from "module";
import { getRequestBody } from "./_parseBody.js";

const require = createRequire(import.meta.url);
const { isValidVisitorPhone, toE164 } = require("../lib/phoneShared.cjs");

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@letsmoveit-right.com";
const TO_EMAILS = (process.env.NOTIFICATIONS_EMAILS || "").split(",").filter(Boolean);
const CC_EMAILS = (process.env.NOTIFICATIONS_CC || "").split(",").filter(Boolean);
const BCC_EMAILS = (process.env.NOTIFICATIONS_BCC || "").split(",").filter(Boolean);

const COMPANY = {
  name: "Let's Move It Right",
  tagline: "Full Service Moving Company",
  phone: "1-800-956-1118",
  fullAddress: "503 Jessie Street, San Fernando, CA 91340",
  domain: "https://www.letsmoveit-right.com",
};

function esc(s) {
  if (typeof s !== "string") return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function row(label, value, opts = {}) {
  const border = opts.last ? "" : "border-bottom:1px solid #f0f0f0;";
  const val = opts.raw ? value : esc(value);
  const weight = opts.highlight ? "color:#1a1a2e;font-weight:600;" : "color:#333333;";
  return `<tr>
    <td style="padding:12px 0;${border}width:140px;vertical-align:top;"><span style="font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">${label}</span></td>
    <td style="padding:12px 0 12px 12px;${border}vertical-align:top;"><span style="font-size:15px;${weight}">${val}</span></td>
  </tr>`;
}

function link(href, text) {
  return `<a href="${esc(href)}" style="color:#1a73e8;text-decoration:none;">${esc(text)}</a>`;
}

function shell(title, bodyRows) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a1a2e;padding:28px 32px;text-align:center;">
    <h1 style="margin:0;font-size:22px;color:#f5c518;letter-spacing:0.5px;">${esc(COMPANY.name)}</h1>
    <p style="margin:4px 0 0;font-size:12px;color:#aaaacc;text-transform:uppercase;letter-spacing:1.5px;">${esc(COMPANY.tagline)}</p>
  </td></tr>
  <tr><td style="background:#f5c518;padding:12px 32px;text-align:center;">
    <strong style="font-size:14px;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">${esc(title)}</strong>
  </td></tr>
  <tr><td style="padding:28px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bodyRows}</table></td></tr>
  <tr><td style="background:#fafafa;padding:20px 32px;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0 0 4px;font-size:12px;color:#888;">${esc(COMPANY.name)} &bull; ${esc(COMPANY.fullAddress)}</p>
    <p style="margin:0;font-size:12px;color:#888;">${esc(COMPANY.phone)} &bull; <a href="${COMPANY.domain}" style="color:#1a73e8;text-decoration:none;">letsmoveit-right.com</a></p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("submit: RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  if (!TO_EMAILS.length) {
    console.error("submit: NOTIFICATIONS_EMAILS is empty — set it in Vercel env");
    return res.status(500).json({ error: "No notification recipients configured" });
  }

  const body = await getRequestBody(req);
  const { name, email, phone, movingFrom, movingTo, moveDate, moveSize } = body || {};

  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length < 2) errors.push("Name is required");
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email required");
  if (!phone || typeof phone !== "string" || !isValidVisitorPhone(phone))
    errors.push("Valid phone required");
  if (!movingFrom || typeof movingFrom !== "string" || movingFrom.trim().length < 2) errors.push("Moving from required");
  if (!movingTo || typeof movingTo !== "string" || movingTo.trim().length < 2) errors.push("Moving to required");
  if (!moveSize || typeof moveSize !== "string") errors.push("Move size required");
  if (!moveDate || typeof moveDate !== "string") errors.push("Move date required");

  if (errors.length) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const phoneNormalized = toE164(phone);
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const rows = [
    row("Name", name, { highlight: true }),
    row("Email", link(`mailto:${email}`, email), { raw: true }),
    row("Phone", link(`tel:${phoneNormalized}`, phoneNormalized), { raw: true }),
    row("Moving From", movingFrom),
    row("Moving To", movingTo),
    row("Move Size", moveSize),
    row("Move Date", moveDate),
    row("Submitted", now, { last: true }),
  ].join("\n");

  const payload = {
    from: FROM_EMAIL,
    to: TO_EMAILS,
    replyTo: email,
    subject: `New Moving Quote Request — ${name}`,
    html: shell("New Moving Quote Request", rows),
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNormalized}\nFrom: ${movingFrom}\nTo: ${movingTo}\nSize: ${moveSize}\nDate: ${moveDate}`,
  };
  if (CC_EMAILS.length) payload.cc = CC_EMAILS;
  if (BCC_EMAILS.length) payload.bcc = BCC_EMAILS;

  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return res.status(500).json({
        error: "Email send failed",
        detail: error.message || String(error),
      });
    }
    console.log("Resend quote email sent:", data?.id);
    return res.status(200).json({ message: "Form submitted successfully" });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
