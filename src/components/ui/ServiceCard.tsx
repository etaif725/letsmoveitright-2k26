import { Link } from "react-router-dom";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Link
      to={service.href}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          <Icon className="text-2xl text-primary" />
          <h3 className="font-heading text-lg text-heading">{service.title}</h3>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed">{service.excerpt}</p>
      </div>
    </Link>
  );
}
