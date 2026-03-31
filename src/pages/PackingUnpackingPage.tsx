import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import Sidebar from "@/components/layout/Sidebar";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";

export default function PackingUnpackingPage() {
  return (
    <>
      <Seo {...SEO.packingUnpacking} />
      <PageTitle title="Packing & Unpacking Services" />
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <article className="prose max-w-none">
            <p>
              Let&apos;s Move It Right specializes in professional packing and unpacking services
              for your move. We are a full service moving company dedicated to making your
              relocation a pleasurable experience (yes, it&apos;s possible!)
            </p>
            <p>
              Whether you&apos;re moving household or commercial goods, count on us to
              professionally pack and protect them. We use proven methods and packing materials to
              make sure your fine china, art, furniture, electronics and all your items will arrive
              at their new home in the same condition they left.
            </p>
            <p>
              Our movers and packers are hand-picked for their competence, professionalism and
              courtesy. They&apos;ll make sure your move &mdash; from packing to unpacking &mdash;
              goes smoothly.
            </p>
            <p>
              We are fully licensed and insured, and fully committed to your complete satisfaction.
              That&apos;s why we go the extra mile to make sure your belongings arrive at their
              destination safely and on time. When you need your possessions protected, don&apos;t
              choose a fly-by-night company. Move with Let&apos;s Move It Right, the packing pros.
            </p>
            <p>
              We can tailor our packing services to fit your timeline and your budget. Let us know
              how we can help and we&apos;ll take care of all your moving needs.
            </p>

            <h3>Packing</h3>
            <p>
              We bring all the materials and pack for you. We blanket wrap your furniture for
              transit. You don&apos;t have to lift a finger.
            </p>

            <h3>Unpacking</h3>
            <p>
              We place your furniture right where you want it. We unpack each box and place items
              for you to put away. We haul away empty boxes after we&apos;ve unpacked them.
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
