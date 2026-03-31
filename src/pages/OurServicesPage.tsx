import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import ServiceCard from "@/components/ui/ServiceCard";
import { SEO } from "@/data/seo";
import { SERVICES } from "@/data/services";

export default function OurServicesPage() {
  return (
    <>
      <Seo {...SEO.ourServices} />
      <PageTitle title="Our Services" subtitle="WHAT WE CAN DO FOR YOU" />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
