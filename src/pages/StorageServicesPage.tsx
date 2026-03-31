import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import Sidebar from "@/components/layout/Sidebar";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";

export default function StorageServicesPage() {
  return (
    <>
      <Seo {...SEO.storageServices} />
      <PageTitle title="Storage Services" />
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <article className="prose max-w-none">
            <p>
              Our clients depend on our storage services for a wide variety of needs. Our 30,000
              sq. ft. storage warehouse means we have all the storage space you need:
            </p>
            <ul>
              <li>Short-term or long-term storage between moving dates.</li>
              <li>Storage for all your business archives. We can make them available whenever needed.</li>
              <li>Off-season clothing, furniture and equipment until you need them again.</li>
              <li>Cluttered house? We&apos;ll help you fix that and keep your items pristine at the same time.</li>
              <li>Specialized storage of your art, furniture, and antique collections.</li>
              <li>Personal item storage while subletting your apartment.</li>
              <li>Temporary or long-term storage</li>
              <li>24-hour access</li>
              <li>State of the art security</li>
              <li>Climate controlled storage units</li>
            </ul>
            <p>
              We can guarantee that all your possessions and items will be moved efficiently and
              cost-effectively from one area to another. Whether you choose to deliver your storage
              items yourself or have us pack and bring them to our facility, we can assure you the
              best storage service at the right price.
            </p>

            <div className="mt-8 rounded-lg bg-primary/10 p-6 text-center">
              <p className="font-heading text-xl text-heading">
                Call Now at:{" "}
                <a href={`tel:${COMPANY.phone}`} className="text-link hover:text-link-hover">
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </article>
          <Sidebar />
        </div>
      </section>
    </>
  );
}
