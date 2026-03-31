/**
 * formatting.ts
 * Transform raw values into display-friendly or API-friendly formats.
 */

/** Mask a phone string into (XXX) XXX-XXXX as the user types. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Strip a formatted phone back to raw digits. */
export function stripPhone(formatted: string): string {
  return formatted.replace(/\D/g, "");
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
