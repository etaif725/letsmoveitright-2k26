/**
 * validation.ts
 * Determine whether form data is valid at each step.
 * Returns a partial error map — empty object means no errors.
 */

import type { FormState, FormErrors, StepNumber } from "@/types";
import { stripPhone } from "./formatting";

const EMAIL_RE = /\S+@\S+\.\S+/;

function validateLocation(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.pickupRaw.trim() && !form.pickupZip) {
    errors.pickupRaw = "Enter a pickup location";
  }
  if (!form.destRaw.trim() && !form.destZip) {
    errors.destRaw = "Enter a destination";
  }
  return errors;
}

function validateDetails(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.moveDate) errors.moveDate = "Select a move date";
  if (!form.moveSize) errors.moveSize = "Select a move size";
  return errors;
}

function validateContact(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Enter your name";
  if (!form.email.trim() || !EMAIL_RE.test(form.email)) {
    errors.email = "Enter a valid email";
  }
  if (stripPhone(form.phone).length < 10) {
    errors.phone = "Enter a valid phone number";
  }
  return errors;
}

/** Validate the given step. Returns errors (empty = valid). */
export function validateStep(step: StepNumber, form: FormState): FormErrors {
  switch (step) {
    case 1:
      return validateLocation(form);
    case 2:
      return validateDetails(form);
    case 3:
      return validateContact(form);
  }
}

/** Convenience: true if no errors. */
export function isStepValid(step: StepNumber, form: FormState): boolean {
  return Object.keys(validateStep(step, form)).length === 0;
}
