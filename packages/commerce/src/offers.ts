import { LEGACY_PRICES } from "./approval";
import { formatMoney, parseMoney } from "./money";
import {
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
  reachedFreeUsShipping: boolean;
  reachedThousand: boolean;
  toFreeUsShipping: Money;
  toThousand: Money;
  message: string;
};

export function spendProgress(cents: number): SpendProgress {
  const freeShip = parseMoney(FREE_SHIPPING_THRESHOLD, "USD");
  const thousand = parseMoney(TARGET_ORDER_AMOUNT, "USD");
  const reachedFreeUsShipping = cents >= freeShip.cents;
  const reachedThousand = cents >= thousand.cents;
  const toFree = Math.max(0, freeShip.cents - cents);
  const toThousand = Math.max(0, thousand.cents - cents);
  let message: string;
  if (cents <= 0) {
    message = `One Flawless chain or the three-length Legacy kit is the $${dollars(TARGET_ORDER_AMOUNT)} look. One chain still ships free in the US at $${dollars(FREE_SHIPPING_THRESHOLD)}.`;
  } else if (!reachedFreeUsShipping) {
    message = `${formatMoney(parseMoney((toFree / 100).toFixed(2), "USD"))} more and US shipping is free. One chain is still a full chain.`;
  } else if (!reachedThousand) {
    message = `US shipping is free. Pay later at checkout if you want the $${dollars(TARGET_ORDER_AMOUNT)} look today — the kit or Flawless.`;
  } else {
    message = `That is the $${dollars(TARGET_ORDER_AMOUNT)} look. US orders include a free Legacy necklace. Pay later stays at checkout.`;
  }
  return {
    cents,
    reachedFreeUsShipping,
    reachedThousand,
    toFreeUsShipping: parseMoney((toFree / 100).toFixed(2), "USD"),
    toThousand: parseMoney((toThousand / 100).toFixed(2), "USD"),
    message,
  };
}

export function offerCopy(): string {
  return [
    TARGET_ORDER_AMOUNT,
    FREE_SHIPPING_THRESHOLD,
    INTERNATIONAL_FREE_SHIPPING_THRESHOLD,
    US_GIFT_NECKLACE_THRESHOLD,
  ].join(" ");
}
