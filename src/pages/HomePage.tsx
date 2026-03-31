import { FaHeart, FaHandshake, FaArrowUp } from "react-icons/fa";
import Seo from "@/components/ui/Seo";
import Hero from "@/components/ui/Hero";
import ServiceCard from "@/components/ui/ServiceCard";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import IconBox from "@/components/ui/IconBox";
import { SEO } from "@/data/seo";
import { SERVICES } from "@/data/services";
import { COMPANY } from "@/data/company";

export default function HomePage() {
  const seo = SEO.home;

  return (
    <>
      <Seo
        {...seo}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: seo.canonical,
          name: COMPANY.shortName,
          potentialAction: {
            "@type": "SearchAction",
            target: `${COMPANY.domain}/?s={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <Hero />

      {/* Our Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-heading text-3xl">Our Mission</h2>
              <p className="leading-relaxed">
                We at Let&apos;s Move It Right try to exceed customer expectations by understanding
                each of our customer&apos;s touch points. Every day &mdash; on or off the job &mdash; our
                actions create an impression with our clients, our colleagues, and our communities.
                Our conduct determines how we are viewed. We pride ourselves on operating under the
                guiding principles that we call our values. They include: safety &mdash; for our
                customers and employees &mdash; people, honesty, trust, and most importantly, the one
                value that transcends all others: integrity.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/images/respect-ethics-honesty-integrity-300x225.jpg"
                alt="Respect, Ethics, Honesty, Integrity"
                className="rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why We Are Different */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center font-heading text-3xl">Why We Are Different</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <IconBox
              icon={FaHeart}
              title="WE ARE PASSIONATE"
              text="We have a proven record of accomplishment and are a reputable company in Los Angeles. We ensure that all projects are done with the utmost professionalism and offer our clients the support and accessibility they need to handle anything on move day."
            />
            <IconBox
              icon={FaHandshake}
              title="HONEST AND DEPENDABLE"
              text="For us, the honesty and integrity of our moving crews, office staff, and management are our cornerstones. With thousands of successful moves under our belt, we are one of the most trusted moving companies in Los Angeles."
            />
            <IconBox
              icon={FaArrowUp}
              title="WE ARE ALWAYS IMPROVING"
              text="We commit ourselves to complete all moves within the timeline set with our clients. We use the best technology and tools to ensure that all jobs are done quickly, efficiently, and damage-free."
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center font-heading text-3xl">Our Services</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      {/* Bottom CTA */}
      <section className="bg-heading py-12 text-center text-white">
        <div className="mx-auto max-w-7xl px-4">
          <p className="font-heading text-2xl md:text-4xl">
            Easy, Safe &amp; Affordable Moving.
          </p>
          <p className="mt-4 text-lg">
            Call Us Now at:{" "}
            <a href={`tel:${COMPANY.phone}`} className="font-bold text-primary hover:text-primary-dark">
              {COMPANY.phone}
            </a>
          </p>
        </div>
      </section>
      </>
  );
}
