"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  CUSTOMER_CART_ERROR,
  CUSTOMER_CHECKOUT_ERROR,
  CUSTOMER_CONFIGURATION_UNAVAILABLE,
  CUSTOMER_KIT_UNAVAILABLE,
  CUSTOMER_UNAVAILABLE,
  findPurchasableVariant,
  isCartLineId,
  isVariantId,
  legacyKitOffer,
  normalizeQuantity,
} from "@truepointers/commerce";
import type { Cart, CommerceResult } from "@truepointers/commerce";
import type { StorefrontClient } from "@truepointers/commerce/shopify";
import { isTrustedCheckoutUrl } from "@truepointers/commerce/shopify";
import { idleActionState, type ActionState } from "@/lib/action-state";
import { getCatalog } from "@/lib/catalog";
import { currentCartId, getCart, saveCartId } from "@/lib/cart";
import { getStorefront } from "@/lib/shopify";

async function addVariants(
  client: StorefrontClient,
  cartId: string | null,
  variantIds: string[],
): Promise<CommerceResult<Cart>> {
  const [first, ...rest] = variantIds;
  if (!first) return { ok: false, code: "not_purchasable", message: CUSTOMER_KIT_UNAVAILABLE };
  const result = cartId
    ? await client.addLines(cartId, [{ merchandiseId: first, quantity: 1 }])
    : await client.createCart(first, 1);
  if (!result.ok || rest.length === 0) return result;
  const added = await client.addLines(
    result.data.id,
    rest.map((merchandiseId) => ({ merchandiseId, quantity: 1 })),
  );
  return added.ok ? added : result;
}

export async function addToCart(_state: ActionState, formData: FormData): Promise<ActionState> {
  const intent = String(formData.get("intent") ?? "cart");
  const catalog = await getCatalog();
  if (catalog.state !== "live") return { error: CUSTOMER_UNAVAILABLE };

  let variantIds: string[] = [];
  if (intent === "kit" || intent === "pay-later-kit") {
    const kit = legacyKitOffer(catalog.legacy, String(formData.get("stone-size") || "") || null);
    if (!kit.ready) return { error: CUSTOMER_KIT_UNAVAILABLE };
    variantIds = kit.variants.map((variant) => variant.id);
  } else {
    const variantId = String(formData.get("variantId") ?? "");
    if (!isVariantId(variantId)) return { error: CUSTOMER_CONFIGURATION_UNAVAILABLE };
    const decision = findPurchasableVariant([catalog.legacy, catalog.flawless], variantId);
    if (!decision.ok) return { error: decision.message };
    variantIds = [variantId];
  }

  const client = await getStorefront();
  const result = await addVariants(client, (await currentCartId()) ?? null, variantIds);
  if (!result.ok) return { error: result.message };
  await saveCartId(result.data.id);
  if (
    (intent === "pay-later" || intent === "pay-later-kit") &&
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
