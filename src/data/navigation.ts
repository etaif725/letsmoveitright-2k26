export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  action?: "quote-modal";
}

export const MAIN_NAV: NavItem[] = [
  { label: "HOME", href: "/" },
  {
    label: "OUR SERVICES",
    href: "/our-services",
    children: [
      { label: "Local Residential Moving", href: "/our-services/local-residential-moving" },
      { label: "Packing & Unpacking Services", href: "/our-services/packing-unpacking-services" },
      { label: "Corporate Relocation", href: "/our-services/corporate-relocation" },
      { label: "Storage Services", href: "/our-services/storage-services" },
    ],
  },
  { label: "ABOUT US", href: "/about-us" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT US", href: "/contact-us" },
  { label: "GET A FREE QUOTE", href: "/get-free-quote", action: "quote-modal" },
];
