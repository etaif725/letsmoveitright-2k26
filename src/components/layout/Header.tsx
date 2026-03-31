import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaPhone, FaHome, FaCogs, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { COMPANY } from "@/data/company";
import { MAIN_NAV } from "@/data/navigation";
import { useQuoteModal } from "@/components/ui/QuoteModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const quoteModal = useQuoteModal();

  return (
    <header className="bg-footer-bg bg-[url('/images/title-area-pattern.png')] shadow-md">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top header row: logo + info widgets */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="shrink-0">
            <img
              src="/images/logo-Lets-Move.png"
              alt={COMPANY.shortName}
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop info widgets */}
          <div className="hidden items-center gap-8 lg:flex">
            <HeaderWidget icon={<FaPhone className="text-2xl text-primary" />} title="Get a Quote" subtitle={<a href={`tel:${COMPANY.phone}`} target="_blank" rel="noopener noreferrer">{COMPANY.phone}</a>} />
            <HeaderWidget icon={<FaHome className="text-2xl text-primary" />} title={COMPANY.address.street} subtitle={<a href={`https://www.google.com/maps/place/${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state}, ${COMPANY.address.zip}`} target="_blank" rel="noopener noreferrer">{`${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}`}</a>} />
            <HeaderWidget icon={<FaCogs className="text-2xl text-primary" />} title={COMPANY.warehouse.label} subtitle={COMPANY.warehouse.detail} />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="rounded-md border border-primary p-2 text-heading lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="border-t border-gray-200 bg-footer-bg bg-[url('/images/title-area-pattern.png')]">
        <div className="mx-auto max-w-7xl px-4">
          {/* Desktop nav */}
          <ul className="hidden lg:flex">
            {MAIN_NAV.map((item) => (
              <li key={item.href} className="group relative">
                {item.children ? (
                  <>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-1 border-b-2 px-4 py-3 text-sm font-bold tracking-wide transition-colors ${
                          isActive
                            ? "border-primary text-heading"
                            : "border-transparent text-dark-accent hover:border-primary hover:text-heading"
                        }`
                      }
                    >
                      {item.label}
                      <FaChevronDown className="text-[10px]" />
                    </NavLink>
                    <ul className="invisible absolute left-0 top-full z-50 min-w-[240px] border border-primary-dark bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavLink
                            to={child.href}
                            className="block border-b border-gray-100 px-4 py-3 text-sm text-dark-accent transition-colors hover:bg-primary-dark hover:text-heading"
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : item.action === "quote-modal" ? (
                  <button
                    type="button"
                    onClick={quoteModal.open}
                    className="my-1.5 ml-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold tracking-wide text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    end={item.href === "/"}
                    className={({ isActive }) =>
                      `block border-b-2 px-4 py-3 text-sm font-bold tracking-wide transition-colors ${
                        isActive
                          ? "border-primary text-heading"
                          : "border-transparent text-dark-accent hover:border-primary hover:text-heading"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <ul className="border-t border-gray-200 lg:hidden">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-dark-accent"
                        onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                      >
                        {item.label}
                        <FaChevronDown className={`text-[10px] transition-transform ${openDropdown === item.href ? "rotate-180" : ""}`} />
                      </button>
                      {openDropdown === item.href && (
                        <ul className="bg-gray-50">
                          <li>
                            <NavLink
                              to={item.href}
                              end
                              className="block px-8 py-2 text-sm text-dark-accent hover:text-link"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              All Services
                            </NavLink>
                          </li>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavLink
                                to={child.href}
                                className="block px-8 py-2 text-sm text-dark-accent hover:text-link"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : item.action === "quote-modal" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        quoteModal.open();
                      }}
                      className="block w-full px-4 py-3 text-left text-sm font-bold text-dark-accent hover:text-link"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.href}
                      end={item.href === "/"}
                      className="block px-4 py-3 text-sm font-bold text-dark-accent hover:text-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
              {/* Mobile contact info */}
              <li className="border-t border-gray-200 px-4 py-4 text-sm">
                <a href={`tel:${COMPANY.phone}`} target="_blank" rel="noopener noreferrer"><p className="font-bold text-heading">{COMPANY.phone}</p></a>
                <a href={`https://www.google.com/maps/place/${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state}, ${COMPANY.address.zip}`} target="_blank" rel="noopener noreferrer"><p>{COMPANY.fullAddress}</p></a>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

function HeaderWidget({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: React.ReactNode | string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm font-bold text-heading">{title}</p>
        <p className="text-sm text-black">{subtitle}</p>
      </div>
    </div>
  );
}
