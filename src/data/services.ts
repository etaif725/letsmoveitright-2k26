import type { IconType } from "react-icons";
import { FaTruck, FaBoxOpen, FaBuilding, FaWarehouse } from "react-icons/fa";

export interface Service {
  title: string;
  slug: string;
  href: string;
  excerpt: string;
  icon: IconType;
  image: string;
}

export const SERVICES: Service[] = [
  {
    title: "Local Residential Moving",
    slug: "local-residential-moving",
    href: "/our-services/local-residential-moving",
    excerpt:
      "We believe in providing low cost moves without compromising on efficiency. Our staff is specially trained in this type of moving and they will answer any question that you may have. We will take care of your residential move for you.",
    icon: FaTruck,
    image: "/images/furniture-movers-360x240.jpg",
  },
  {
    title: "Storage Services",
    slug: "storage-services",
    href: "/our-services/storage-services",
    excerpt:
      "Our clients depend on our storage service for a wide variety of needs: 30,000 sq. ft. storage warehouse, short-term storage between moving dates, business archives, off-season clothing, furniture and equipment.",
    icon: FaWarehouse,
    image: "/images/Storage-Services-360x240.png",
  },
  {
    title: "Corporate Relocation",
    slug: "corporate-relocation",
    href: "/our-services/corporate-relocation",
    excerpt:
      "For expert corporate relocation service in the Los Angeles area, look no further. Let's Move It Right has a team of experts dedicated to helping employees and businesses streamline the relocation process.",
    icon: FaBuilding,
    image: "/images/office-mover-360x240.jpg",
  },
  {
    title: "Packing & Unpacking Services",
    slug: "packing-unpacking-services",
    href: "/our-services/packing-unpacking-services",
    excerpt:
      "Specializing in professional packing and unpacking, we are a full service moving company dedicated to making your relocation a pleasurable experience. Whether you're moving household or commercial goods, count on us.",
    icon: FaBoxOpen,
    image: "/images/packing-unpacking-360x240.jpg",
  },
];
