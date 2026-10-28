export const marketing = {
  eyebrow: "TRUE POINTERS PRESENTS",
  heroTitle: "LEGACY",
  heroLine: "THE ERA THAT CHANGED THE GAME.",
  heroLineTwo: "REIMAGINED IN ICE.",
  heroBody: "A statement piece. An extended silhouette. A look that speaks for itself.",
  shopLegacy: "SHOP LEGACY",
  exploreFlawless: "EXPLORE FLAWLESS",
  flawlessHeading: "MEET FLAWLESS.",
  flawlessLine: "THE LEGACY LOOK. ELEVATED.",
  flawlessBody: "For those who want to take the experience further.",
  modalTitle: "WANT TO GO FLAWLESS?",
  modalBody:
    "Discover the elevated version of Legacy. Explore the differences, compare your options, and find the finish that fits your style.",
  keepLegacy: "KEEP IT LEGACY",
  fromPrice: "FLAWLESS LEGACY CHAINS FROM $979.",
  addToCart: "Add to cart",
  close: "Close",
} as const;

export const disclosures = {
  legacy: "Stone material: cubic zirconia.",
  flawless: "Stone material: moissanite. This is not a diamond product.",
} as const;

const bannedMarketing = [
  /\bcz\b/i,
  /moissanite/i,
  /\bstandard\b/i,
  /\bbudget\b/i,
  /\bbasic\b/i,
  /\bdiamond\b/i,
];

export function marketingViolations(): string[] {
  return Object.entries(marketing)
    .filter(([, value]) => bannedMarketing.some((pattern) => pattern.test(value)))
    .map(([key]) => key);
}
