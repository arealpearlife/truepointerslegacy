import type { Money } from "./types";

export function parseMoney(amount: string, currencyCode: string): Money {
  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    throw new Error("Invalid currency.");
  }
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    throw new Error("Invalid amount.");
  }
  const [whole = "0", fraction = ""] = amount.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents)) {
    throw new Error("Amount is out of range.");
  }
  return {
    amount: `${whole}.${fraction.padEnd(2, "0")}`,
    currencyCode,
    cents,
  };
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: money.cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(money.cents / 100);
}
