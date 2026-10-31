import {
  CARE_COVERAGE_YEARS,
  FREE_SHIPPING_THRESHOLD,
  INTERNATIONAL_FREE_SHIPPING_THRESHOLD,
  US_GIFT_NECKLACE_THRESHOLD,
} from "./policies";
import { HANDLES } from "./store";

function dollars(amount: string): string {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export type ConversionIncentive = {
  id: string;
  kicker: string;
  offer: string;
  detail: string;
  href: string;
  cta: string;
};

export const conversionIncentives: readonly ConversionIncentive[] = [
  {
    id: "intl-ship",
    kicker: "International",
    offer: `Free shipping at $${dollars(INTERNATIONAL_FREE_SHIPPING_THRESHOLD)}`,
    detail: `International orders of $${dollars(INTERNATIONAL_FREE_SHIPPING_THRESHOLD)} or more ship free.`,
    href: "/policies/shipping",
    cta: "See shipping",
  },
  {
    id: "us-gift",
    kicker: "United States",
    offer: `Free Legacy necklace at $${dollars(US_GIFT_NECKLACE_THRESHOLD)}`,
    detail: `US orders of $${dollars(US_GIFT_NECKLACE_THRESHOLD)} or more include a free Legacy necklace.`,
    href: `/products/${HANDLES.legacy}`,
    cta: "Shop Legacy",
  },
  {
    id: "care",
    kicker: "Every order",
    offer: `${CARE_COVERAGE_YEARS} years of replacements, cleaning, and repair`,
    detail: `Free replacements, cleaning, and repair for up to ${CARE_COVERAGE_YEARS} years.`,
    href: "/policies/warranty",
    cta: "See warranty",
  },
];

export const announcementIncentives = [
  `US orders of $${dollars(FREE_SHIPPING_THRESHOLD)} or more ship free`,
  `International orders of $${dollars(INTERNATIONAL_FREE_SHIPPING_THRESHOLD)} or more ship free`,
  `US orders of $${dollars(US_GIFT_NECKLACE_THRESHOLD)} or more include a free Legacy necklace`,
  `Free replacements, cleaning, and repair for ${CARE_COVERAGE_YEARS} years`,
  "Pay later at checkout",
  "Three lengths. One $1,000 look.",
] as const;

export function incentiveCopy(): string {
  return [
    ...conversionIncentives.flatMap((item) => [item.offer, item.detail]),
    ...announcementIncentives,
  ].join(" ");
}
