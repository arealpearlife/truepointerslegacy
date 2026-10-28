import {
  CHAIN_LENGTH,
  CUSTOMER_CONFIGURATION_UNAVAILABLE,
  CUSTOMER_SELECT_CONFIGURATION,
  CUSTOMER_UNAVAILABLE,
  STONE_SIZE,
} from "./store";
import type { Product, Resolution, Selection, Variant } from "./types";

export function optionValues(product: Product, name: string): string[] {
  return product.options.find((option) => option.name === name)?.values ?? [];
}

export function selectedOption(variant: Variant, name: string): string | null {
  return variant.selectedOptions.find((option) => option.name === name)?.value ?? null;
}

export function resolveVariant(product: Product, selection: Selection): Resolution {
  if (!selection.stoneSize || !selection.chainLength) {
    return { status: "incomplete" };
  }
  const sizes = optionValues(product, STONE_SIZE);
  const lengths = optionValues(product, CHAIN_LENGTH);
  if (!sizes.includes(selection.stoneSize) || !lengths.includes(selection.chainLength)) {
    return { status: "invalid" };
  }
  const matches = product.variants.filter(
    (variant) =>
      selectedOption(variant, STONE_SIZE) === selection.stoneSize &&
      selectedOption(variant, CHAIN_LENGTH) === selection.chainLength,
  );
  if (matches.length > 1) {
    return { status: "ambiguous" };
  }
  const variant = matches[0];
  if (!variant || !variant.availableForSale) {
    return { status: "unavailable", variant: variant ?? null };
  }
  return { status: "available", variant };
}

export function isVariantId(value: string): boolean {
  return /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value);
}

export function findPurchasableVariant(products: Array<Product | null>, variantId: string) {
  if (!isVariantId(variantId)) {
    return {
      ok: false as const,
      code: "not_purchasable" as const,
      message: CUSTOMER_CONFIGURATION_UNAVAILABLE,
    };
  }
  const matches = products
    .filter((product): product is Product => product !== null)
    .flatMap((product) => product.variants.filter((variant) => variant.id === variantId));
  const variant = matches[0];
  if (matches.length !== 1 || !variant?.availableForSale) {
    return {
      ok: false as const,
      code: "not_purchasable" as const,
      message: CUSTOMER_CONFIGURATION_UNAVAILABLE,
    };
  }
  return { ok: true as const, data: variant };
}

export function selectionMessage(product: Product | null, selection: Selection): string | null {
  if (!product) return CUSTOMER_UNAVAILABLE;
  const resolution = resolveVariant(product, selection);
  if (resolution.status === "incomplete") return CUSTOMER_SELECT_CONFIGURATION;
  if (resolution.status === "available") return null;
  return CUSTOMER_CONFIGURATION_UNAVAILABLE;
}
