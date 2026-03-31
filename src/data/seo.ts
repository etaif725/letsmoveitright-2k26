import { COMPANY } from "@/data/company";

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
}

const BASE = COMPANY.domain;

export const SEO: Record<string, PageSeo> = {
  home: {
    title: `${COMPANY.shortName} - ${COMPANY.tagline}`,
    description:
      "Let's Move It Right is a full service moving company in Los Angeles. We offer local residential moving, corporate relocation, packing & unpacking, and storage services. Get a free quote today!",
    canonical: `${BASE}/`,
    ogType: "website",
  },
  aboutUs: {
    title: `About Us - ${COMPANY.shortName}`,
    description:
      "We are committed to your move from start to finish. Our friendly customer service representatives are available to assist you with any aspect of your move.",
    canonical: `${BASE}/about-us`,
  },
  ourServices: {
    title: `Our Services - ${COMPANY.shortName}`,
    description:
      "Let's Move It Right offers local residential moving, corporate relocation, packing & unpacking services, and storage services in the Los Angeles area.",
    canonical: `${BASE}/our-services`,
  },
  localResidentialMoving: {
    title: `Local Residential Moving - ${COMPANY.shortName}`,
    description:
      "We believe in providing low cost and efficient local residential moving services in Los Angeles. We've moved over 10,000 residents around town.",
    canonical: `${BASE}/our-services/local-residential-moving`,
  },
  packingUnpacking: {
    title: `Packing & Unpacking Services - ${COMPANY.shortName}`,
    description:
      "Professional packing and unpacking services for your move. We are a full service moving company dedicated to making your relocation a pleasurable experience.",
    canonical: `${BASE}/our-services/packing-unpacking-services`,
  },
  corporateRelocation: {
    title: `Corporate Relocation - ${COMPANY.shortName}`,
    description:
      "Expert corporate relocation services in the Los Angeles area. We help employees and businesses streamline the relocation process.",
    canonical: `${BASE}/our-services/corporate-relocation`,
  },
  storageServices: {
    title: `Storage Services - ${COMPANY.shortName}`,
    description:
      "Our clients depend on our 30,000 sq. ft. storage warehouse for short-term, long-term, and climate-controlled storage services.",
    canonical: `${BASE}/our-services/storage-services`,
  },
  contactUs: {
    title: `Contact Us - ${COMPANY.shortName}`,
    description: `Contact Let's Move It Right at ${COMPANY.phone}. ${COMPANY.fullAddress}. Get a free moving quote today.`,
    canonical: `${BASE}/contact-us`,
  },
  getFreeQuote: {
    title: `Get a Free Quote - ${COMPANY.shortName}`,
    description:
      "Get a free moving quote from Let's Move It Right. Fill out our simple form and a representative will contact you shortly.",
    canonical: `${BASE}/get-free-quote`,
  },
  blog: {
    title: `Moving Blog - ${COMPANY.shortName}`,
    description:
      "Tips and tricks to ease the stress of your move. Read our blog for packing tips, moving checklists, and more.",
    canonical: `${BASE}/blog`,
  },
};
