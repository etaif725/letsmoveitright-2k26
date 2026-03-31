import Seo from "@/components/ui/Seo";
import PageTitle from "@/components/layout/PageTitle";
import Sidebar from "@/components/layout/Sidebar";
import { SEO } from "@/data/seo";
import { COMPANY } from "@/data/company";

export default function LocalResidentialMovingPage() {
  return (
    <>
      <Seo {...SEO.localResidentialMoving} />
      <PageTitle title="Local Residential Moving" />
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <article className="prose max-w-none">
            <p>
              We believe in providing low cost and efficient moving. Our staff has performed
              thousands of local residential moves and they will happily answer any questions that
              you may have. We will take care of all your residential moving needs, and believe it
              or not, it will cost you much less than it would if you were to carry out the move
              yourself.
            </p>
            <p>
              When you&apos;re moving to a new place in the same city &mdash; or even in the same
              neighborhood &mdash; it can be all too easy to forget that it takes the same amount of
              organization and effort as if you were moving to a different state. This can make for
              a long, frustrating, and exhausting day.
            </p>
            <p>
              Why not leave the hard work to us? Simply meet us at the door, and then go out on the
              town for the day. We&apos;ll take care of everything, including:
            </p>
            <ul>
              <li>Providing boxes, pads, and other packing materials</li>
              <li>Wrapping of special items to ensure their security</li>
              <li>Packing, delivery, and unpacking of your entire household</li>
              <li>Organization tips and checklists to help every aspect of your move go smoothly</li>
              <li>Secure, climate-controlled storage for valued items</li>
              <li>
                We&apos;ll even load and unload as you instruct to help the setup of your new home go
                as quickly as possible
              </li>
            </ul>
            <p>
              Give us a call for an estimate today! We&apos;ll make a customized moving plan to make
              sure your move gets done right! Let&apos;s Move It Right!
            </p>
            <div className="mt-8 rounded-lg bg-primary/10 p-6 text-center">
              <p className="font-heading text-xl text-heading">
                Call Now at:{" "}
                <a href={`tel:${COMPANY.phoneAlt}`} className="text-link hover:text-link-hover">
                  {COMPANY.phoneAlt}
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
