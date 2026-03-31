import { useState, useRef, useCallback } from "react";

import type { FormState, FormErrors, ParsedPlace } from "@/types";
import { formatPhone, todayISO } from "@/lib/forms/formatting";
import { validateStep } from "@/lib/forms/validation";
import { submitLead } from "@/lib/forms/api";
import { useGooglePlaces } from "@/hooks/useGooglePlaces";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";
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

function validateAll(form: FormState): FormErrors {
  return {
    ...validateStep(1, form),
    ...validateStep(2, form),
    ...validateStep(3, form),
  };
}

export function QuoteFormPage() {
  const placesLoaded = useGooglePlaces();

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const pickupRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);

  const updateField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value = e.target.value;
      if (field === "phone") value = formatPhone(value);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validateAll(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    setResult(null);
    const res = await submitLead(form);
    setResult(res);
    setSubmitting(false);
  }

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
          ✓
        </div>
        <h3 className="font-heading text-xl text-heading">
          Quote Requested!
        </h3>
        <p className="mt-2 text-body">
          We'll be in touch shortly with your free moving quote.
        </p>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setForm(EMPTY_FORM);
            setErrors({});
          }}
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Pickup + Destination */}
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Pickup Location" error={errors.pickupRaw}>
          <input
            ref={pickupRef}
            type="text"
            value={form.pickupRaw}
            onChange={updateField("pickupRaw")}
            placeholder="City, State or ZIP Code"
            autoComplete="off"
            className={inputClass(!!errors.pickupRaw)}
          />
        </FieldWrapper>
        <FieldWrapper label="Destination" error={errors.destRaw}>
          <input
            ref={destRef}
            type="text"
            value={form.destRaw}
            onChange={updateField("destRaw")}
            placeholder="City, State or ZIP Code"
            autoComplete="off"
            className={inputClass(!!errors.destRaw)}
          />
        </FieldWrapper>
      </div>

      {/* Move Date + Size */}
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Move Date" error={errors.moveDate}>
          <input
            type="date"
            min={todayISO()}
            value={form.moveDate}
            onChange={updateField("moveDate")}
            className={inputClass(!!errors.moveDate, !form.moveDate)}
          />
        </FieldWrapper>
        <FieldWrapper label="Moving Size" error={errors.moveSize}>
          <select
            value={form.moveSize}
            onChange={updateField("moveSize")}
            className={inputClass(!!errors.moveSize, !form.moveSize)}
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
        </FieldWrapper>
      </div>

      {/* Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Full Name" error={errors.fullName}>
          <input
            type="text"
            value={form.fullName}
            onChange={updateField("fullName")}
            placeholder="Your Name"
            autoComplete="name"
            className={inputClass(!!errors.fullName)}
          />
        </FieldWrapper>
        <FieldWrapper label="Email Address" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={updateField("email")}
            placeholder="your@email.com"
            autoComplete="email"
            className={inputClass(!!errors.email)}
          />
        </FieldWrapper>
      </div>

      {/* Phone */}
      <FieldWrapper label="Phone Number" error={errors.phone}>
        <input
          type="tel"
          value={form.phone}
          onChange={updateField("phone")}
          placeholder="(555) 123-4567"
          autoComplete="tel"
          className={inputClass(!!errors.phone) + " sm:max-w-xs"}
        />
      </FieldWrapper>

      {/* Error banner */}
      {result && !result.ok && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {result.msg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-8 py-3.5 text-base font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Get My Free Quote"}
      </button>

      {/* Phone CTA */}
      <p className="text-center text-sm text-gray-500">
        Prefer to speak with someone?{" "}
        <a
          href={`tel:${COMPANY.phone}`}
          className="font-bold text-link hover:text-link-hover"
        >
          Call {COMPANY.phone}
        </a>
      </p>

      {/* Disclaimer */}
      <p className="text-center text-[11px] leading-relaxed text-gray-400">
        By submitting this form you agree to receive communications from{" "}
        {COMPANY.name} regarding your move. See our{" "}
        <a
          href="/privacy-policy"
          className="underline hover:text-gray-500"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

/* ─── Shared helpers (same visual language as ContactForm) ───── */

function inputClass(hasError: boolean, isPlaceholder = false): string {
  return [
    "w-full rounded-md border px-4 py-3 text-[15px] text-heading bg-white outline-none transition-all",
    "placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary",
    hasError
      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
      : "border-gray-300",
    isPlaceholder ? "text-gray-400" : "",
  ].join(" ");
}

function FieldWrapper({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-heading">
        {label}
      </label>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
