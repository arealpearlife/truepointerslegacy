import { CARE_COVERAGE_YEARS, CARE_THRESHOLD, US_GIFT_NECKLACE_THRESHOLD } from "./policies";
import { HANDLES } from "./store";

function dollars(amount: string): string {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export type HousePrivilege = {
  id: "care" | "gift";
  threshold: string;
  kicker: string;
  offer: string;
  whisper: string;
  href: string;
};

export const housePrivileges: readonly HousePrivilege[] = [
  {
    id: "care",
    threshold: CARE_THRESHOLD,
    kicker: `From $${dollars(CARE_THRESHOLD)}`,
    offer: `${CARE_COVERAGE_YEARS} years of care`,
    whisper: "Cleaning, repairs, and replacements — included.",
    href: "/policies/warranty",
  },
  {
    id: "gift",
    threshold: US_GIFT_NECKLACE_THRESHOLD,
    kicker: `From $${dollars(US_GIFT_NECKLACE_THRESHOLD)}`,
    offer: "A Legacy chain, chosen by you",
    whisper: "A complimentary chain with the house. Tell us the size and length.",
    href: `/products/${HANDLES.legacy}`,
  },
];

export const announcementIncentives = [
  housePrivileges[0]!.kicker + " · " + housePrivileges[0]!.offer,
  housePrivileges[1]!.kicker + " · " + housePrivileges[1]!.offer,
  "Pay later at checkout",
] as const;

export function incentiveCopy(): string {
  return [
    ...housePrivileges.flatMap((item) => [item.offer, item.whisper, item.kicker]),
    ...announcementIncentives,
  ].join(" ");
}
