declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GADS_ID = "AW-11462476172";
const LEADS_CONVERSION_LABEL = "35mCCLXL45MZElyD3tkq";

export interface EnhancedConversionUser {
  /** Raw email — will be lowercased and trimmed automatically. */
  email?: string;
  /** E.164-formatted phone number, e.g. "+19725551234". */
  phone?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Push user-provided data to the Google tag before the conversion event fires.
 * Google normalises and hashes the values server-side.
 * Must be called immediately before trackConversion().
 * Spec: https://support.google.com/google-ads/answer/13262500
 */
function setEnhancedConversionData(user: EnhancedConversionUser): void {
  if (typeof window === "undefined" || !window.gtag) return;

  const data: Record<string, unknown> = {};

  if (user.email?.trim()) {
    data.email = user.email.trim().toLowerCase();
  }
  if (user.phone) {
    data.phone_number = user.phone; // must already be E.164
  }
  if (user.firstName?.trim() || user.lastName?.trim()) {
    data.address = {
      ...(user.firstName?.trim() && {
        first_name: user.firstName.trim().toLowerCase(),
      }),
      ...(user.lastName?.trim() && {
        last_name: user.lastName.trim().toLowerCase(),
      }),
    };
  }

  if (Object.keys(data).length > 0) {
    window.gtag("set", "user_data", data);
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export function trackConversion(
  conversionLabel?: string,
  value?: number,
  currency = "USD"
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: conversionLabel
        ? `${GADS_ID}/${conversionLabel}`
        : GADS_ID,
      ...(value !== undefined && { value, currency }),
    });
  }
}

export function trackQuoteSubmission(formData?: {
  moveSize?: string;
  pickupState?: string;
  destState?: string;
  user?: EnhancedConversionUser;
}): void {
  // Set enhanced conversions user data before the conversion event fires.
  if (formData?.user) {
    setEnhancedConversionData(formData.user);
  }

  trackEvent("generate_lead", {
    event_category: "Quote Form",
    event_label: formData?.moveSize || "Quote Submitted",
    ...(formData?.pickupState && { pickup_state: formData.pickupState }),
    ...(formData?.destState && { destination_state: formData.destState }),
  });

  trackConversion(LEADS_CONVERSION_LABEL);
}

export function trackPhoneCall(): void {
  trackEvent("phone_call", {
    event_category: "Contact",
    event_label: "Phone Click",
  });
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
  });
}
