import { useState } from "react";

import {
  formatPhoneInput,
  getPhoneFieldError,
  isValidVisitorPhone,
  toE164,
} from "@/lib/phone";

const INQUIRY_TYPES = [
  { value: "", label: "Select a reason for contacting us" },
  { value: "new-customer", label: "I'm interested in moving services" },
  { value: "storage-client", label: "I'm a current storage client" },
  { value: "active-move", label: "My belongings have been picked up" },
  { value: "pre-move-support", label: "I have a reservation & need pre-move help" },
  { value: "general-support", label: "General customer support" },
] as const;

type InquiryType = (typeof INQUIRY_TYPES)[number]["value"];

interface FormData {
  inquiryType: InquiryType;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  message: string;
}

interface FieldErrors {
  inquiryType?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_RE = /\S+@\S+\.\S+/;

function validate(form: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.inquiryType) errors.inquiryType = "Please select a reason";
  if (!form.name.trim()) errors.name = "Your name is required";
  if (!form.email.trim() || !EMAIL_RE.test(form.email))
    errors.email = "A valid email is required";
  const phoneErr = getPhoneFieldError(form.phone);
  if (phoneErr) errors.phone = phoneErr;
  if (!form.message.trim() || form.message.trim().length < 10)
    errors.message = "Please describe how we can help (min 10 characters)";
  return errors;
}

const EMPTY: FormData = {
  inquiryType: "",
  name: "",
  email: "",
  phone: "",
  orderNumber: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phoneBlurred, setPhoneBlurred] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "phone") {
      setErrors((prev) => {
        const next = { ...prev };
        if (typeof value === "string" && isValidVisitorPhone(value)) {
          delete next.phone;
        }
        return next;
      });
      return;
    }
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const phoneResolvedError =
    phoneBlurred || errors.phone !== undefined
      ? getPhoneFieldError(form.phone)
      : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    setResult(null);

    try {
      const typeLabel =
        INQUIRY_TYPES.find((t) => t.value === form.inquiryType)?.label ?? form.inquiryType;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: form.inquiryType,
          typeLabel,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: toE164(form.phone)!,
          orderNumber: form.orderNumber.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      if (res.ok) {
        setResult({
          ok: true,
          msg: "Your message has been sent. We'll get back to you shortly.",
        });
        setForm(EMPTY);
        setPhoneBlurred(false);
      } else {
        const data = await res.json().catch(() => null);
        setResult({
          ok: false,
          msg: data?.error ?? "Something went wrong. Please try again.",
        });
      }
    } catch {
      setResult({
        ok: false,
        msg: "Network error — please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const showOrderField =
    form.inquiryType === "storage-client" ||
    form.inquiryType === "active-move" ||
    form.inquiryType === "pre-move-support";

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
          ✓
        </div>
        <h3 className="font-heading text-xl text-heading">Message Sent!</h3>
        <p className="mt-2 text-body">{result.msg}</p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Inquiry type */}
      <FieldWrapper label="How can we help you?" error={errors.inquiryType}>
        <select
          value={form.inquiryType}
          onChange={(e) => update("inquiryType", e.target.value as InquiryType)}
          className={inputClass(!!errors.inquiryType, !form.inquiryType)}
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value} disabled={t.value === ""}>
              {t.label}
            </option>
          ))}
        </select>
      </FieldWrapper>

      {/* Name + Email row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrapper label="Full Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className={inputClass(!!errors.name)}
          />
        </FieldWrapper>
        <FieldWrapper label="Email Address" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className={inputClass(!!errors.email)}
          />
        </FieldWrapper>
      </div>

      {/* Phone + Order number row */}
      <div className={`grid gap-5 ${showOrderField ? "sm:grid-cols-2" : ""}`}>
        <FieldWrapper label="Phone Number" error={phoneResolvedError}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", formatPhoneInput(e.target.value))}
            onBlur={() => setPhoneBlurred(true)}
            placeholder="(555) 123-4567"
            autoComplete="tel"
            aria-invalid={phoneResolvedError ? true : undefined}
            className={inputClass(!!phoneResolvedError)}
          />
        </FieldWrapper>
        {showOrderField && (
          <FieldWrapper label="Order / Reservation #" hint="(optional)">
            <input
              type="text"
              value={form.orderNumber}
              onChange={(e) => update("orderNumber", e.target.value)}
              placeholder="e.g. ORD-12345"
              className={inputClass(false)}
            />
          </FieldWrapper>
        )}
      </div>

      {/* Message */}
      <FieldWrapper label="Your Message" error={errors.message}>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          placeholder="Please describe how we can help you..."
          className={inputClass(!!errors.message) + " resize-y"}
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
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

/* ─── Inline helpers ──────────────────────────────────────────── */

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
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-heading">
        {label}
        {hint && <span className="ml-1 font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
