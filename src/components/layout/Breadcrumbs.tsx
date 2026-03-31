import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

const LABEL_MAP: Record<string, string> = {
  "": "Home",
  "our-services": "Our Services",
  "about-us": "About Us",
  "contact-us": "Contact Us",
  "submit-ticket": "Submit a Ticket",
  "get-free-quote": "Get a Free Quote",
  blog: "Blog",
  "local-residential-moving": "Local Residential Moving",
  "packing-unpacking-services": "Packing & Unpacking Services",
  "corporate-relocation": "Corporate Relocation",
  "storage-services": "Storage Services",
  "best-time-make-move": "Best Time To Move",
  "moving-checklist": "Moving Checklist",
  "moving-terms": "Moving Terms",
  "packing-tips": "Packing Tips",
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = [
    { label: "Home", href: "/" },
    ...segments.map((segment, i) => ({
      label: LABEL_MAP[segment] ?? segment.replace(/-/g, " "),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="mt-3">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-body">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <FaChevronRight className="text-[8px] text-gray-400" />}
            {i === crumbs.length - 1 ? (
              <span className="text-heading">{crumb.label}</span>
            ) : (
              <Link to={crumb.href} className="hover:text-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
