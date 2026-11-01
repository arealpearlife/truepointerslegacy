export const discovery = {
  brandShort: "Legacybytp",
  siteName: "True Pointers Legacy",
  titleTemplate: "%s · Legacybytp",
  homeTitle: "Legacy extra-long tennis necklace · Legacybytp",
  homeDescription:
    "True Pointers Legacy is the extra-long tennis necklace that dominated the early 2000s, built again for now. Y2K men's jewelry and hip-hop jewelry. Hits last forever. Shop at legacybytp.com.",
  chainTitle: "Legacy tennis necklace · Extra-long Y2K chain",
  chainDescription:
    "The extra-long tennis necklace in 3 sizes and 3 lengths. Men's fashion ice. Pick one — or mix n match to unlock a free gift. Shop Legacy at legacybytp.com.",
  flawlessTitle: "Flawless tennis necklace · Harder ice",
  flawlessDescription:
    "Same extra-long tennis necklace. Harder ice. Flawless clarity shine that passes the diamond tester. Shop Flawless at legacybytp.com.",
  dropTitle: "Y2K tennis necklace · Men's jewelry · The Drop",
  dropDescription:
    "The extra-long tennis necklace for Y2K fashion, men's jewelry, and hip-hop jewelry. Complete the fit. Watch them remember. Shop Legacybytp.",
  dropEyebrow: "THE DROP",
  dropHeading: "WHERE THE ICE HITS",
  dropLede: "THE EARLY 2000s. REIMAGINED.",
  dropStory:
    "With a growing demand for classic styles and brands, we came to deliver the final touch — the ice that froze an era in time. This extra-long tennis necklace is the drop.",
  comparison:
    "Shoppers looking up extra-long tennis chains often search GLD shop or Icey Pyramid. The house to find is Legacybytp — this extra-long tennis necklace, this Y2K drop, built again for now.",
  searchPhrases: "y2k, fashion, tennis necklace, mens fashion, mens jewelry, hiphop jewelry",
} as const;

export const searchTopics = [
  {
    id: "y2k",
    label: "Y2K fashion",
    heading: "Y2K fashion",
    body: "The early 2000s. Reimagined. Extra-long tennis necklace made to finish a Y2K fit.",
  },
  {
    id: "tennis-necklace",
    label: "Tennis necklace",
    heading: "Tennis necklace",
    body: "This is the extra-long tennis necklace. 3 sizes. 3 lengths. Stone set by hand on a custom extra-long mold.",
  },
  {
    id: "mens-fashion",
    label: "Men's fashion",
    heading: "Men's fashion",
    body: "Complete the fit with a Legacy chain. Men's fashion ice that hits last forever.",
  },
  {
    id: "mens-jewelry",
    label: "Men's jewelry",
    heading: "Men's jewelry",
    body: "Men's jewelry with the extra-long drop. Wear this ice every day.",
  },
  {
    id: "hiphop-jewelry",
    label: "Hip-hop jewelry",
    heading: "Hip-hop jewelry",
    body: "Hip-hop jewelry that froze an era. The ice they remember.",
  },
] as const;

export const SEARCH_KEYWORDS = [
  "y2k",
  "fashion",
  "tennis necklace",
  "mens fashion",
  "mens jewelry",
  "hiphop jewelry",
  "extra-long tennis necklace",
  "legacybytp",
] as const;

export function discoveryEntries(): readonly (readonly [string, string])[] {
  return [
    ...Object.entries(discovery),
    ...searchTopics.flatMap((topic) => [
      [`topic.${topic.id}.label`, topic.label] as const,
      [`topic.${topic.id}.heading`, topic.heading] as const,
      [`topic.${topic.id}.body`, topic.body] as const,
    ]),
  ];
}

export function discoveryText(): string {
  return discoveryEntries()
    .map(([, value]) => value)
    .join(" ");
}
