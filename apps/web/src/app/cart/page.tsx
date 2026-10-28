import Link from "next/link";
import { formatMoney, HANDLES, marketing } from "@truepointers/commerce";
import { beginCheckout } from "@/app/cart/actions";
import { CartLineControls, CheckoutForm } from "@/components/cart-controls";
import { getCart } from "@/lib/cart";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const cart = await getCart();
  return (
    <main id="main">
      <h1>Cart</h1>
      {!cart || cart.lines.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href={`/products/${HANDLES.legacy}`}>{marketing.shopLegacy}</Link>
        </p>
      ) : (
        <>
          {cart.lines.map((line) => (
            <article className="cart-line" key={line.id}>
              <h2>{line.productTitle}</h2>
              <p>
                {line.selectedOptions
                  .map((option) => `${option.name}: ${option.value}`)
                  .join(" · ")}
              </p>
              {line.image ? (
                <img
                  src={line.image.url}
                  alt={line.image.altText ?? line.productTitle}
                  width={160}
                  height={160}
                />
              ) : null}
              <CartLineControls line={line} />
            </article>
          ))}
          <p className="price">Subtotal {formatMoney(cart.subtotal)}</p>
          <p className="note">Shipping and taxes are calculated at Shopify checkout.</p>
          <CheckoutForm action={beginCheckout} />
        </>
      )}
    </main>
  );
}
