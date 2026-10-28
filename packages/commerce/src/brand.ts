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
  heroBody: "Stone set to stone, low hang. Extra long. Built to be seen from across the room.",
  shopLegacy: "SHOP LEGACY",
  flawlessUpgrade: "FLAWLESS UPGRADE",
  flawlessHeading: "GO FLAWLESS.",
  flawlessLine: "SAME LEGACY SHAPE. HARDER ICE.",
  flawlessBody:
    "Same extra-long drop. Hand-set stones. Flawless clarity shine that passes the diamond tester.",
  modalTitle: "WANT TO GO FLAWLESS?",
  modalBody: "Same drop. Harder ice. VVS shine that passes the diamond tester. Your call.",
  collectionTitle: "THE LEGACY COLLECTION",
  collectionLede: "3 stone sizes. 3 lengths. One extra-long drop.",
  collectionStory:
    "Premium stones, hand-set, immaculate shine. Custom built on its own extended mold. If the ice fails, we replace it.",
  collectionMeta: "3 sizes · 3 lengths",
  craftLine: "Stone set by hand on a custom extra-long mold. Made to be worn every day.",
  replacePromise: "If the ice fails, we replace it.",
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
  return [...Object.entries(marketing), ...Object.entries(publicDetails)]
    .filter(([, value]) => hasBannedPublicLanguage(value))
    .map(([key]) => key);
}
