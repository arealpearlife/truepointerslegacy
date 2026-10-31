"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  HANDLES,
  PRODUCT_TITLES,
  STONE_SIZE,
  displayPrice,
  flawlessStartingOffer,
  legacyKitOffer,
  marketing,
  optionValues,
  resolveVariant,
  selectionMessage,
  type Edition,
  type Product,
  type Selection,
} from "@truepointers/commerce";
import type { ActionState } from "@/lib/action-state";
import { idleActionState } from "@/lib/action-state";
import { lengthLabel, stoneLabel } from "@/lib/labels";
import { FitGuide } from "./fit-guide";
import { IncentiveBanners } from "./incentive-banners";
import { KitOffer } from "./kit-offer";
import { previewVideo } from "@/lib/local-media";
import { MediaPanel } from "./media-panel";
import { Motto } from "./motto";
import { PayLaterStrip } from "./pay-later-strip";
import { ProductGallery } from "./product-gallery";
import { Tape } from "./tape";

export function ProductExperience({
  edition,
  product,
  flawless,
  initialSelection,
  addToCart,
  payLater = false,
}: {
  edition: Edition;
  product: Product | null;
  flawless: Product | null;
  initialSelection: Selection;
  addToCart: (state: ActionState, formData: FormData) => Promise<ActionState>;
  payLater?: boolean;
}) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [state, action, pending] = useActionState(addToCart, idleActionState);
  const resolution = product ? resolveVariant(product, selection) : null;
  const price = resolution ? displayPrice(resolution) : null;
  const message = selectionMessage(product, selection);
  const sizes = product ? optionValues(product, STONE_SIZE) : [...APPROVED_STONE_SIZES];
  const lengths = product ? optionValues(product, CHAIN_LENGTH) : [...APPROVED_CHAIN_LENGTHS];
  const offer = edition === "flawless" ? flawlessStartingOffer(product) : null;
  const title = product?.title ?? PRODUCT_TITLES[edition];
  const variantId = resolution?.status === "available" ? resolution.variant.id : "";
  const kit = edition === "legacy" ? legacyKitOffer(product, selection.stoneSize) : null;

  return (
    <main id="main" data-surface={edition === "flawless" ? "flawless" : "legacy"}>
      <div className={edition === "legacy" ? "product-layout" : "product-layout without-panel"}>
        <ProductGallery
          product={product}
          resolution={resolution}
          title={title}
          headline={edition === "legacy" ? "LEGACY" : "FLAWLESS"}
          detail={[
            selection.stoneSize ? stoneLabel(selection.stoneSize) : null,
            selection.chainLength ? lengthLabel(selection.chainLength) : null,
          ]
            .filter(Boolean)
            .join(" × ")}
          fallbackVideo={previewVideo(
            payLater ? "pay-later" : edition === "legacy" ? "legacy-gallery" : "flawless-gallery",
          )}
        />
        <section className="buy-box">
          <p className="eyebrow">{payLater ? marketing.payLaterEyebrow : marketing.eyebrow}</p>
          <h1 className="poster product-name">
            {edition === "legacy" ? marketing.legacyName : marketing.payLaterTitle}
          </h1>
          {edition === "legacy" ? (
            <>
              <Motto className="on-plate" lead={marketing.plateLead} shine={marketing.plateMotto} />
              <p className="statement accent">{marketing.iceLine}</p>
              <p className="note">{marketing.craftLine}</p>
            </>
          ) : (
            <>
              <Motto
                className="on-plate on-ice"
                lead={marketing.flawlessPlateLead}
                shine={marketing.flawlessPlateShine}
              />
              <p className="statement accent">{marketing.flawlessLine}</p>
              <p>{payLater ? marketing.payLaterBody : marketing.flawlessBody}</p>
              {offer ? <p className="from-price">{marketing.fromPrice}</p> : null}
              <p>
                <Link href={`/products/${HANDLES.legacy}`}>{marketing.keepLegacy}</Link>
              </p>
            </>
          )}
          {price ? <p className="price">{price}</p> : null}
          <PayLaterStrip compact />
          <p className="note">{marketing.payLaterEase}</p>
          <IncentiveBanners layout="notes" />
          <form action={action}>
            <fieldset className="choices">
              <legend>Stone size</legend>
              {sizes.map((size) => (
                <label key={size}>
                  <input
                    type="radio"
                    name="stone-size"
                    value={size}
                    checked={selection.stoneSize === size}
                    onChange={() => setSelection((current) => ({ ...current, stoneSize: size }))}
                  />
                  {size}
                </label>
              ))}
            </fieldset>
            <fieldset className="choices">
              <legend>Chain length</legend>
              {lengths.map((length) => (
                <label key={length}>
                  <input
                    type="radio"
                    name="chain-length"
                    value={length}
                    checked={selection.chainLength === length}
                    onChange={() =>
                      setSelection((current) => ({ ...current, chainLength: length }))
                    }
                  />
                  {length}
                </label>
              ))}
            </fieldset>
            <input type="hidden" name="variantId" value={variantId} />
            {message ? <p className="alert">{message}</p> : null}
            {state.error ? <p role="alert">{state.error}</p> : null}
            <button
              className="primary wide"
              type="submit"
              name="intent"
              value="cart"
              disabled={resolution?.status !== "available" || pending}
            >
              {pending ? "Adding" : marketing.addToCart}
            </button>
            <button
              className="ice wide"
              type="submit"
              name="intent"
              value="pay-later"
              disabled={resolution?.status !== "available" || pending}
            >
              {pending ? "Adding" : marketing.payLaterCta}
            </button>
            {kit ? <KitOffer kit={kit} pending={pending} /> : null}
          </form>
          {edition === "legacy" ? (
            <Link className="button ice wide" href="/flawless">
              {marketing.flawlessUpgrade}
            </Link>
          ) : null}
        </section>
        {edition === "legacy" ? <MediaPanel flawless={flawless} /> : null}
      </div>
      <Tape tone="ice" />
      <FitGuide
        selected={selection.chainLength}
        onSelect={(chainLength) => setSelection((current) => ({ ...current, chainLength }))}
      />
    </main>
  );
}
