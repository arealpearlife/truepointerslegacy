import { MAX_LINE_QUANTITY } from "./store";

export function isCartLineId(value: string): boolean {
  return value.startsWith("gid://shopify/CartLine/") && value.length < 500;
}

export function normalizeQuantity(value: unknown): number | null {
  const quantity = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) return null;
  return quantity;
}
