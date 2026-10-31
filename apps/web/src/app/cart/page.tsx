import { expectedKitTotal } from "@truepointers/commerce";
import { beginCheckout } from "@/app/cart/actions";
import { CartLineControls, CheckoutForm } from "@/components/cart-controls";
import { IncentiveBanners } from "@/components/incentive-banners";
import { PreviewVideo } from "@/components/preview-video";
import { SpendLadder } from "@/components/spend-ladder";
import { SpendPaths } from "@/components/spend-paths";
import { getCart } from "@/lib/cart";
import { REPRESENTATIVE_CAPTION, keyedPreviewVideo } from "@/lib/local-media";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const cart = await getCart();
  return (
    <main id="main">
      <h1>Cart</h1>
      {!cart || cart.lines.length === 0 ? (
        <>
          <p>
            Your cart is empty. One Flawless chain or the three-length kit is the $1,000 look. One
            chain still ships free in the US at $500.
          </p>
          <SpendPaths kitTotal={expectedKitTotal("3 mm")} flawlessFrom={null} />
        </>
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
              ) : (
                <div className="cart-line-media">
                  <PreviewVideo video={keyedPreviewVideo(line.productTitle)} />
                  <span className="media-note">{REPRESENTATIVE_CAPTION}</span>
                </div>
              )}
              <CartLineControls line={line} />
            </article>
          ))}
          <SpendLadder subtotal={cart.subtotal} />
          <p className="note">Shipping and taxes are calculated at Shopify checkout.</p>
          <IncentiveBanners layout="notes" />
          <CheckoutForm action={beginCheckout} />
        </>
      )}
    </main>
  );
}
