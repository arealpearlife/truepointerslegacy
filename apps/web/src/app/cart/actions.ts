"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  CUSTOMER_CART_ERROR,
  CUSTOMER_CHECKOUT_ERROR,
  CUSTOMER_CONFIGURATION_UNAVAILABLE,
  CUSTOMER_UNAVAILABLE,
  findPurchasableVariant,
  isCartLineId,
  isVariantId,
  normalizeQuantity,
} from "@truepointers/commerce";
import { isTrustedCheckoutUrl } from "@truepointers/commerce/shopify";
import { idleActionState, type ActionState } from "@/lib/action-state";
import { getCatalog } from "@/lib/catalog";
import { currentCartId, getCart, saveCartId } from "@/lib/cart";
import { getStorefront } from "@/lib/shopify";

export async function addToCart(_state: ActionState, formData: FormData): Promise<ActionState> {
  const variantId = String(formData.get("variantId") ?? "");
  if (!isVariantId(variantId)) return { error: CUSTOMER_CONFIGURATION_UNAVAILABLE };
  const catalog = await getCatalog();
  if (catalog.state !== "live") return { error: CUSTOMER_UNAVAILABLE };
  const decision = findPurchasableVariant([catalog.legacy, catalog.flawless], variantId);
  if (!decision.ok) return { error: decision.message };

  const client = await getStorefront();
  const cartId = await currentCartId();
  const result = cartId
    ? await client.addLines(cartId, [{ merchandiseId: variantId, quantity: 1 }])
    : await client.createCart(variantId, 1);
  if (!result.ok) return { error: result.message };
  await saveCartId(result.data.id);
  if (
    String(formData.get("intent")) === "pay-later" &&
    isTrustedCheckoutUrl(result.data.checkoutUrl)
  ) {
    redirect(result.data.checkoutUrl);
  }
  redirect("/cart");
}

export async function updateLine(_state: ActionState, formData: FormData): Promise<ActionState> {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = normalizeQuantity(formData.get("quantity"));
  if (!isCartLineId(lineId) || quantity === null) return { error: CUSTOMER_CART_ERROR };
  const cartId = await currentCartId();
  if (!cartId) return { error: CUSTOMER_CART_ERROR };
  const client = await getStorefront();
  const result = await client.updateLines(cartId, [{ id: lineId, quantity }]);
  if (!result.ok) return { error: result.message };
  await saveCartId(result.data.id);
  revalidatePath("/cart");
  return idleActionState;
}

export async function removeLine(_state: ActionState, formData: FormData): Promise<ActionState> {
  const lineId = String(formData.get("lineId") ?? "");
  if (!isCartLineId(lineId)) return { error: CUSTOMER_CART_ERROR };
  const cartId = await currentCartId();
  if (!cartId) return { error: CUSTOMER_CART_ERROR };
  const client = await getStorefront();
  const result = await client.removeLines(cartId, [lineId]);
  if (!result.ok) return { error: result.message };
  await saveCartId(result.data.id);
  revalidatePath("/cart");
  return idleActionState;
}

export async function beginCheckout(state: ActionState, formData: FormData): Promise<ActionState> {
  void state;
  void formData;
  const cart = await getCart();
  if (!cart || !isTrustedCheckoutUrl(cart.checkoutUrl)) return { error: CUSTOMER_CHECKOUT_ERROR };
  redirect(cart.checkoutUrl);
}
