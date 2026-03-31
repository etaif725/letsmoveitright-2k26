import { FaShieldAlt, FaStar, FaTruck, FaPhone } from "react-icons/fa";
import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import { QuoteFormPage } from "@/components/forms/QuoteFormPage";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";

export default function GetFreeQuotePage() {
  return (
    <>
      <Seo {...SEO.getFreeQuote} />
      <PageTitle
        title="Get a Free Quote"
        subtitle="TELL US ABOUT YOUR MOVE AND WE'LL PROVIDE A FREE ESTIMATE"
      />

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_360px]">
          {/* ── Left: Form ── */}
          <div>
            <h2 className="mb-2 font-heading text-2xl text-heading">
              Request Your Free Moving Quote
            </h2>
            <p className="mb-8 max-w-xl text-body">
              Fill out the details below and we'll get back to you with a
              no-obligation estimate. The more details you provide, the more
              accurate your quote will be.
            </p>

            <QuoteFormPage />
          </div>

          {/* ── Right: Sidebar ── */}
          <aside className="space-y-8 lg:pt-12">
            {/* Why choose us */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-heading text-lg text-heading">
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                <TrustItem icon={FaShieldAlt} title="Licensed & Insured">
                  Full coverage so your belongings are protected every step of
                  the way.
                </TrustItem>
                <TrustItem icon={FaStar} title="5-Star Rated">
                  Hundreds of happy customers across the Los Angeles area.
                </TrustItem>
                <TrustItem icon={FaTruck} title="10,000+ Moves Completed">
                  Experienced crews who handle your items with care.
                </TrustItem>
              </ul>
            </div>

            {/* Call CTA */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
              <h3 className="mb-2 font-heading text-lg text-heading">
                Need Help Right Away?
              </h3>
              <p className="mb-4 text-sm text-body">
                Our moving specialists are available to answer your questions and
                provide an estimate over the phone.
              </p>
              <a
                href={`tel:${COMPANY.phone}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
              >
                <FaPhone className="text-sm" />
                Call {COMPANY.phone}
              </a>
            </div>

            {/* Services list */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-heading text-lg text-heading">
                Services We Offer
              </h3>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Local Residential
                  Moving
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Long Distance Moving
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Corporate Relocation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Packing & Unpacking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Storage Solutions
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function TrustItem({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 shrink-0 text-lg text-primary" />
      <div>
        <p className="font-semibold text-heading">{title}</p>
        <p className="text-sm text-body">{children}</p>
      </div>
    </li>
  );
}
