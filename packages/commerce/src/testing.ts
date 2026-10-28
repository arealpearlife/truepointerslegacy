import { disclosures } from "./brand";
import { parseMoney } from "./money";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  HANDLES,
  PRODUCT_TITLES,
  STONE_SIZE,
  type ChainLength,
  type Edition,
  type StoneSize,
} from "./store";
import type { Product, Variant } from "./types";
import { approvedPrices } from "./approval";

export function variantId(
  edition: Edition,
  stoneSize: StoneSize,
  chainLength: ChainLength,
): string {
  const sizeIndex = APPROVED_STONE_SIZES.indexOf(stoneSize);
  const lengthIndex = APPROVED_CHAIN_LENGTHS.indexOf(chainLength);
  const base = edition === "legacy" ? 1100 : 2100;
  return `gid://shopify/ProductVariant/${base + sizeIndex * 10 + lengthIndex}`;
}

export function catalogProduct(edition: Edition, available = true): Product {
  const matrix = approvedPrices(edition);
  const variants: Variant[] = APPROVED_STONE_SIZES.flatMap((stoneSize) =>
    APPROVED_CHAIN_LENGTHS.map((chainLength) => ({
      id: variantId(edition, stoneSize, chainLength),
      title: `${stoneSize} / ${chainLength}`,
      availableForSale: available,
      price: parseMoney(matrix[stoneSize][chainLength], "USD"),
      selectedOptions: [
        { name: STONE_SIZE, value: stoneSize },
        { name: CHAIN_LENGTH, value: chainLength },
      ],
      image: null,
    })),
  );
  return {
    id: edition === "legacy" ? "gid://shopify/Product/1" : "gid://shopify/Product/2",
    handle: HANDLES[edition],
    title: PRODUCT_TITLES[edition],
    description: disclosures[edition],
    options: [
      { name: STONE_SIZE, values: [...APPROVED_STONE_SIZES] },
      { name: CHAIN_LENGTH, values: [...APPROVED_CHAIN_LENGTHS] },
    ],
    images: [],
    videos: [],
    variants,
  };
}
