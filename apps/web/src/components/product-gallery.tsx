"use client";

import { useState } from "react";
import type { ImageAsset, Product, Resolution } from "@truepointers/commerce";
import { Placeholder } from "./placeholder";

export function ProductGallery({
  product,
  resolution,
  title,
  headline,
  detail,
}: {
  product: Product | null;
  resolution: Resolution | null;
  title: string;
  headline: string;
  detail: string;
}) {
  const variantImage =
    resolution && (resolution.status === "available" || resolution.status === "unavailable")
      ? resolution.variant?.image
      : null;
  const images = product?.images ?? [];
  const initial = variantImage ?? images[0] ?? null;
  const [selected, setSelected] = useState<ImageAsset | null>(initial);
  const active = variantImage ?? selected ?? images[0] ?? null;

  if (!active) {
    return (
      <Placeholder
        headline={headline}
        detail={detail}
        label="Product photography will appear here after it is uploaded in Shopify Admin."
      />
    );
  }

  return (
    <div className="gallery">
      <img
        src={active.url}
        alt={active.altText ?? `${title} product image`}
        width={active.width ?? 1600}
        height={active.height ?? 1600}
      />
      {images.length > 1 ? (
        <div className="thumbs">
          {images.map((image) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setSelected(image)}
              aria-label={image.altText ?? "Show product image"}
            >
              <img src={image.url} alt="" width={72} height={72} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
