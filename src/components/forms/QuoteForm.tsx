import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { FormState, FormErrors, StepNumber, ParsedPlace } from "@/types";
import { formatPhone, todayISO } from "@/lib/forms/formatting";
import { validateStep } from "@/lib/forms/validation";
import { submitLead } from "@/lib/forms/api";
import { getPhoneFieldError, isValidVisitorPhone } from "@/lib/phone";
import { trackQuoteSubmission } from "@/lib/analytics";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";
import { Stepper } from "@/components/ui/Stepper";
import { Field } from "@/components/ui/Field";
import { COMPANY } from "@/data/company";

const EMPTY_FORM: FormState = {
  pickupRaw: "",
  pickupCity: "",
  pickupState: "",
  pickupZip: "",
  destRaw: "",
  destCity: "",
  destState: "",
  destZip: "",
  moveDate: "",
  moveSize: "",
  fullName: "",
  email: "",
  phone: "",
};

const INPUT =
  "w-full rounded-md border border-gray-300 bg-white px-3.5 py-3 text-[15px] text-heading outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

const INPUT_ERROR =
  "w-full rounded-md border border-red-400 bg-white px-3.5 py-3 text-[15px] text-heading outline-none transition-all placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-200";

function inputCls(hasError: boolean, isPlaceholder = false): string {
  return (hasError ? INPUT_ERROR : INPUT) + (isPlaceholder ? " text-gray-400" : "");
}

