import { NavLink } from "react-router-dom";
import { SERVICES } from "@/data/services";
import { QuoteForm } from "@/components/forms/QuoteForm";

export default function Sidebar() {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="space-y-6">
        {/* Services nav */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 border-b-2 border-primary pb-2 font-heading text-lg text-heading">
            OUR SERVICES
          </h3>
          <ul className="space-y-2">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <NavLink
                  to={service.href}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-primary font-bold text-dark-accent"
                        : "text-body hover:bg-gray-100 hover:text-heading"
                    }`
                  }
                >
                  {service.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Compact lead form */}
        <div id="quoteForm" className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <QuoteForm />
        </div>
      </div>
    </aside>
  );
}
