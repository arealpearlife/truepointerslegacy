export type PolicySlug = "shipping" | "returns" | "care" | "privacy" | "terms" | "warranty";

export type PolicySection = {
  heading?: string;
  paragraphs: readonly string[];
};

export type StorePolicy = {
  title: string;
  sections: readonly PolicySection[];
};

export type ShippingZone = {
  id: string;
  name: string;
  rate: string;
  states: readonly string[];
};

/** Flat US rates by distance from Richmond, VA. Weight does not change the rate. */
export const SHIPPING_ZONES: readonly ShippingZone[] = [
  { id: "richmond", name: "Closest to Richmond", rate: "10.00", states: ["VA", "DC", "MD"] },
  { id: "nearby", name: "Nearby", rate: "14.00", states: ["NC", "WV", "DE", "PA", "NJ"] },
  {
    id: "mid",
    name: "Mid-Atlantic and nearby South",
    rate: "18.00",
    states: ["NY", "CT", "RI", "MA", "VT", "NH", "ME", "OH", "KY", "TN", "SC"],
  },
  {
    id: "south-midwest",
    name: "South and Midwest",
    rate: "22.00",
    states: ["GA", "FL", "AL", "MS", "IN", "MI", "IL", "WI", "MO"],
  },
  {
    id: "plains",
    name: "Plains and Gulf",
    rate: "26.00",
    states: ["AR", "LA", "TX", "OK", "KS", "NE", "IA", "MN"],
  },
  {
    id: "mountain",
    name: "Mountain West",
    rate: "30.00",
    states: ["ND", "SD", "CO", "NM", "AZ", "UT", "WY", "MT", "ID", "NV"],
  },
  { id: "pacific", name: "Pacific", rate: "34.00", states: ["CA", "OR", "WA", "HI"] },
  { id: "alaska", name: "Alaska", rate: "40.00", states: ["AK"] },
];

export const SHIPPING_ORIGIN = "Richmond, VA";
export const RETURN_WINDOW_DAYS = 15;
export const FREE_SHIPPING_THRESHOLD = "500.00";
export const INTERNATIONAL_FREE_SHIPPING_THRESHOLD = "1000.00";
export const US_GIFT_NECKLACE_THRESHOLD = "1000.00";
export const CARE_COVERAGE_YEARS = 5;

function dollars(amount: string): string {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export const storePolicies: Record<PolicySlug, StorePolicy> = {
  returns: {
    title: "Returns and refunds",
    sections: [
      {
        paragraphs: [
          `You have ${RETURN_WINDOW_DAYS} days from delivery to start a return.`,
          "Email support from the order email with your order number. We will send a return address. You pay return shipping unless we sent the wrong item.",
        ],
      },
      {
        heading: "If the chain passes inspection",
        paragraphs: [
          "Send it back unused, with the original packaging, tags, and papers. If it passes return inspection and can be sold again, we refund the item price in full.",
        ],
      },
      {
        heading: "If the chain does not pass inspection",
        paragraphs: [
          "If the chain is not resellable after that first purchase — worn, damaged, missing parts, or failing inspection — we keep the chain and issue a partial refund of the item price. We set that amount after we inspect it.",
          "Original outbound shipping is refunded only when we shipped the wrong item or the ice fails under the replace promise.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping",
    sections: [
      {
        paragraphs: [
          `We ship from ${SHIPPING_ORIGIN} to addresses in the United States and internationally. Every chain ships at the same weight, so shipping is not priced by weight.`,
          `US orders of $${dollars(FREE_SHIPPING_THRESHOLD)} or more ship free. Under that, the US rate is the distance from Richmond, Virginia to the delivery address. Closest addresses start at $10. The rate rises as the address gets farther from Richmond.`,
          `International orders of $${dollars(INTERNATIONAL_FREE_SHIPPING_THRESHOLD)} or more ship free. Under that, the international rate appears at Shopify checkout. Duties and import taxes may apply in the destination country.`,
          `US orders of $${dollars(US_GIFT_NECKLACE_THRESHOLD)} or more include a free Legacy necklace with the order.`,
          "Rates appear at Shopify checkout for your address. Taxes are extra where they apply.",
        ],
      },
      {
        heading: "Rates from Richmond",
        paragraphs: SHIPPING_ZONES.map(
          (zone) => `$${Number(zone.rate).toFixed(0)} — ${zone.name}: ${zone.states.join(", ")}`,
        ),
      },
    ],
  },
  privacy: {
    title: "Privacy",
    sections: [
      {
        paragraphs: [
          "True Pointers collects the name, email, shipping address, and order details needed to sell and ship a chain. Payment details stay with Shopify. We do not store raw card numbers.",
          "We use that information to fulfill orders, prevent fraud, and answer support. We do not sell your personal information.",
          "Shopify, Vercel, and similar processors may see the data required to run checkout and the site. You can email support to ask what we hold or to request a correction.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    sections: [
      {
        paragraphs: [
          "By buying on legacybytp.com you agree to these terms and to Shopify’s checkout terms. You must be 18 or older, or use a parent or guardian’s account.",
          "Prices are in US dollars and do not include shipping or tax until checkout. We can refuse or cancel an order if an item is unavailable, a price is wrong, or a payment does not clear.",
          `The site and product photos are for selling the collection. Title stays with True Pointers until the order is paid and ships. US orders of $${dollars(US_GIFT_NECKLACE_THRESHOLD)} or more include a free Legacy necklace. Virginia law governs these terms.`,
        ],
      },
    ],
  },
  care: {
    title: "Care",
    sections: [
      {
        paragraphs: [
          "Wipe the chain with a soft dry cloth after wear. Keep it dry. Take it off for swimming, showers, and workouts.",
          "Store it flat or hanging so the stones do not rub. Do not use harsh cleaners or ultrasonic machines.",
          `Need a clean or a repair? Email support. We cover free replacements, cleaning, and repair for up to ${CARE_COVERAGE_YEARS} years from delivery.`,
        ],
      },
    ],
  },
  warranty: {
    title: "Warranty",
    sections: [
      {
        paragraphs: [
          `If the ice fails, we replace it. Free replacements, cleaning, and repair for up to ${CARE_COVERAGE_YEARS} years from delivery. Contact support with photos and your order number.`,
          "This covers a failed stone or setting from normal wear, plus cleaning and repair during that window. It does not cover loss, theft, or damage from misuse. The 15-day return rules still apply to change-of-mind returns.",
        ],
      },
    ],
  },
};

export function policyBySlug(slug: string): StorePolicy | undefined {
  return storePolicies[slug as PolicySlug];
}

export function policyPlainText(policy: StorePolicy): string {
  return policy.sections
    .flatMap((section) => [section.heading ?? "", ...section.paragraphs])
    .join(" ");
}

export function allPolicyText(): string {
  return Object.values(storePolicies)
    .map((policy) => `${policy.title} ${policyPlainText(policy)}`)
    .join(" ");
}

export function shippingRateForState(state: string): string | undefined {
  const code = state.trim().toUpperCase();
  return SHIPPING_ZONES.find((zone) => zone.states.includes(code))?.rate;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function shopifyPolicyHtml(slug: PolicySlug): string {
  return storePolicies[slug].sections
    .map((section) => {
      const heading = section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : "";
      const paragraphs = section.paragraphs
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("");
      return `${heading}${paragraphs}`;
    })
    .join("");
}
