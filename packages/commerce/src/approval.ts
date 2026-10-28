import { parseMoney } from "./money";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  type ChainLength,
  type Edition,
  type StoneSize,
  STONE_SIZE,
} from "./store";
import type { Product } from "./types";
import { resolveVariant } from "./variant";

export type PriceMatrix = Record<StoneSize, Record<ChainLength, string>>;

export const LEGACY_PRICES: PriceMatrix = {
  "3 mm": { "40 inches": "329.00", "44 inches": "369.00", "48 inches": "375.00" },
  "4 mm": { "40 inches": "417.00", "44 inches": "457.00", "48 inches": "465.00" },
  "5 mm": { "40 inches": "421.00", "44 inches": "458.00", "48 inches": "488.00" },
};

export const FLAWLESS_PRICES: PriceMatrix = {
  "3 mm": { "40 inches": "979.00", "44 inches": "1122.00", "48 inches": "1499.00" },
  "4 mm": { "40 inches": "989.00", "44 inches": "1259.00", "48 inches": "1499.00" },
  "5 mm": { "40 inches": "1199.00", "44 inches": "1399.00", "48 inches": "1699.00" },
};

export type PriceMismatch = {
  stoneSize: StoneSize;
  chainLength: ChainLength;
  issue: "missing" | "price";
  actual?: string;
};

export function approvedPrices(edition: Edition): PriceMatrix {
  return edition === "legacy" ? LEGACY_PRICES : FLAWLESS_PRICES;
}

export function auditApprovedPrices(product: Product, edition: Edition): PriceMismatch[] {
  const matrix = approvedPrices(edition);
  const mismatches: PriceMismatch[] = [];
  for (const stoneSize of APPROVED_STONE_SIZES) {
    for (const chainLength of APPROVED_CHAIN_LENGTHS) {
      const resolution = resolveVariant(product, { stoneSize, chainLength });
      const expected = matrix[stoneSize][chainLength];
      if (
        (resolution.status !== "available" && resolution.status !== "unavailable") ||
        !resolution.variant
      ) {
        mismatches.push({ stoneSize, chainLength, issue: "missing" });
        continue;
      }
      if (
        resolution.variant.price.currencyCode !== "USD" ||
        resolution.variant.price.amount !== expected
      ) {
        mismatches.push({
          stoneSize,
          chainLength,
          issue: "price",
          actual: resolution.variant.price.amount,
        });
      }
    }
  }
  return mismatches;
}

export function expectedAmount(
  edition: Edition,
  stoneSize: StoneSize,
  chainLength: ChainLength,
): string {
  return approvedPrices(edition)[stoneSize][chainLength];
}

export function expectedMoney(edition: Edition, stoneSize: StoneSize, chainLength: ChainLength) {
  return parseMoney(expectedAmount(edition, stoneSize, chainLength), "USD");
}
