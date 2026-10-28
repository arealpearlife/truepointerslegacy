import Image from "next/image";
import Link from "next/link";
import { HANDLES, flawlessStartingOffer, marketing } from "@truepointers/commerce";
import { CollectionGrid } from "@/components/collection-grid";
import { Placeholder } from "@/components/placeholder";
import { ShortcutRings } from "@/components/shortcut-rings";
import { getCatalog } from "@/lib/catalog";

const legacyHref = `/products/${HANDLES.legacy}`;

export default async function HomePage() {
  const catalog = await getCatalog();
  const legacy = catalog.state === "live" ? catalog.legacy : null;
  const flawless = catalog.state === "live" ? catalog.flawless : null;
  const offer = flawlessStartingOffer(flawless);
  const heroImage = legacy?.images[0] ?? null;

  return (
    <main id="main" className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">{marketing.eyebrow}</p>
            <h1 className="hero-title poster">{marketing.heroTitle}</h1>
            <p className="hero-line">{marketing.heroLine}</p>
            <p className="hero-line ice">{marketing.heroLineTwo}</p>
            <p className="hero-copy">{marketing.heroBody}</p>
            <div className="actions">
              <Link className="button solid-white" href={legacyHref}>
                {marketing.shopLegacy}
              </Link>
              <Link className="button ice" href={`${legacyHref}?explore=flawless`}>
                {marketing.exploreFlawless}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            {heroImage ? (
              <Image
                src={heroImage.url}
                alt={heroImage.altText ?? "Legacy Extended Tennis Chain"}
                fill
                priority
                sizes="(min-width: 900px) 45vw, 100vw"
              />
            ) : (
              <Placeholder
                headline="LEGACY"
                detail="Extended tennis chain"
                label="Legacy photography will appear here after it is uploaded in Shopify Admin."
              />
            )}
          </div>
        </div>
      </section>

      <ShortcutRings />

      <section className="container collection" aria-labelledby="collection-title">
        <header className="collection-head">
          <h2 id="collection-title">The Legacy Collection</h2>
          <p>
            One chain, built your way. Choose a 3MM, 4MM, or 5MM stone and a 40, 44, or 48 inch
            length, then make it yours.
          </p>
        </header>
        <div className="assurance">
          <h3>Checkout powered by Shopify</h3>
          <p>
            Every price and availability status comes straight from our Shopify store. Shipping and
            taxes are calculated at checkout.
          </p>
        </div>
        <div className="toolbar">
          <span>9 configurations</span>
          <Link href={legacyHref}>View the full product</Link>
        </div>
        <CollectionGrid product={legacy} />
      </section>

      <section className="flawless-band" aria-labelledby="flawless-band-title">
        <div className="container flawless-inner">
          <div>
            <p className="eyebrow">{marketing.exploreFlawless}</p>
            <h2 id="flawless-band-title">{marketing.flawlessHeading}</h2>
            <p className="hero-line">{marketing.flawlessLine}</p>
            <p>{marketing.flawlessBody}</p>
            {offer ? <p className="from-price">{marketing.fromPrice}</p> : null}
          </div>
          <div className="actions">
            <Link className="button ink" href={`${legacyHref}?explore=flawless`}>
              {marketing.exploreFlawless}
            </Link>
            <Link className="button outline-ink" href={`${legacyHref}#compare`}>
              Compare Legacy and Flawless
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
