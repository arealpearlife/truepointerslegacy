import { disclosures } from "./brand";
import { formatMoney } from "./money";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  STONE_SIZE,
  type Edition,
} from "./store";
import { resolveVariant, selectedOption } from "./variant";
import type { Money, Product, Resolution, Selection, Variant } from "./types";

export type ComparisonRow = {
  label: string;
  legacy: string;
  flawless: string;
};

const FLAWLESS_STARTING_CENTS = 97900;

export function flawlessStartingOffer(product: Product | null): Money | null {
  if (!product) return null;
  const resolution = resolveVariant(product, { stoneSize: "3 mm", chainLength: "40 inches" });
  if (resolution.status !== "available") return null;
  if (
    resolution.variant.price.currencyCode !== "USD" ||
    resolution.variant.price.cents !== FLAWLESS_STARTING_CENTS
  ) {
    return null;
  }
  return resolution.variant.price;
}

export function orderedVariants(product: Product): Variant[] {
  return [...product.variants].sort((left, right) => rank(left) - rank(right));
}

export function materialStatement(edition: Edition, product: Product | null): string {
  const description = product?.description.trim();
  if (description) return description;
  return disclosures[edition];
}

export function buildComparison(
  legacy: Product | null,
  flawless: Product | null,
  selection: Selection,
): ComparisonRow[] {
  return [
    {
      label: "Piece",
      legacy: legacy?.title ?? "Legacy",
      flawless: flawless?.title ?? "Flawless",
    },
    {
      label: "Stone size",
      legacy: selection.stoneSize ?? "Select a size",
      flawless: selection.stoneSize ?? "Select a size",
    },
    {
      label: "Chain length",
      legacy: selection.chainLength ?? "Select a length",
      flawless: selection.chainLength ?? "Select a length",
    },
    {
      label: "Stone material",
      legacy: shortMaterial("legacy", legacy),
      flawless: shortMaterial("flawless", flawless),
    },
    {
      label: "Price",
      legacy: priceLabel(legacy, selection),
      flawless: priceLabel(flawless, selection),
    },
    {
      label: "Availability",
      legacy: availabilityLabel(legacy, selection),
      flawless: availabilityLabel(flawless, selection),
    },
    {
      label: "Product media",
      legacy: mediaLabel(legacy),
      flawless: mediaLabel(flawless),
    },
  ];
}

export function configurationHref(handle: string, selection: Selection): string {
  const params = new URLSearchParams();
  if (selection.stoneSize) params.set("stone", selection.stoneSize);
  if (selection.chainLength) params.set("length", selection.chainLength);
  const query = params.toString();
  return query ? `/products/${handle}?${query}` : `/products/${handle}`;
}

function shortMaterial(edition: Edition, product: Product | null): string {
  const description = product?.description.toLowerCase() ?? "";
  if (edition === "legacy" && description.includes("cubic zirconia")) return "Cubic zirconia";
  if (edition === "flawless" && description.includes("moissanite")) return "Moissanite";
  if (!description) return edition === "legacy" ? "Cubic zirconia" : "Moissanite";
  return "See product details";
}

function priceLabel(product: Product | null, selection: Selection): string {
  if (!product) return "Not available";
  const resolution = resolveVariant(product, selection);
  return (
    displayPrice(resolution) ??
    (resolution.status === "incomplete" ? "Select a configuration" : "Not available")
  );
}

export function displayPrice(resolution: Resolution): string | null {
  if (
    (resolution.status === "available" || resolution.status === "unavailable") &&
    resolution.variant
  ) {
    return formatMoney(resolution.variant.price);
  }
  return null;
}

function availabilityLabel(product: Product | null, selection: Selection): string {
  if (!product) return "Not available to purchase";
  const resolution = resolveVariant(product, selection);
  if (resolution.status === "incomplete") return "Select a configuration";
  if (resolution.status === "available") return "Available";
  return "Not available";
}

function mediaLabel(product: Product | null): string {
  if (!product || (product.images.length === 0 && product.videos.length === 0)) {
    return "No product media uploaded";
  }
  const parts: string[] = [];
  if (product.images.length > 0) {
    parts.push(`${product.images.length} ${product.images.length === 1 ? "image" : "images"}`);
  }
  if (product.videos.length > 0) {
    parts.push(`${product.videos.length} ${product.videos.length === 1 ? "video" : "videos"}`);
  }
  return parts.join(", ");
}

function rank(variant: Variant): number {
  const size = selectedOption(variant, STONE_SIZE);
  const length = selectedOption(variant, CHAIN_LENGTH);
  const sizeRank = APPROVED_STONE_SIZES.findIndex((value) => value === size);
  const lengthRank = APPROVED_CHAIN_LENGTHS.findIndex((value) => value === length);
  return (sizeRank === -1 ? 99 : sizeRank) * 10 + (lengthRank === -1 ? 99 : lengthRank);
}
