export const marketing = {
  eyebrow: "TRUE POINTERS PRESENTS",
  heroTitle: "LEGACY",
  legacyName: "LEGACY TENNIS CHAIN",
  flawlessName: "FLAWLESS TENNIS CHAIN",
  mottoLead: "HITS",
  motto: "LAST FOREVER.",
  plateLead: "HITS",
  plateMotto: "THAT LEAVE A MARK.",
  iceLine: "REIMAGINED IN ICE.",
  heroBody:
    "Stone set to stone, low hang. The extended silhouette that ran the block, the club, and the video set is back on your neck, built to be seen from across the room.",
  shopLegacy: "SHOP LEGACY",
  flawlessUpgrade: "FLAWLESS UPGRADE",
  flawlessHeading: "GO FLAWLESS.",
  flawlessLine: "SAME LEGACY SHAPE. HARDER ICE.",
  flawlessBody:
    "Same lengths, same drop, same Legacy silhouette. Upgraded stones for when you want to go all the way.",
  modalTitle: "WANT TO GO FLAWLESS?",
  modalBody:
    "Same Legacy shape, same lengths, upgraded stones. Check the sizes below, or keep it Legacy. Your call.",
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
