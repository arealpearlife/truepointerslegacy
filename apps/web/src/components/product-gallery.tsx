"use client";

import { useState } from "react";
import type { ImageAsset, Product, Resolution, VideoAsset } from "@truepointers/commerce";
import { Placeholder } from "./placeholder";

type MediaItem = { kind: "image"; asset: ImageAsset } | { kind: "video"; asset: VideoAsset };

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
  const media: MediaItem[] = [
    ...(product?.videos ?? []).map((asset) => ({ kind: "video" as const, asset })),
    ...(product?.images ?? []).map((asset) => ({ kind: "image" as const, asset })),
  ];
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const active: MediaItem | null =
    selected ?? (variantImage ? { kind: "image", asset: variantImage } : (media[0] ?? null));

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
      {active.kind === "video" ? (
        <video
          key={active.asset.url}
          controls
          muted
          playsInline
          loop
          preload="metadata"
          poster={active.asset.previewImage?.url}
          aria-label={`${title} product video`}
        >
          <source src={active.asset.url} type={active.asset.mimeType ?? undefined} />
        </video>
      ) : (
        <img
          src={active.asset.url}
          alt={active.asset.altText ?? `${title} product image`}
          width={active.asset.width ?? 1600}
          height={active.asset.height ?? 1600}
        />
      )}
      {media.length > 1 ? (
        <div className="thumbs">
          {media.map((item) => (
            <button
              key={item.asset.url}
              type="button"
              onClick={() => setSelected(item)}
              aria-label={item.kind === "video" ? "Play product video" : "Show product image"}
              aria-pressed={active.asset.url === item.asset.url}
            >
              {item.kind === "video" ? (
                <span className="thumb-video">
                  {item.asset.previewImage ? (
                    <img src={item.asset.previewImage.url} alt="" width={72} height={72} />
                  ) : null}
                  <b aria-hidden="true">▶</b>
                </span>
              ) : (
                <img src={item.asset.url} alt="" width={72} height={72} />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
