// Property vocabularies shared by the API (validation) and the client (forms, badges, filters).

export const LISTING_TYPES = ["sale", "rent", "lease", "shortlet"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  sale: "For Sale",
  rent: "For Rent",
  lease: "For Lease",
  shortlet: "Shortlet",
};

export const PROPERTY_STATUSES = ["available", "under_offer", "sold", "rented", "leased", "off_market"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: "Available",
  under_offer: "Under Offer",
  sold: "Sold",
  rented: "Rented",
  leased: "Leased",
  off_market: "Off Market",
};

// Off-market listings are hidden from the public website
export const PUBLIC_STATUSES: PropertyStatus[] = ["available", "under_offer", "sold", "rented", "leased"];

// Statuses that count as a closed deal on the dashboard
export const CLOSED_STATUSES: PropertyStatus[] = ["sold", "rented", "leased"];

export const PROPERTY_TYPES = ["residential", "commercial", "land", "luxury", "industrial"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  land: "Land",
  luxury: "Luxury",
  industrial: "Industrial",
};

export const PRICE_PERIODS = ["night", "month", "year"] as const;
export type PricePeriod = (typeof PRICE_PERIODS)[number];

export const PRICE_PERIOD_LABELS: Record<PricePeriod, string> = {
  night: "per night",
  month: "per month",
  year: "per year",
};

const PRICE_PERIOD_SHORT: Record<PricePeriod, string> = {
  night: "/night",
  month: "/month",
  year: "/year",
};

export const INQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number, pricePeriod?: string | null) {
  const amount = nairaFormatter.format(price);
  return pricePeriod && pricePeriod in PRICE_PERIOD_SHORT
    ? `${amount}${PRICE_PERIOD_SHORT[pricePeriod as PricePeriod]}`
    : amount;
}

// Compact form for tight spaces, e.g. ₦85M, ₦1.2B
export function formatPriceShort(price: number) {
  if (price >= 1e9) return `₦${+(price / 1e9).toFixed(1)}B`;
  if (price >= 1e6) return `₦${+(price / 1e6).toFixed(1)}M`;
  if (price >= 1e3) return `₦${+(price / 1e3).toFixed(0)}K`;
  return `₦${price}`;
}
