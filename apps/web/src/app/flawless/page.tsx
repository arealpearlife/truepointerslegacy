import type { Metadata } from "next";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  STONE_SIZE,
  marketing,
  optionValues,
} from "@truepointers/commerce";
import { addToCart } from "@/app/cart/actions";
import { ProductExperience } from "@/components/product-experience";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Flawless · Buy now, pay later",
  description: marketing.payLaterBody,
};

type PageProps = {
  searchParams: Promise<{ stone?: string; length?: string }>;
};

export default async function FlawlessPayLaterPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const catalog = await getCatalog();
  const flawless = catalog.state === "live" ? catalog.flawless : null;
  const sizes = flawless ? optionValues(flawless, STONE_SIZE) : [...APPROVED_STONE_SIZES];
  const lengths = flawless ? optionValues(flawless, CHAIN_LENGTH) : [...APPROVED_CHAIN_LENGTHS];

  return (
    <ProductExperience
      edition="flawless"
      product={flawless}
      flawless={flawless}
      initialSelection={{
        stoneSize: query.stone && sizes.includes(query.stone) ? query.stone : null,
        chainLength: query.length && lengths.includes(query.length) ? query.length : null,
      }}
      addToCart={addToCart}
      payLater
    />
  );
}
