"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  HANDLES,
  STONE_SIZE,
  configurationHref,
  flawlessStartingOffer,
  formatMoney,
  marketing,
  materialStatement,
  optionValues,
  orderedVariants,
  selectedOption,
  type Product,
  type Selection,
} from "@truepointers/commerce";

export function FlawlessDialog({
  open,
  flawless,
  selection,
  onClose,
}: {
  open: boolean;
  flawless: Product | null;
  selection: Selection;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  const offer = flawlessStartingOffer(flawless);
  const variants = flawless ? orderedVariants(flawless) : [];
  const sizes = flawless ? optionValues(flawless, STONE_SIZE) : [...APPROVED_STONE_SIZES];
  const lengths = flawless ? optionValues(flawless, CHAIN_LENGTH) : [...APPROVED_CHAIN_LENGTHS];

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="flawless-title"
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" onClick={onClose}>
          {marketing.close}
        </button>
        <p className="eyebrow">{marketing.flawlessUpgrade}</p>
        <h2 id="flawless-title">{marketing.modalTitle}</h2>
        <p>{marketing.modalBody}</p>
        <p>{materialStatement("flawless", flawless)}</p>
        {offer ? <p>{marketing.fromPrice}</p> : null}
        <p>
          Sizes: {sizes.join(", ")}. Lengths: {lengths.join(", ")}.
        </p>
        {variants.length > 0 ? (
          <ul className="options">
            {variants.map((variant) => {
              const nextSelection = {
                stoneSize: selectedOption(variant, STONE_SIZE),
                chainLength: selectedOption(variant, CHAIN_LENGTH),
              };
              return (
                <li key={variant.id}>
                  <Link href={configurationHref(HANDLES.flawless, nextSelection)}>
                    <span>{variant.title}</span>
                    <span>
                      {variant.availableForSale ? formatMoney(variant.price) : "Not available"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Flawless pricing appears when Shopify publishes the configurations.</p>
        )}
        <div className="modal-actions">
          <Link className="button primary" href={configurationHref(HANDLES.flawless, selection)}>
            {marketing.flawlessUpgrade}
          </Link>
          <button type="button" onClick={onClose}>
            {marketing.keepLegacy}
          </button>
        </div>
        <p className="caption">
          Legacy stays selected. Nothing is added to the cart from this window.
        </p>
      </div>
    </div>
  );
}
