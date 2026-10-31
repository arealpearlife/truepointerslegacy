import { describe, expect, it } from "vitest";
import { auditApprovedPrices } from "../src/approval";
import {
  PAY_LATER_METHODS,
  hasBannedPublicLanguage,
  marketing,
  marketingViolations,
  publicDetails,
} from "../src/brand";
import {
  CARE_COVERAGE_YEARS,
  FREE_SHIPPING_THRESHOLD,
  INTERNATIONAL_FREE_SHIPPING_THRESHOLD,
  RETURN_WINDOW_DAYS,
  SHIPPING_ZONES,
  US_GIFT_NECKLACE_THRESHOLD,
  allPolicyText,
  shippingRateForState,
  shopifyPolicyHtml,
} from "../src/policies";
import { incentiveCopy } from "../src/incentives";
import { expectedKitTotal, legacyKitOffer, spendProgress } from "../src/offers";
import { loadStoreCatalog } from "../src/catalog";
import { buildComparison, flawlessStartingOffer, materialStatement } from "../src/comparison";
import { formatMoney, parseMoney } from "../src/money";
import { isCartLineId, normalizeQuantity } from "../src/quantity";
import { catalogProduct, variantId } from "../src/testing";
import { findPurchasableVariant, resolveVariant } from "../src/variant";

