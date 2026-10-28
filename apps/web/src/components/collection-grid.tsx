import Image from "next/image";
import Link from "next/link";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  HANDLES,
  configurationHref,
  formatMoney,
  resolveVariant,
  type Product,
  type Selection,
  type VideoAsset,
} from "@truepointers/commerce";
import { lengthLabel, stoneLabel } from "@/lib/labels";
import { REPRESENTATIVE_CAPTION, configurationPreviewVideo } from "@/lib/local-media";
import { PreviewVideo } from "./preview-video";

type Card = {
  selection: Selection;
  price: string | null;
  available: boolean;
  image: { url: string; altText: string | null } | null;
  video: VideoAsset | null;
};

export function collectionCards(product: Product | null): Card[] {
  return APPROVED_STONE_SIZES.flatMap((stoneSize) =>
    APPROVED_CHAIN_LENGTHS.map((chainLength) => {
      const selection = { stoneSize, chainLength };
      const resolution = product ? resolveVariant(product, selection) : null;
      const variant =
        resolution?.status === "available" || resolution?.status === "unavailable"
          ? resolution.variant
          : null;
      const image = variant?.image ?? product?.images[0] ?? null;
      return {
        selection,
        price: variant ? formatMoney(variant.price) : null,
        available: resolution?.status === "available",
        image,
        video: image ? null : (product?.videos[0] ?? configurationPreviewVideo(selection)),
      };
    }),
  );
}

export function CollectionGrid({ product }: { product: Product | null }) {
  const cards = collectionCards(product);
  return (
    <ul className="product-grid lookbook">
      {cards.map((card, index) => {
        const stone = stoneLabel(card.selection.stoneSize ?? "");
        const length = lengthLabel(card.selection.chainLength ?? "");
        const name = `Legacy Tennis Chain — ${stone} × ${length}`;
        return (
          <li className="card" data-slot={index + 1} key={`${stone}-${length}`}>
            <Link href={configurationHref(HANDLES.legacy, card.selection)}>
              <div className="card-media">
                {card.image ? (
                  <Image
                    src={card.image.url}
                    alt={card.image.altText ?? name}
                    fill
                    sizes="(min-width: 900px) 28vw, (min-width: 760px) 40vw, 72vw"
                  />
                ) : card.video ? (
                  <>
                    <PreviewVideo video={card.video} />
                    <span className="media-note">{REPRESENTATIVE_CAPTION}</span>
                  </>
                ) : null}
                {card.available ? null : <span className="badge">Not yet available</span>}
              </div>
              <p className="card-title">{name}</p>
              {card.price ? (
                <p className="card-price">{card.price}</p>
              ) : (
                <p className="card-price pending">Price set at launch</p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
