import { LEGACY_PRICES } from "./approval";
import { formatMoney, parseMoney } from "./money";
import {
  CARE_THRESHOLD,
  FREE_SHIPPING_THRESHOLD,
  INTERNATIONAL_FREE_SHIPPING_THRESHOLD,
  US_GIFT_NECKLACE_THRESHOLD,
} from "./policies";
import { APPROVED_CHAIN_LENGTHS, type StoneSize } from "./store";
import type { Money, Product, Variant } from "./types";
import { resolveVariant } from "./variant";

export const TARGET_ORDER_AMOUNT = "1000.00";
export const KIT_DEFAULT_STONE: StoneSize = "3 mm";

function dollars(amount: string): string {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function sumMoney(items: readonly Money[]): Money | null {
  if (items.length === 0) return null;
  const currency = items[0]!.currencyCode;
  if (items.some((item) => item.currencyCode !== currency)) return null;
  const cents = items.reduce((total, item) => total + item.cents, 0);
  return parseMoney((cents / 100).toFixed(2), currency);
}

export function expectedKitTotal(stoneSize: string): Money | null {
  const row = LEGACY_PRICES[stoneSize as StoneSize];
  if (!row) return null;
  return sumMoney(APPROVED_CHAIN_LENGTHS.map((length) => parseMoney(row[length], "USD")));
}

export type LegacyKitOffer = {
  stoneSize: string;
  lengths: readonly string[];
  variants: readonly Variant[];
  ready: boolean;
  total: Money | null;
};

export function legacyKitOffer(product: Product | null, stoneSize: string | null): LegacyKitOffer {
  const size = stoneSize ?? KIT_DEFAULT_STONE;
  const variants = APPROVED_CHAIN_LENGTHS.flatMap((chainLength) => {
    if (!product) return [];
    const resolution = resolveVariant(product, { stoneSize: size, chainLength });
    return resolution.status === "available" ? [resolution.variant] : [];
  });
  const live =
    variants.length === APPROVED_CHAIN_LENGTHS.length
      ? sumMoney(variants.map((item) => item.price))
      : null;
  return {
    stoneSize: size,
    lengths: APPROVED_CHAIN_LENGTHS,
    variants,
    ready: variants.length === APPROVED_CHAIN_LENGTHS.length,
    total: live ?? expectedKitTotal(size),
  };
}

export type SpendProgress = {
  cents: number;
  reachedCare: boolean;
  reachedFreeUsShipping: boolean;
  reachedGift: boolean;
  toCare: Money;
  toGift: Money;
  message: string;
};

export function spendProgress(cents: number): SpendProgress {
  const care = parseMoney(CARE_THRESHOLD, "USD");
  const gift = parseMoney(US_GIFT_NECKLACE_THRESHOLD, "USD");
  const freeShip = parseMoney(FREE_SHIPPING_THRESHOLD, "USD");
  const reachedCare = cents >= care.cents;
  const reachedGift = cents >= gift.cents;
  const reachedFreeUsShipping = cents >= freeShip.cents;
  const toCareCents = Math.max(0, care.cents - cents);
  const toGiftCents = Math.max(0, gift.cents - cents);
  let message: string;
  if (cents <= 0) {
    message = `From $${dollars(CARE_THRESHOLD)}, five years of care. From $${dollars(US_GIFT_NECKLACE_THRESHOLD)}, a complimentary Legacy chain of your choice.`;
  } else if (!reachedCare) {
    message = `${formatMoney(parseMoney((toCareCents / 100).toFixed(2), "USD"))} more includes five years of care.`;
  } else if (!reachedGift) {
    message = `Five years of care is with you. ${formatMoney(parseMoney((toGiftCents / 100).toFixed(2), "USD"))} more includes a complimentary Legacy chain of your choice.`;
  } else {
    message =
      "A complimentary Legacy chain of your choice is with the order. Tell us the size and length.";
  }
  return {
    cents,
    reachedCare,
    reachedFreeUsShipping,
    reachedGift,
    toCare: parseMoney((toCareCents / 100).toFixed(2), "USD"),
    toGift: parseMoney((toGiftCents / 100).toFixed(2), "USD"),
    message,
  };
}

export function offerCopy(): string {
  return [
    TARGET_ORDER_AMOUNT,
    CARE_THRESHOLD,
    FREE_SHIPPING_THRESHOLD,
    INTERNATIONAL_FREE_SHIPPING_THRESHOLD,
    US_GIFT_NECKLACE_THRESHOLD,
  ].join(" ");
}
