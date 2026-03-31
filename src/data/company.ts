export const COMPANY = {
  name: "Let's Move It Right",
  shortName: "Lets Move It Right",
  tagline: "Full Service Moving Company",
  phone: "1-800-956-1118",
  phoneAlt: "1-888-535-9797",
  address: {
    street: "503 Jessie Street",
    city: "San Fernando",
    state: "CA",
    zip: "91340",
  },
  warehouse: {
    label: "Warehousing Storage",
    detail: "Over 30,000 sq ft",
  },
  fullAddress: "503 Jessie Street, San Fernando, CA 91340",
  copyright: `©${new Date().getFullYear()} Let's Move It Right. All rights reserved.`,
  domain: "https://www.letsmoveit-right.com",
} as const;

export const MOVE_SIZES = [
  "Studio",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "4+ Bedroom",
  "Commercial/Office",
] as const;

export type MoveSize = (typeof MOVE_SIZES)[number];
