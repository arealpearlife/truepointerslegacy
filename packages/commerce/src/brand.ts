import { announcementIncentives, conversionIncentives } from "./incentives";

export const marketing = {
  eyebrow: "TRUE POINTERS PRESENTS",
  heroTitle: "LEGACY",
  legacyName: "LEGACY TENNIS CHAIN",
  flawlessName: "FLAWLESS TENNIS CHAIN",
  mottoLead: "HITS",
  motto: "LAST FOREVER.",
  plateLead: "HITS",
  plateMotto: "LAST FOREVER.",
  iceLine: "REIMAGINED IN ICE.",
  heroBody:
    "Stone set to stone, low hang. Extra long. One Flawless chain or the three-length kit is the $1,000 look. Pay later at checkout if that is easier today.",
  shopLegacy: "SHOP ONE LEGACY",
  shopKit: "SHOP THE 3-LENGTH KIT",
  flawlessUpgrade: "FLAWLESS UPGRADE",
  payLaterFlawless: "PAY LATER ON FLAWLESS",
  flawlessHeading: "GO FLAWLESS.",
  flawlessLine: "SAME LEGACY SHAPE. HARDER ICE.",
  flawlessBody:
    "Same extra-long drop. Hand-set stones. Flawless clarity shine that passes the diamond tester.",
  modalTitle: "WANT TO GO FLAWLESS?",
  modalBody: "Same drop. Harder ice. VVS shine that passes the diamond tester. Your call.",
  collectionTitle: "THE LEGACY COLLECTION",
  collectionLede: "3 stone sizes. 3 lengths. The $1,000 look is one Flawless or the full kit.",
  collectionStory:
    "Premium stones, hand-set, immaculate shine. Custom built on its own extended mold. If the ice fails, we replace it. Free replacements, cleaning, and repair for 5 years.",
  collectionMeta: "3 sizes · 3 lengths",
  craftLine: "Stone set by hand on a custom extra-long mold. Made to be worn every day.",
  replacePromise:
    "If the ice fails, we replace it. Free replacements, cleaning, and repair for 5 years.",
  usShipLine: "US orders of $500 or more ship free.",
  intlShipLine: "International orders of $1,000 or more ship free.",
  usGiftLine: "US orders of $1,000 or more include a free Legacy necklace.",
  careLine: "Free replacements, cleaning, and repair for up to 5 years.",
  keepLegacy: "KEEP IT LEGACY",
  fromPrice: "FLAWLESS LEGACY CHAINS FROM $979.",
  addToCart: "Add to cart",
  payLaterCta: "Pay later at checkout",
  payLaterEyebrow: "BUY NOW, PAY LATER",
  payLaterTitle: "FLAWLESS",
  payLaterLine: "Flawless shine. Every wear.",
  flawlessKicker: "THE UPGRADE",
  flawlessHeat: "The one they ask for.",
  flawlessPlateLead: "HARDER",
  flawlessPlateShine: "ICE.",
  payLaterWhisper: "Buy now, pay later",
  payLaterBody:
    "Same extra-long drop. Hand-set ice with flawless clarity shine that passes the diamond tester. Shop Pay, Klarna, and Afterpay appear at Shopify checkout.",
  payLaterCheckoutNote: "Pay later options appear at Shopify checkout.",
  payLaterEase:
    "Shop Pay, Klarna, and Afterpay let you take the $1,000 look home without paying it all today.",
  thousandLook: "THE $1,000 LOOK",
  thousandBody:
    "One Flawless chain, or the three-length Legacy kit. Pay later at checkout if $1,000 is not in the account today.",
  kitTitle: "THE FULL KIT",
  kitLine: "THREE LENGTHS. ONE $1,000 LOOK.",
  kitBody: "40, 44, and 48. Same stone size. Stack them or rotate the drop. Pay later at checkout.",
  kitCta: "Add the 3-length kit",
  kitPayLaterCta: "Pay later on the kit",
  oneChainTitle: "ONE CHAIN IS STILL A FULL CHAIN",
  oneChainBody:
    "US orders of $500 or more ship free. Keep it to one if that is the move today. You still get the ice and the 5-year care.",
  checkoutPayLater: "Checkout · pay later is inside",
  close: "Close",
} as const;

export const PAY_LATER_METHODS = [
  { id: "shop-pay", label: "Shop Pay" },
  { id: "klarna", label: "Klarna" },
  { id: "afterpay", label: "Afterpay" },
] as const;

export const publicDetails = {
  legacy:
    "Hand-set VVS shine. Extra-long custom mold. If the ice fails, we replace it. Free replacements, cleaning, and repair for 5 years.",
  flawless:
    "Hand-set flawless clarity shine. Passes the diamond tester. Same extra-long drop. If the ice fails, we replace it. Free replacements, cleaning, and repair for 5 years.",
} as const;

export const disclosures = publicDetails;

const bannedPublicLanguage = [
  /\bcz\b/i,
  /cubic\s*zirconia/i,
  /moissanite/i,
  /\bstandard\b/i,
  /\bbudget\b/i,
  /\bbasic\b/i,
  /\bdiamond\b(?!\s+test)/i,
];

export function hasBannedPublicLanguage(value: string): boolean {
  return bannedPublicLanguage.some((pattern) => pattern.test(value));
}

export function marketingViolations(): string[] {
  return [
    ...Object.entries(marketing),
    ...Object.entries(publicDetails),
    ...conversionIncentives.flatMap((item) => [
      [`${item.id}.offer`, item.offer] as const,
      [`${item.id}.detail`, item.detail] as const,
    ]),
    ...announcementIncentives.map((line, index) => [`announcement.${index}`, line] as const),
  ]
    .filter(([, value]) => hasBannedPublicLanguage(value))
    .map(([key]) => key);
}
