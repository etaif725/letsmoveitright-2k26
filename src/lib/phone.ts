import {
  AsYouType,
  parsePhoneNumberFromString,
  type CountryCode,
  type PhoneNumber,
} from "libphonenumber-js";

/** Single-region UX: visitors type a normal US number (no country code required). */
export const DEFAULT_PHONE_REGION: CountryCode = "US";

export const PHONE_REQUIRED_MSG = "Phone number is required";
export const PHONE_INVALID_MSG = "Enter a valid U.S. phone number";

/**
 * US NANP: at most 10 national digits, or 11 when the user included a leading 1.
 * Prevents runaway input like dozens of digits still appearing in the field.
 */
function capUsPhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("1")) {
    return digits.slice(0, 11);
  }
  return digits.slice(0, 10);
}

/**
 * National formatting while typing (US). Digits are capped before formatting.
 */
export function formatPhoneInput(
  value: string,
  region: CountryCode = DEFAULT_PHONE_REGION,
): string {
  const capped = capUsPhoneDigits(value);
  const formatter = new AsYouType(region);
  let formatted = "";
  for (const ch of capped) {
    formatted = formatter.input(ch);
  }
  return formatted;
}

export function parseVisitorPhone(input: string): PhoneNumber | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const parsed = parsePhoneNumberFromString(trimmed, DEFAULT_PHONE_REGION);
  if (!parsed?.isValid() || parsed.country !== "US") return undefined;
  return parsed;
}

export function isValidVisitorPhone(input: string): boolean {
  return parseVisitorPhone(input) !== undefined;
}

/** Used for inline + submit validation messaging. */
export function getPhoneFieldError(value: string): string | undefined {
  if (!value.trim()) return PHONE_REQUIRED_MSG;
  if (!isValidVisitorPhone(value)) return PHONE_INVALID_MSG;
  return undefined;
}

/** Canonical form for JSON payloads and tel: links. */
export function toE164(input: string): string | null {
  const parsed = parseVisitorPhone(input);
  return parsed ? parsed.format("E.164") : null;
}

/** 10-digit national for US lead gateways (visitor phone is US-only). */
export function toLeadPhoneDigits(input: string): string | null {
  const parsed = parseVisitorPhone(input);
  return parsed ? parsed.nationalNumber : null;
}
