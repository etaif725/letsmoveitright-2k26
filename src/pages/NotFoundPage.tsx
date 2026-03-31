import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Lets Move It Right</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <section className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="text-center">
          <h1 className="mb-4 font-heading text-6xl text-heading">404</h1>
          <h2 className="mb-4 font-heading text-2xl text-heading">Page Not Found</h2>
          <p className="mx-auto mb-8 max-w-md text-body">
            The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/">Go Home</Button>
            <Button href="/contact-us" variant="outline">
              Contact Us
            </Button>
          </div>
          <p className="mt-8 text-sm text-body">
            Looking for something? Try browsing our{" "}
            <Link to="/our-services" className="text-link hover:text-link-hover">
              services
            </Link>{" "}
            or{" "}
            <Link to="/blog" className="text-link hover:text-link-hover">
              blog
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
