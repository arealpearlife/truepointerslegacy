import { describe, expect, it } from "vitest";
import { auditApprovedPrices } from "../src/approval";
import { marketingViolations } from "../src/brand";
import { loadStoreCatalog } from "../src/catalog";
import { buildComparison, flawlessStartingOffer } from "../src/comparison";
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

  it("keeps technical material labels out of marketing copy", () => {
    expect(marketingViolations()).toEqual([]);
    const comparison = buildComparison(catalogProduct("legacy"), catalogProduct("flawless"), {
      stoneSize: "3 mm",
      chainLength: "40 inches",
    });
    expect(comparison.map((row) => row.legacy).join(" ")).not.toMatch(/\bCZ\b/);
    expect(comparison.find((row) => row.label === "Stone material")).toMatchObject({
      legacy: "Cubic zirconia",
      flawless: "Moissanite",
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
