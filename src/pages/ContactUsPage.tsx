import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaPhone,
  FaEnvelope,
  FaComments,
  FaHandshake,
} from "react-icons/fa";
import Seo from "@/components/ui/Seo";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";
import { useQuoteModal } from "@/components/ui/QuoteModal";

export default function ContactUsPage() {
  const quoteModal = useQuoteModal();

  return (
    <>
      <Seo {...SEO.contactUs} />

      {/* ── Hero banner ── */}
      <section className="relative bg-heading">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(/images/local-movers-los-angeles-960x290.jpg)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <p className="text-sm text-gray-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>{" "}
            › Contact Us
          </p>
          <h1 className="mt-4 font-heading text-3xl text-white md:text-4xl lg:text-5xl">
            Contact {COMPANY.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">
            {COMPANY.name} values your feedback and inquiries. Whether you're
            planning a move or are an existing client needing support, we're here
            to help. We pride ourselves on being your source of guidance and
            resources for the best moving experience possible.
          </p>
          <p className="mt-4 max-w-2xl text-gray-300">
            Contact us today to learn more about our services, share your
            experience with us, or seek information not covered on our site.
          </p>
          <Link
            to="/contact-us/submit-ticket"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3.5 text-base font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
          >
            SUBMIT A TICKET
          </Link>
        </div>
      </section>

      {/* ── Our Commitment ── */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl text-heading">
            Our Commitment
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded bg-primary" />
          <p className="mt-8 leading-relaxed text-body">
            As a full-service moving company, {COMPANY.name} is dedicated to
            providing reliable, affordable, and stress-free moving services. We
            coordinate and manage every aspect of your move — from packing and
            loading to transportation and delivery. All estimated charges and
            final actual charges will be based on the services you need,
            available for inspection upon reasonable request.
          </p>
        </div>
      </section>

      {/* ── Feedback section (image + text) ── */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-2">
          <div className="h-64 overflow-hidden lg:h-full">
            <img
              src="/images/moving-fruniture-1024x682.jpg"
              alt="Moving team at work"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="px-6 py-12 lg:px-16 lg:py-20">
            <FaComments className="mb-4 text-3xl text-primary" />
            <h2 className="font-heading text-2xl text-heading lg:text-3xl">
              Your Feedback Matters to Us
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              Your feedback helps us improve. Tell us how we're doing. We
              appreciate your input and use it to enhance our services. We're
              committed to maintaining the best moving services for you, your
              family, or your company.
            </p>
            <Link
              to="/contact-us/submit-ticket"
              className="mt-6 inline-block text-sm font-bold uppercase tracking-wide text-link hover:text-link-hover"
            >
              Send Us a Message →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reach Out CTA ── */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <FaHandshake className="mx-auto mb-4 text-4xl text-primary" />
          <h2 className="text-center font-heading text-2xl text-heading lg:text-3xl">
            Reach Out to {COMPANY.name} Today
          </h2>
          <p className="mt-4 text-center leading-relaxed text-body">
            Your voice matters to us. We're always eager to hear from our
            customers and partners. Please reach out with questions, suggestions,
            or concerns. Our team is here to assist you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact-us/submit-ticket"
              className="rounded-lg bg-primary px-8 py-3.5 text-base font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
            >
              SUBMIT A TICKET
            </Link>
            <button
              type="button"
              onClick={quoteModal.open}
              className="rounded-lg border-2 border-primary px-8 py-3.5 text-base font-bold text-primary transition-all hover:bg-primary hover:text-heading"
            >
              REQUEST A FREE QUOTE →
            </button>
          </div>
        </div>
      </section>

      {/* ── Contact info cards ── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-1 lg:grid-cols-3">
          <InfoCard
            icon={FaPhone}
            title="Call Us"
            lines={[
              <a
                key="p"
                href={`tel:${COMPANY.phone}`}
                className="font-bold text-link hover:text-link-hover"
              >
                {COMPANY.phone}
              </a>,
              "Mon – Fri: 8 AM – 7 PM",
              "Sat: 9 AM – 5 PM",
            ]}
          />
          <InfoCard
            icon={FaEnvelope}
            title="Email Us"
            lines={[
              <a
                key="e"
                href="mailto:info@letsmoveit-right.com"
                className="text-link hover:text-link-hover"
              >
                info@letsmoveit-right.com
              </a>,
            ]}
          />
          {/* <InfoCard
            icon={FaMapMarkerAlt}
            title="Visit Us"
            lines={[
              COMPANY.address.street,
              `${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}`,
            ]}
          /> */}
          <InfoCard
            icon={FaFacebook}
            title="Follow Us"
            lines={[
              <a
                key="fb"
                href="https://www.facebook.com/letsmoveitright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link hover:text-link-hover"
              >
                Facebook
              </a>,
            ]}
          />
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  lines: React.ReactNode[];
}) {
  return (
    <div className="rounded-lg bg-white p-6 text-center shadow-sm">
      <Icon className="mx-auto mb-3 text-2xl text-primary" />
      <h3 className="mb-2 font-heading text-base text-heading">{title}</h3>
      {lines.map((line, i) => (
        <p key={i} className="text-sm text-body">
          {line}
        </p>
      ))}
    </div>
  );
}