describe("commerce rules", () => {
  it("formats approved prices without inventing cents", () => {
    expect(formatMoney(parseMoney("979.00", "USD"))).toBe("$979");
    expect(formatMoney(parseMoney("1122.00", "USD"))).toBe("$1,122");
  });

  it("resolves only the exact selected configuration", () => {
    const legacy = catalogProduct("legacy");
    const resolved = resolveVariant(legacy, { stoneSize: "5 mm", chainLength: "48 inches" });
    expect(resolved.status).toBe("available");
    if (resolved.status === "available") {
      expect(resolved.variant.id).toBe(variantId("legacy", "5 mm", "48 inches"));
      expect(resolved.variant.price.amount).toBe("488.00");
    }
    expect(resolveVariant(legacy, { stoneSize: "3 mm", chainLength: null }).status).toBe(
      "incomplete",
    );
    expect(resolveVariant(legacy, { stoneSize: "3 mm", chainLength: "41 inches" }).status).toBe(
      "invalid",
    );
  });

  it("does not purchase an unavailable or ambiguous variant", () => {
    const legacy = catalogProduct("legacy", false);
    const variant = variantId("legacy", "3 mm", "40 inches");
    expect(findPurchasableVariant([legacy], variant).ok).toBe(false);
    const ambiguous = {
      ...legacy,
      variants: [...legacy.variants, { ...legacy.variants[0]!, availableForSale: true }],
    };
    expect(resolveVariant(ambiguous, { stoneSize: "3 mm", chainLength: "40 inches" }).status).toBe(
      "ambiguous",
    );
    expect(findPurchasableVariant([ambiguous], variant).ok).toBe(false);
  });

  it("audits the approved matrices exactly", () => {
    expect(auditApprovedPrices(catalogProduct("legacy"), "legacy")).toEqual([]);
    expect(auditApprovedPrices(catalogProduct("flawless"), "flawless")).toEqual([]);
    const changed = catalogProduct("flawless");
    changed.variants[0] = { ...changed.variants[0]!, price: parseMoney("980.00", "USD") };
    expect(auditApprovedPrices(changed, "flawless")[0]).toMatchObject({
      issue: "price",
      actual: "980.00",
    });
  });

  it("advertises the Flawless starting price only when that configuration can be purchased at $979", () => {
    expect(flawlessStartingOffer(catalogProduct("flawless"))?.cents).toBe(97900);
    expect(flawlessStartingOffer(catalogProduct("flawless", false))).toBeNull();
    const repriced = catalogProduct("flawless");
    repriced.variants[0] = { ...repriced.variants[0]!, price: parseMoney("980.00", "USD") };
    expect(flawlessStartingOffer(repriced)).toBeNull();
  });

  it("uses Hits Last Forever instead of the old era motto", () => {
    expect(`${marketing.mottoLead} ${marketing.motto}`).toBe("HITS LAST FOREVER.");
    expect(`${marketing.mottoLead} ${marketing.motto}`).not.toMatch(/era that left a mark/i);
    expect(marketing.collectionTitle).toBe("THE LEGACY COLLECTION");
    expect(marketing.collectionTitle).not.toMatch(/nine ways/i);
    expect(PAY_LATER_METHODS.map((method) => method.label)).toEqual([
      "Shop Pay",
      "Klarna",
      "Afterpay",
    ]);
  });

  it("returns in 15 days and ships from Richmond by distance", () => {
    expect(RETURN_WINDOW_DAYS).toBe(15);
    expect(shippingRateForState("VA")).toBe("10.00");
    expect(shippingRateForState("CA")).toBe("34.00");
    expect(shippingRateForState("AK")).toBe("40.00");
    expect(SHIPPING_ZONES.flatMap((zone) => [...zone.states])).toHaveLength(51);
    expect(allPolicyText()).toMatch(/15 days from delivery/);
    expect(allPolicyText()).toMatch(/keep the chain and issue a partial refund/);
    expect(allPolicyText()).toMatch(/not priced by weight/);
    expect(FREE_SHIPPING_THRESHOLD).toBe("500.00");
    expect(INTERNATIONAL_FREE_SHIPPING_THRESHOLD).toBe("1000.00");
    expect(US_GIFT_NECKLACE_THRESHOLD).toBe("1000.00");
    expect(CARE_COVERAGE_YEARS).toBe(5);
    expect(allPolicyText()).toMatch(/US orders of \$500 or more ship free/);
    expect(allPolicyText()).toMatch(/International orders of \$1,000 or more ship free/);
    expect(allPolicyText()).toMatch(/US orders of \$1,000 or more include a free Legacy necklace/);
    expect(allPolicyText()).toMatch(/Free replacements, cleaning, and repair for up to 5 years/);
    expect(allPolicyText()).not.toMatch(/We do not ship outside the United States/);
    expect(hasBannedPublicLanguage(allPolicyText())).toBe(false);
    expect(hasBannedPublicLanguage(incentiveCopy())).toBe(false);
    expect(shopifyPolicyHtml("returns")).toMatch(/<p>You have 15 days from delivery/);
    expect(shopifyPolicyHtml("shipping")).toMatch(/International orders of \$1,000/);
    expect(shopifyPolicyHtml("warranty")).toMatch(/up to 5 years from delivery/);
  });

  it("prices the 3-length Legacy kit at the $1,000 look without shaming a $500 order", () => {
    expect(expectedKitTotal("3 mm")?.amount).toBe("1073.00");
    const kit = legacyKitOffer(catalogProduct("legacy"), "3 mm");
    expect(kit.ready).toBe(true);
    expect(kit.variants).toHaveLength(3);
    expect(kit.total?.amount).toBe("1073.00");
    expect(spendProgress(0).message).toMatch(/One chain still ships free/);
    expect(spendProgress(32900).reachedFreeUsShipping).toBe(false);
    expect(spendProgress(50000).reachedFreeUsShipping).toBe(true);
    expect(spendProgress(50000).reachedThousand).toBe(false);
    expect(spendProgress(50000).message).toMatch(/US shipping is free/);
    expect(spendProgress(107300).reachedThousand).toBe(true);
    expect(hasBannedPublicLanguage(spendProgress(0).message)).toBe(false);
  });

  it("keeps stone names off every customer-facing line", () => {
    expect(marketingViolations()).toEqual([]);
    const tainted = catalogProduct("legacy");
    tainted.description = "Stone material: cubic zirconia. Also moissanite.";
    expect(materialStatement("legacy", tainted)).toBe(publicDetails.legacy);
    expect(materialStatement("legacy", tainted)).not.toMatch(/cubic zirconia|moissanite|\bCZ\b/i);
    expect(materialStatement("flawless", catalogProduct("flawless"))).toBe(publicDetails.flawless);
    const comparison = buildComparison(catalogProduct("legacy"), catalogProduct("flawless"), {
      stoneSize: "3 mm",
      chainLength: "40 inches",
    });
    const copy = `${comparison.map((row) => `${row.legacy} ${row.flawless}`).join(" ")} ${publicDetails.legacy} ${publicDetails.flawless}`;
    expect(copy).not.toMatch(/cubic zirconia|moissanite|\bCZ\b/i);
    expect(comparison.find((row) => row.label === "Shine")).toMatchObject({
      legacy: "VVS shine, hand-set",
      flawless: "Flawless clarity shine. Passes the diamond tester.",
    });
  });

  it("rejects unsafe quantities and reports an unavailable catalog", async () => {
    expect(normalizeQuantity("2")).toBe(2);
    expect(normalizeQuantity("0")).toBeNull();
    expect(normalizeQuantity("21")).toBeNull();
    expect(isCartLineId("gid://shopify/CartLine/1")).toBe(true);
    const snapshot = await loadStoreCatalog({
      productByHandle: async () => ({ ok: false, code: "network", message: "offline" }),
    });
    expect(snapshot.state).toBe("unavailable");
  });
});
