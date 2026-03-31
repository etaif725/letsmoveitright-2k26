import { FaShieldAlt, FaStar, FaTruck } from "react-icons/fa";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { COMPANY } from "@/data/company";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-heading">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/local-movers-los-angeles-960x290.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
          {/* Left: Copy */}
          <div className="text-white">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
              {COMPANY.tagline}
            </p>
            <h1 className="font-heading text-4xl leading-tight text-white md:text-5xl lg:text-[3.5rem]">
              Los Angeles Movers
              <br />
              <span className="text-primary">You Can Trust</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-300">
              We are an established and well-known Los Angeles moving company &mdash; fully
              licensed, insured, and dedicated to making your move stress-free at a price you
              can afford.
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-6">
              <TrustBadge icon={FaShieldAlt} text="Licensed & Insured" />
              <TrustBadge icon={FaStar} text="5-Star Rated" />
              <TrustBadge icon={FaTruck} text="10,000+ Moves" />
            </div>

            {/* Phone CTA for mobile (form is below on small screens) */}
            <div className="mt-8 lg:mt-10">
              <p className="text-gray-400">Or call us directly:</p>
              <a
                href={`tel:${COMPANY.phone}`}
                className="mt-1 inline-block font-heading text-2xl text-primary transition-colors hover:text-primary-dark"
              >
                {COMPANY.phone}
              </a>
            </div>
          </div>

          {/* Right: Quote form */}
          <div className="rounded-xl bg-white p-6 shadow-2xl lg:p-8">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-lg text-primary" />
      <span className="text-sm font-semibold text-gray-200">{text}</span>
    </div>
  );
}
