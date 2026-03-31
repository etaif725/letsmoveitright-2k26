import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
} from "react-icons/fa";
import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import { ContactForm } from "@/components/forms/ContactForm";
import { COMPANY } from "@/data/company";

export default function SubmitTicketPage() {
  return (
    <>
      <Seo
        title={`Submit a Ticket - ${COMPANY.shortName}`}
        description="Submit a support ticket for customer service inquiries, storage questions, or pre-move support. We're here to help."
        canonical={`${COMPANY.domain}/contact-us/submit-ticket`}
      />
      <PageTitle
        title="Submit a Ticket"
        subtitle="TELL US HOW WE CAN HELP AND WE'LL GET BACK TO YOU"
      />

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_360px]">
          {/* ── Left: Form ── */}
          <div>
            <h2 className="mb-2 font-heading text-2xl text-heading">
              How Can We Help?
            </h2>
            <p className="mb-8 max-w-xl text-body">
              Whether you're a new customer looking to speak with someone about
              your upcoming move, or an existing client who needs support with
              storage, a scheduled pickup, or your reservation — we're here for
              you. Select the option that best describes your situation below.
            </p>

            <ContactForm />
          </div>

          {/* ── Right: Sidebar ── */}
          <aside className="space-y-8 lg:pt-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-lg text-heading">
                Our Office
              </h3>
              <address className="space-y-4 not-italic text-body">
                <InfoRow icon={FaMapMarkerAlt}>
                  <p className="font-bold text-heading">{COMPANY.name}</p>
                  <p>{COMPANY.address.street}</p>
                  <p>
                    {COMPANY.address.city}, {COMPANY.address.state}{" "}
                    {COMPANY.address.zip}
                  </p>
                </InfoRow>

                <InfoRow icon={FaPhone}>
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="font-bold text-link hover:text-link-hover"
                  >
                    {COMPANY.phone}
                  </a>
                </InfoRow>

                <InfoRow icon={FaEnvelope}>
                  <a
                    href="mailto:info@letsmoveit-right.com"
                    className="text-link hover:text-link-hover"
                  >
                    info@letsmoveit-right.com
                  </a>
                </InfoRow>

                <InfoRow icon={FaClock}>
                  <p>Mon – Fri: 8 AM – 7 PM</p>
                  <p>Sat: 9 AM – 5 PM</p>
                  <p className="text-sm text-gray-400">Sun: Closed</p>
                </InfoRow>
              </address>
            </div>

            <div>
              <a
                href="https://www.facebook.com/letsmoveitright"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-link hover:text-link-hover"
                aria-label="Visit our Facebook page"
              >
                <FaFacebook size={24} />
                <span className="text-sm font-bold">
                  Follow us on Facebook
                </span>
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-1 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  );
}
