import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import type { Cart } from "@truepointers/commerce";
import { getStorefront } from "./shopify";

const CART_COOKIE = "tp_cart";

export const getCart = cache(async (): Promise<Cart | null> => {
  const jar = await cookies();
  const cartId = jar.get(CART_COOKIE)?.value;
  if (!cartId) return null;
  const client = await getStorefront();
  const result = await client.getCart(cartId);
  if (!result.ok || !result.data) return null;
  return result.data;
});

export async function saveCartId(cartId: string): Promise<void> {
  const jar = await cookies();
  jar.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function currentCartId(): Promise<string | undefined> {
  const cart = await getCart();
  return cart?.id;
}
