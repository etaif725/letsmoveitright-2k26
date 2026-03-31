import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import Sidebar from "@/components/layout/Sidebar";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";

export default function CorporateRelocationPage() {
  return (
    <>
      <Seo {...SEO.corporateRelocation} />
      <PageTitle title="Corporate Relocation" />
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <article className="prose max-w-none">
            <p>
              For expert corporate relocation services in the Los Angeles area, look no further.
              Let&apos;s Move It Right has a team of experts dedicated to helping employees and
              businesses streamline the relocation process. Our goal is to make this often
              complicated process run as smoothly as possible for our customers.
            </p>
            <p>
              Our comprehensive business moving services range from internal office transfers to
              the relocation of hundreds of employees across town. We can assist in coordinating
              all aspects of your move.
            </p>
            <p>
              We&apos;ll work with building management, contractors, telephone equipment
              installers, technology consultants, and anyone else involved in making your new place
              feel like home.
            </p>
            <p>
              Your appointed move manager will make sure that your move goes smoothly while
              minimizing any disruption to your business and your employees.
            </p>
            <p>
              Each item we move during your corporate relocation is logged and inventoried so you
              know that each and every item was delivered and in good condition.
            </p>
            <p>
              Most of all, we provide you with the peace of mind that comes with knowing that your
              goods are in the hands of professionals throughout each step.
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
