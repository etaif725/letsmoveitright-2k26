/**
 * formatting.ts
 * Transform raw values into display-friendly or API-friendly formats.
 */

import { formatPhoneInput } from "@/lib/phone";

/** US national-style masking while typing (libphonenumber). */
export function formatPhone(value: string): string {
  return formatPhoneInput(value);
}

/** Return today as YYYY-MM-DD for the date input's `min` attr. */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/** Convert YYYY-MM-DD → MM/DD/YYYY (Granot API format). */
export function isoToMMDDYYYY(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

/** Split "Jane Doe Smith" → { first: "Jane", last: "Doe Smith" }. */
export function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  return {
    first: parts[0] ?? "",
    last: parts.slice(1).join(" "),
  };
}
