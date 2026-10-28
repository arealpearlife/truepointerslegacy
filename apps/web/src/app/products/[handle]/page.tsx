import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  APPROVED_CHAIN_LENGTHS,
  APPROVED_STONE_SIZES,
  CHAIN_LENGTH,
  STONE_SIZE,
  editionFromHandle,
  marketing,
  optionValues,
  publicDetails,
  type Product,
  type Selection,
} from "@truepointers/commerce";
import { ProductExperience } from "@/components/product-experience";
import { addToCart } from "@/app/cart/actions";
import { getCatalog } from "@/lib/catalog";
import { publicSiteOrigin } from "@/lib/site";

type PageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ explore?: string; stone?: string; length?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const edition = editionFromHandle(handle);
  if (!edition) return { title: "Product" };
  return { title: edition === "legacy" ? "Legacy Tennis Chain" : "Flawless Tennis Chain" };
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const [{ handle }, query] = await Promise.all([params, searchParams]);
  const edition = editionFromHandle(handle);
  if (!edition) notFound();
  if (edition === "legacy" && query.explore === "flawless") redirect("/flawless");
  const catalog = await getCatalog();
  const legacy = catalog.state === "live" ? catalog.legacy : null;
  const flawless = catalog.state === "live" ? catalog.flawless : null;
  const product = edition === "legacy" ? legacy : flawless;

  return (
    <>
      {product ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
        />
      ) : null}
      <ProductExperience
        edition={edition}
        product={product}
        flawless={flawless}
        initialSelection={readSelection(query, product)}
        addToCart={addToCart}
      />
    </>
  );
}

function readSelection(
  query: { stone?: string; length?: string },
  product: Product | null,
): Selection {
  const sizes = product ? optionValues(product, STONE_SIZE) : [...APPROVED_STONE_SIZES];
  const lengths = product ? optionValues(product, CHAIN_LENGTH) : [...APPROVED_CHAIN_LENGTHS];
  return {
    stoneSize: query.stone && sizes.includes(query.stone) ? query.stone : null,
    chainLength: query.length && lengths.includes(query.length) ? query.length : null,
  };
}

function productJsonLd(product: Product) {
  const currencies = new Set(product.variants.map((variant) => variant.price.currencyCode));
  const base = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      publicDetails[editionFromHandle(product.handle) ?? "legacy"] || marketing.collectionStory,
    url: `${publicSiteOrigin()}/products/${product.handle}`,
    brand: { "@type": "Brand", name: "True Pointers" },
  };
  if (currencies.size !== 1 || product.variants.length === 0) return base;
  const low = Math.min(...product.variants.map((variant) => variant.price.cents));
  const high = Math.max(...product.variants.map((variant) => variant.price.cents));
  return {
    ...base,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: [...currencies][0],
      lowPrice: product.variants.find((variant) => variant.price.cents === low)?.price.amount,
      highPrice: product.variants.find((variant) => variant.price.cents === high)?.price.amount,
      offerCount: product.variants.length,
      availability: product.variants.some((variant) => variant.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}
