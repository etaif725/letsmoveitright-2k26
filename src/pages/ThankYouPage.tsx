import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Seo from "@/components/ui/Seo";
import { COMPANY } from "@/data/company";

const REDIRECT_SECONDS = 5;

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDuplicate = (location.state as { isDuplicate?: boolean } | null)?.isDuplicate ?? false;
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <Seo
        title={`Thank You - ${COMPANY.shortName}`}
        description="Thank you for your submission. We'll be in touch shortly."
        canonical={`${COMPANY.domain}/thank-you`}
      />

      <section className="py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-heading text-3xl text-heading md:text-4xl">
            Thank You!
          </h1>
          <p className="mt-4 text-lg text-body">
            {isDuplicate
              ? "Your request has already been submitted before. One of our moving specialists will be in touch with you shortly."
              : "Your quote request has been received. One of our moving specialists will be in touch with you shortly."}
          </p>

          <div className="mt-8 rounded-lg bg-gray-50 p-6">
            <p className="text-sm text-body">
              Need immediate assistance? Call us directly:
            </p>
            <a
              href={`tel:${COMPANY.phone}`}
              className="mt-2 inline-block text-2xl font-bold text-link hover:text-link-hover"
            >
              {COMPANY.phone}
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Redirecting to the homepage in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </section>
    </>
  );
}
