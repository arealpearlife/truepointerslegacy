import { announcementIncentives, housePrivileges } from "./incentives";

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
    "Stone set to stone. Extra long. A work of art you wear — made to make you feel more valuable the moment it sits on you.",
  shopLegacy: "SHOP LEGACY",
  shopKit: "THE LEGACY SET",
  flawlessUpgrade: "FLAWLESS UPGRADE",
  payLaterFlawless: "WEAR FLAWLESS",
  flawlessHeading: "GO FLAWLESS.",
  flawlessLine: "SAME LEGACY SHAPE. HARDER ICE.",
  flawlessBody:
    "Same extra-long drop. Hand-set stones. Flawless clarity shine that passes the diamond tester.",
  modalTitle: "WANT TO GO FLAWLESS?",
  modalBody: "Same drop. Harder ice. VVS shine that passes the diamond tester. Your call.",
  collectionTitle: "THE LEGACY COLLECTION",
  collectionLede: "Three sizes. Three lengths. Wear the piece that raises you.",
  collectionStory: "Hand-set stones. Immaculate shine. Custom built on its own extended mold.",
  collectionMeta: "3 sizes · 3 lengths",
  craftLine: "Stone set by hand on a custom extra-long mold. Made to be worn every day.",
  replacePromise: "If the ice fails, we replace it.",
  usShipLine: "US orders of $500 or more ship free.",
  intlShipLine: "International orders of $1,000 or more ship free.",
  usGiftLine: "Orders of $1,000 or more include a complimentary Legacy chain of your choice.",
  careLine: "Orders of $500 or more include five years of replacements, cleaning, and repair.",
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
  payLaterEase: "Shop Pay, Klarna, and Afterpay wait at checkout.",
  kitTitle: "THE LEGACY SET",
  kitLine: "THREE LENGTHS. MORE ICE.",
  kitBody: "40, 44, and 48. Same stone. Wear them in turn.",
  kitCta: "Add the Legacy set",
  kitPayLaterCta: "Pay later on the set",
  houseCourtesyTitle: "A courtesy of the house",
  houseCourtesyLead: "Spend with the house. Leave with more.",
  emptyCart: "Your cart is waiting for a piece.",
  checkoutPayLater: "Checkout · pay later is inside",
  close: "Close",
} as const;

export const PAY_LATER_METHODS = [
  { id: "shop-pay", label: "Shop Pay" },
  { id: "klarna", label: "Klarna" },
  { id: "afterpay", label: "Afterpay" },
] as const;

export const publicDetails = {
  legacy: "Hand-set VVS shine. Extra-long custom mold. If the ice fails, we replace it.",
  flawless:
    "Hand-set flawless clarity shine. Passes the diamond tester. Same extra-long drop. If the ice fails, we replace it.",
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
    ...housePrivileges.flatMap((item) => [
      [`${item.id}.offer`, item.offer] as const,
      [`${item.id}.whisper`, item.whisper] as const,
    ]),
    ...announcementIncentives.map((line, index) => [`announcement.${index}`, line] as const),
  ]
    .filter(([, value]) => hasBannedPublicLanguage(value))
    .map(([key]) => key);
}
