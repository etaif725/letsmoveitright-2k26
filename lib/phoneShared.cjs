"use strict";
/**
 * Mirror of src/lib/phone.ts for Express (index.cjs) and Vercel handlers that cannot import TS.
 * Keep behavior in sync when changing phone rules.
 */
const { AsYouType, parsePhoneNumberFromString } = require("libphonenumber-js");

const DEFAULT_PHONE_REGION = "US";

function capUsPhoneDigits(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("1")) {
    return digits.slice(0, 11);
  }
  return digits.slice(0, 10);
}

function formatPhoneInput(value, region = DEFAULT_PHONE_REGION) {
  const capped = capUsPhoneDigits(value);
  const formatter = new AsYouType(region);
  let formatted = "";
  for (const ch of capped) {
    formatted = formatter.input(ch);
  }
  return formatted;
}

function parseVisitorPhone(input) {
  const trimmed = String(input || "").trim();
  if (!trimmed) return undefined;
  const parsed = parsePhoneNumberFromString(trimmed, DEFAULT_PHONE_REGION);
  if (!parsed || !parsed.isValid() || parsed.country !== "US") return undefined;
  return parsed;
}

function isValidVisitorPhone(input) {
  return parseVisitorPhone(input) !== undefined;
}

function toE164(input) {
  const parsed = parseVisitorPhone(input);
  return parsed ? parsed.format("E.164") : null;
}

function toLeadPhoneDigits(input) {
  const parsed = parseVisitorPhone(input);
  return parsed ? parsed.nationalNumber : null;
}

module.exports = {
  DEFAULT_PHONE_REGION,
  formatPhoneInput,
  parseVisitorPhone,
  isValidVisitorPhone,
  toE164,
  toLeadPhoneDigits,
};
