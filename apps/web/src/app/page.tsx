import Link from "next/link";
import { HANDLES, flawlessStartingOffer, marketing } from "@truepointers/commerce";
import { CollectionGrid } from "@/components/collection-grid";
import { FitGuide } from "@/components/fit-guide";
import { MediaFill } from "@/components/media-fill";
import { Motto } from "@/components/motto";
import { Patch } from "@/components/patch";
import { ShortcutRings } from "@/components/shortcut-rings";
import { Tape } from "@/components/tape";
import { getCatalog } from "@/lib/catalog";
import { displayMedia } from "@/lib/local-media";

const legacyHref = `/products/${HANDLES.legacy}`;

export default async function HomePage() {
  const catalog = await getCatalog();
  const legacy = catalog.state === "live" ? catalog.legacy : null;
  const flawless = catalog.state === "live" ? catalog.flawless : null;
  const offer = flawlessStartingOffer(flawless);
  return (
    <main id="main" className="home">
      <section className="hero">
        <div className="hero-backdrop" aria-hidden="true">
          <span>LEGACY</span>
          <span>LEGACY</span>
          <span>LEGACY</span>
        </div>
        <div className="container hero-inner">
          <div className="hero-copy-block">
            <p className="eyebrow">{marketing.eyebrow}</p>
            <h1 className="hero-title poster">{marketing.heroTitle}</h1>
            <Motto />
            <p className="hero-line ice">{marketing.iceLine}</p>
            <p className="hero-copy">{marketing.heroBody}</p>
            <div className="actions">
              <Link className="button solid-white" href={legacyHref}>
                {marketing.shopLegacy}
              </Link>
              <Link className="button ice" href={`${legacyHref}?explore=flawless`}>
                {marketing.flawlessUpgrade}
              </Link>
            </div>
          </div>
          <div className="hero-visual-wrap">
            <div className="hero-visual">
              <MediaFill
                media={displayMedia(legacy, "home-hero")}
                label={marketing.legacyName}
                sizes="(min-width: 900px) 45vw, 100vw"
                priority
              />
            </div>
            <Patch className="hero-patch" />
          </div>
        </div>
      </section>

      <Tape />
      <ShortcutRings />

      <section className="container collection" aria-labelledby="collection-title">
        <header className="collection-head">
          <p className="eyebrow">The Legacy collection</p>
          <h2 id="collection-title" className="poster">
            Nine ways to wear it
          </h2>
          <p>Three stone sizes. Three drops. Pick your weight, pick your length, and put it on.</p>
        </header>
        <div className="assurance">
          <h3>Checkout through Shopify</h3>
          <p>Prices and stock come live from the store. Shipping and tax are added at checkout.</p>
        </div>
        <div className="toolbar">
          <span>9 configurations</span>
          <Link href={legacyHref}>See the chain</Link>
        </div>
        <CollectionGrid product={legacy} />
      </section>

      <div className="container">
        <FitGuide selected={null} />
      </div>

      <Tape tone="ice" />

      <section className="flawless-band" aria-labelledby="flawless-band-title">
        <div className="container flawless-inner">
          <div>
            <p className="eyebrow">{marketing.flawlessUpgrade}</p>
            <h2 id="flawless-band-title">{marketing.flawlessHeading}</h2>
            <p className="hero-line">{marketing.flawlessLine}</p>
            <p>{marketing.flawlessBody}</p>
            {offer ? <p className="from-price">{marketing.fromPrice}</p> : null}
          </div>
          <div className="flawless-visual">
            <MediaFill
              media={displayMedia(flawless, "flawless-band")}
              label={marketing.flawlessName}
              sizes="(min-width: 900px) 25vw, 100vw"
            />
          </div>
          <div className="actions">
            <Link className="button ink" href={`${legacyHref}?explore=flawless`}>
              {marketing.flawlessUpgrade}
            </Link>
            <Link className="button outline-ink" href={legacyHref}>
              Keep it Legacy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
