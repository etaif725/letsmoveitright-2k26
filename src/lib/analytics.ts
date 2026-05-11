declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GADS_ID = "AW-11462476172";

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
}): void {
  trackEvent("generate_lead", {
    event_category: "Quote Form",
    event_label: formData?.moveSize || "Quote Submitted",
    ...(formData?.pickupState && { pickup_state: formData.pickupState }),
    ...(formData?.destState && { destination_state: formData.destState }),
  });

  trackConversion();
}

export function trackPhoneCall(): void {
  trackEvent("phone_call", {
    event_category: "Contact",
    event_label: "Phone Click",
  });
}