export function QuoteForm() {
  const navigate = useNavigate();
  const placesLoaded = useGooglePlaces();

  const [step, setStep] = useState<StepNumber>(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [phoneBlurred, setPhoneBlurred] = useState(false);

  const pickupRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 3) setPhoneBlurred(false);
  }, [step]);

  const updateField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = e.target.value;
      if (field === "phone") {
        value = formatPhone(value);
        setForm((prev) => ({ ...prev, phone: value }));
        setErrors((prev) => {
          const next = { ...prev };
          if (isValidVisitorPhone(value)) delete next.phone;
          return next;
        });
        return;
      }
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const onPickupSelect = useCallback((place: ParsedPlace) => {
    setForm((prev) => ({
      ...prev,
      pickupRaw: place.formatted,
      pickupCity: place.city,
      pickupState: place.state,
      pickupZip: place.zip,
    }));
    setErrors((prev) => ({ ...prev, pickupRaw: undefined }));
  }, []);

  const onDestSelect = useCallback((place: ParsedPlace) => {
    setForm((prev) => ({
      ...prev,
      destRaw: place.formatted,
      destCity: place.city,
      destState: place.state,
      destZip: place.zip,
    }));
    setErrors((prev) => ({ ...prev, destRaw: undefined }));
  }, []);

  usePlacesAutocomplete({
    inputRef: pickupRef,
    enabled: placesLoaded,
    onSelect: onPickupSelect,
  });

  usePlacesAutocomplete({
    inputRef: destRef,
    enabled: placesLoaded,
    onSelect: onDestSelect,
  });

  function tryAdvance() {
    const stepErrors = validateStep(step, form);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, 3) as StepNumber);
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1) as StepNumber);
  }

  async function handleSubmit() {
    const stepErrors = validateStep(3, form);
    setErrors(stepErrors);
    setPhoneBlurred(true);
    if (Object.keys(stepErrors).length > 0) return;

    setSubmitting(true);
    setResult(null);
    const res = await submitLead(form);
    setSubmitting(false);

    if (res.ok) {
      trackQuoteSubmission({
        moveSize: form.moveSize,
        pickupState: form.pickupState,
        destState: form.destState,
      });
      navigate("/thank-you", {
        state: { isDuplicate: res.isDuplicate ?? false },
      });
      return;
    }
    setResult(res);
  }

  const phoneResolvedError =
    step === 3 && (phoneBlurred || errors.phone !== undefined)
      ? getPhoneFieldError(form.phone)
      : undefined;

  /* ── Form ── */

  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-[22px] font-bold tracking-tight text-heading">
          Get Instant Quote
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Receive your free moving quote
        </p>
      </div>

      <Stepper current={step} />

      {/* Step 1 — Location */}
      {step === 1 && (
        <div>
          <Field label="Pickup" error={errors.pickupRaw}>
            <input
              ref={pickupRef}
              className={inputCls(!!errors.pickupRaw)}
              placeholder="City, State or ZIP Code"
              value={form.pickupRaw}
              onChange={updateField("pickupRaw")}
              autoComplete="off"
            />
          </Field>
          <Field label="Destination" error={errors.destRaw}>
            <input
              ref={destRef}
              className={inputCls(!!errors.destRaw)}
              placeholder="City, State or ZIP Code"
              value={form.destRaw}
              onChange={updateField("destRaw")}
              autoComplete="off"
            />
          </Field>
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 2 && (
        <div>
          <Field label="Move Date" error={errors.moveDate}>
            <input
              type="date"
              className={inputCls(!!errors.moveDate, !form.moveDate)}
              min={todayISO()}
              value={form.moveDate}
              onChange={updateField("moveDate")}
            />
          </Field>
          <Field label="Moving Size" error={errors.moveSize}>
            <select
              className={inputCls(!!errors.moveSize, !form.moveSize) + " cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20fill=%27%2371717a%27%20viewBox=%270%200%2016%2016%27%3E%3Cpath%20d=%27M1.5%205.5l6.5%206%206.5-6%27/%3E%3C/svg%3E')] bg-[position:right_14px_center] bg-no-repeat pr-9"}
              value={form.moveSize}
              onChange={updateField("moveSize")}
            >
              <option value="" disabled>
                Select Move Size
              </option>
              <option value="Studio">Studio</option>
              <option value="1 Bedroom">1 Bedroom</option>
              <option value="2 Bedrooms">2 Bedrooms</option>
              <option value="3 Bedrooms">3 Bedrooms</option>
              <option value="4 Bedrooms">4 Bedrooms</option>
              <option value="5+ Bedrooms">5+ Bedrooms</option>
              <option value="Office">Office</option>
            </select>
          </Field>
        </div>
      )}

      {/* Step 3 — Contact */}
      {step === 3 && (
        <div>
          <Field label="Full Name" error={errors.fullName}>
            <input
              className={inputCls(!!errors.fullName)}
              placeholder="Your Name"
              value={form.fullName}
              onChange={updateField("fullName")}
              autoComplete="name"
            />
          </Field>
          <Field label="Email Address" error={errors.email}>
            <input
              type="email"
              className={inputCls(!!errors.email)}
              placeholder="your@email.com"
              value={form.email}
              onChange={updateField("email")}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone Number" error={phoneResolvedError}>
            <input
              type="tel"
              className={inputCls(!!phoneResolvedError)}
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={updateField("phone")}
              onBlur={() => setPhoneBlurred(true)}
              autoComplete="tel"
              aria-invalid={phoneResolvedError ? true : undefined}
            />
          </Field>
        </div>
      )}

      {/* Error banner */}
      {result && !result.ok && (
        <div className="mb-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {result.msg}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-2 flex gap-2.5">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="rounded-lg border border-gray-300 px-5 py-3.5 text-sm font-semibold text-gray-500 transition-all hover:border-gray-400 hover:text-heading"
          >
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={tryAdvance}
            className="flex-1 rounded-lg bg-primary py-3.5 text-[15px] font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-lg bg-primary py-3.5 text-[15px] font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Get Free Quote"}
          </button>
        )}
      </div>

      {/* Phone CTA */}
      <p className="mt-5 text-center text-sm text-gray-500">
        Or call us directly:{" "}
        <a
          href={`tel:${COMPANY.phone}`}
          className="font-bold text-link hover:text-link-hover"
        >
          {COMPANY.phone}
        </a>
      </p>

      {/* Disclaimer */}
      <p className="mt-3 text-center text-[10px] leading-relaxed text-gray-400">
        By submitting this form you agree to receive communications from{" "}
        {COMPANY.name} regarding your move. See our{" "}
        <a href="/privacy-policy" className="underline hover:text-gray-500">
          privacy policy
        </a>
        .
      </p>
    </div>
  );
}
