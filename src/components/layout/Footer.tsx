import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { COMPANY } from "@/data/company";
import { SERVICES } from "@/data/services";
import { useQuoteModal } from "@/components/ui/QuoteModal";

export default function Footer() {
  const quoteModal = useQuoteModal();

  return (
    <footer>
      {/* Main footer */}
      <div className="bg-footer-bg bg-[url('/images/title-area-pattern.png')] text-footer-text">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
          {/* About column */}
          <div>
            <h3 className="mb-4 font-heading text-lg text-footer-heading">ABOUT US</h3>
            <p className="mb-4 text-sm leading-relaxed">
              We are committed to your move from start to finish. Our friendly and always helpful
              customer service representatives are available to assist you with any aspect of your
              move to help make it a stress-free one.
            </p>
            <Link to="/about-us" className="text-sm font-bold text-link hover:text-link-hover">
              READ MORE
            </Link>
          </div>

          {/* Services column */}
          <div>
            <h3 className="mb-4 font-heading text-lg text-footer-heading">OUR SERVICES</h3>
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link to={service.href} className="text-sm hover:text-link">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="mb-4 font-heading text-lg text-footer-heading">CONTACT US</h3>
            <address className="not-italic">
              <p className="text-sm font-bold">{COMPANY.name}</p>
              <a href={`https://www.google.com/maps/place/${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state}, ${COMPANY.address.zip}`} target="_blank" rel="noopener noreferrer">
                <p className="text-sm">{COMPANY.address.street}</p>
                <p className="text-sm">
                  {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.zip}
                </p>
              </a>
              <a href={`tel:${COMPANY.phone}`} target="_blank" rel="noopener noreferrer">
                <p className="mt-2 text-sm font-bold">{COMPANY.phone}</p>
              </a>
            </address>
            {/* <a
              href="https://www.facebook.com/letsmoveitright"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-link hover:text-link-hover"
              aria-label="Visit our Facebook page"
            >
              <FaFacebook size={24} />
            </a> */}
            <div className="mt-5">
              <button
                type="button"
                onClick={quoteModal.open}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
              >
                Get a Free Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-primary py-4 text-center text-sm text-footer-text">
        <div className="mx-auto max-w-7xl px-4">{COMPANY.copyright}</div>
      </div>
    </footer>
  );
}
