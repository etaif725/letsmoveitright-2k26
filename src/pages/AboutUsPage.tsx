import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";

export default function AboutUsPage() {
  return (
    <>
      <Seo {...SEO.aboutUs} />
      <PageTitle title="About Us" subtitle="Company: Who We Are" />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <article className="prose mx-auto max-w-4xl">
            <p>
              We are committed to your move from start to finish. Our friendly and always helpful
              customer service representatives are available to assist you with any aspect of your
              move. We&apos;re determined to help make your move as stress-free as possible.
            </p>
            <p>
              Our courteous movers are responsive to your particular needs so that we can move you
              with the highest quality of care and efficiency.
            </p>
            <p>
              We use the latest equipment available to keep your property and premises damage free.
              From our white glove treatment to our rolling out the red carpet (floor runners), we
              know just what it takes to move you. All fragile goods will get soft cloth padding,
              shrink-wrap (plastic), and/or cardboard coverings for greater protection from the
              outside elements.
            </p>
            <p>
              All of our trucks are fully stocked with the supplies needed to pack your goods and
              ensure they arrive at your new home safely.
            </p>
            <p>
              We will gladly furnish references upon request. Also, please feel free to check with
              your state and local agencies to further verify our good name.
            </p>
            <p>
              Our main growth has been a direct result of repeat business and word of mouth
              referrals. We&apos;ll do whatever it takes to earn your business today so that we can
              have your business tomorrow and all the years to come.
            </p>
            <p>
              We are a long established moving company with an excellent reputation throughout
              Southern California.
            </p>

            <h2>Other reasons why you should choose us to move you:</h2>
            <ul>
              <li>Packing, unpacking, and crating services offered</li>
              <li>Licensed</li>
              <li>Insured</li>
              <li>Bonded</li>
              <li>Extra move insurance available</li>
              <li>Free wardrobe boxes</li>
              <li>Extra padding and protection included</li>
              <li>Free Box Delivery</li>
            </ul>

            <div className="mt-8 rounded-lg bg-primary/10 p-6 text-center">
              <p className="text-lg font-bold text-heading">Easy, Safe &amp; Affordable Moving!</p>
              <p className="mt-2">
                Call Us Now at:{" "}
                <a href={`tel:${COMPANY.phone}`} className="font-bold text-link hover:text-link-hover">
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
