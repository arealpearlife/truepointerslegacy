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
  marketing,
  materialStatement,
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
import { FlawlessDialog } from "./flawless-dialog";
import { legacyChainVideo } from "@/lib/local-media";
import { MediaPanel } from "./media-panel";
import { Motto } from "./motto";
import { ProductGallery } from "./product-gallery";
import { Tape } from "./tape";

export function ProductExperience({
  edition,
  product,
  flawless,
  initialSelection,
  initialModalOpen,
  addToCart,
}: {
  edition: Edition;
  product: Product | null;
  flawless: Product | null;
  initialSelection: Selection;
  initialModalOpen: boolean;
  addToCart: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [modalOpen, setModalOpen] = useState(initialModalOpen && edition === "legacy");
  const [state, action, pending] = useActionState(addToCart, idleActionState);
  const resolution = product ? resolveVariant(product, selection) : null;
  const price = resolution ? displayPrice(resolution) : null;
  const message = selectionMessage(product, selection);
  const sizes = product ? optionValues(product, STONE_SIZE) : [...APPROVED_STONE_SIZES];
  const lengths = product ? optionValues(product, CHAIN_LENGTH) : [...APPROVED_CHAIN_LENGTHS];
  const offer = edition === "flawless" ? flawlessStartingOffer(product) : null;
  const title = product?.title ?? PRODUCT_TITLES[edition];
  const variantId = resolution?.status === "available" ? resolution.variant.id : "";

  return (
    <main id="main">
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
          fallbackVideo={edition === "legacy" ? legacyChainVideo : undefined}
        />
        <section className="buy-box">
          <p className="eyebrow">{marketing.eyebrow}</p>
          <h1 className="poster product-name">
            {edition === "legacy" ? marketing.legacyName : marketing.flawlessName}
          </h1>
          {edition === "legacy" ? (
            <>
              <Motto className="on-plate" lead={marketing.plateLead} shine={marketing.plateMotto} />
              <p className="statement accent">{marketing.iceLine}</p>
              <p>{marketing.heroBody}</p>
            </>
          ) : (
            <>
              <p className="statement">{marketing.flawlessHeading}</p>
              <p className="statement accent">{marketing.flawlessLine}</p>
              <p>{marketing.flawlessBody}</p>
              {offer ? <p>{marketing.fromPrice}</p> : null}
              <p>
                <Link href={`/products/${HANDLES.legacy}`}>Shop Legacy</Link>
              </p>
            </>
          )}
          {price ? <p className="price">{price}</p> : null}
          {price ? (
            <p className="note">Shipping and taxes are calculated at Shopify checkout.</p>
          ) : null}
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
              disabled={resolution?.status !== "available" || pending}
            >
              {pending ? "Adding" : marketing.addToCart}
            </button>
          </form>
          {edition === "legacy" ? (
            <button className="ice wide" type="button" onClick={() => setModalOpen(true)}>
              {marketing.flawlessUpgrade}
            </button>
          ) : null}
          <section>
            <h2>Product details</h2>
            <p className="details">{materialStatement(edition, product)}</p>
          </section>
        </section>
        {edition === "legacy" ? (
          <MediaPanel flawless={flawless} onExplore={() => setModalOpen(true)} />
        ) : null}
      </div>
      <Tape tone="ice" />
      <FitGuide
        selected={selection.chainLength}
        onSelect={(chainLength) => setSelection((current) => ({ ...current, chainLength }))}
      />
      {edition === "legacy" ? (
        <FlawlessDialog
          open={modalOpen}
          flawless={flawless}
          selection={selection}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </main>
  );
}
