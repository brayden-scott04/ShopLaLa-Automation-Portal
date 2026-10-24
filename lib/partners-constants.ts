import { Factory, Ship, type LucideIcon } from "lucide-react";

/**
 * Field registry for /supply-chain/partners. Kept out of lib/actions/partners.ts because a
 * "use server" file must not export plain constants (see CLAUDE.md → Server Actions).
 * Adding a field here needs no migration: values live one row per cell in supply_partner_fields.
 */

export type PartnerKind = "factory" | "forwarder";

export interface PartnerField {
  key: string;
  label: string;
}

export const FACTORY_FIELDS: PartnerField[] = [
  { key: "name_cn", label: "Factory Name (Chinese)" },
  { key: "name_en", label: "Factory Name (English)" },
  { key: "address", label: "Factory Address" },
  { key: "key_products", label: "Factory Key Products" },
  { key: "owner", label: "Factory Owner" },
  { key: "contact_1", label: "Contact Person 1" },
  { key: "contact_2", label: "Contact Person 2" },
  { key: "trade_term", label: "Trade Term" },
  { key: "payment_term", label: "Payment Term" },
  { key: "sku", label: "SKU" },
];

export const FORWARDER_FIELDS: PartnerField[] = [
  { key: "name_cn", label: "Forwarder Company Name (Chinese)" },
  { key: "name_en", label: "Forwarder Company Name (English)" },
  { key: "address", label: "Forwarder Address" },
  { key: "owner", label: "Forwarder Company Owner" },
  { key: "contact_1", label: "Contact Person 1" },
  { key: "contact_2", label: "Contact Person 2" },
  { key: "payment_term", label: "Payment Term" },
];

export const FORWARDER_LANES = [
  { key: "us", label: "US" },
  { key: "ca", label: "CA" },
  { key: "au", label: "AU" },
  { key: "eu_sea", label: "EU (Sea)" },
  { key: "eu_train", label: "EU (Train)" },
] as const;

export type ForwarderLane = (typeof FORWARDER_LANES)[number]["key"];

/** Per-lane rows. Stored as `<lane>.<key>`, e.g. `us.ref_price_ss`. SS/OS = standard size / oversize. */
export const LANE_FIELDS: PartnerField[] = [
  { key: "min_volume", label: "Minimum shipping volume/weight" },
  { key: "ref_price_ss", label: "Reference Price for SS (CNY)" },
  { key: "ref_price_os", label: "Reference Price for OS (CNY)" },
  { key: "ship_time_ss", label: "Shipping Time for SS" },
  { key: "ship_time_os", label: "Shipping Time for OS" },
  { key: "fee_wood", label: "Additional Fee for Wood" },
  { key: "fee_coco", label: "Additional Fee for Coco products" },
  { key: "box_length_limit", label: "Outer box restriction for each length" },
  { key: "fee_long_box", label: 'Additional fee for extra long box (>48")' },
  { key: "box_weight_limit", label: "Outer box weight restriction" },
  { key: "etd", label: "Shipping Date (ETD)" },
  { key: "label_cutoff", label: "Label cut off date" },
];

export function laneFieldKey(lane: ForwarderLane, field: string): string {
  return `${lane}.${field}`;
}

/** Every field key a partner of this kind may store; the server rejects anything else. */
export function validFieldKeys(kind: PartnerKind): Set<string> {
  if (kind === "factory") return new Set(FACTORY_FIELDS.map((f) => f.key));
  const keys = FORWARDER_FIELDS.map((f) => f.key);
  for (const lane of FORWARDER_LANES) {
    for (const f of LANE_FIELDS) keys.push(laneFieldKey(lane.key, f.key));
  }
  return new Set(keys);
}

export const SHORT_NAME_MAX = 32;

/** Per-view presentation. Full class strings so Tailwind picks them up. */
export const PARTNER_VIEWS: Record<
  PartnerKind,
  {
    title: string;
    singular: string;
    description: string;
    icon: LucideIcon;
    activeTile: string;
    iconWrap: string;
    accentBorder: string;
  }
> = {
  factory: {
    title: "Factories",
    singular: "factory",
    description: "Manufacturers we buy from",
    icon: Factory,
    activeTile: "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30",
    iconWrap: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    accentBorder: "border-t-amber-500",
  },
  forwarder: {
    title: "Forwarders",
    singular: "forwarder",
    description: "Freight forwarders shipping to Amazon",
    icon: Ship,
    activeTile: "border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/30",
    iconWrap: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    accentBorder: "border-t-sky-500",
  },
};
