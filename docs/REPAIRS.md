# Repair log

Use this changelog for defects corrected after development begins.

## Home, product, and cart now lead with the $1,000 look and a safe $500 path

- **Date:** 2026-10-30
- **Area:** Home, product, cart, header
- **Symptom:** The site advertised incentives but still asked for a single chain with no path to a $1,000 order.
- **Fix:** Hero and home cards offer Flawless pay later or the three-length Legacy kit. Product pages can add the kit or pay later on one chain. Cart shows progress to $500 free US shipping and the $1,000 look without shaming a smaller bag.
- **Verification:** Format, lint, typecheck, tests, and build pass. Browser and localhost checks skipped at owner request.
- **Release or commit:** $1,000 look conversion commit.

## $1,000 incentives and conversion banners are on the storefront

- **Date:** 2026-10-30
- **Area:** Policies, home, product, cart, announcement
- **Symptom:** The store still said it did not ship internationally, and the $1,000 gift necklace and 5-year care were not published.
- **Fix:** Shared commerce now ships internationally with free shipping at $1,000, keeps US free shipping at $500, includes a free Legacy necklace on US orders of $1,000 or more, and covers replacements, cleaning, and repair for 5 years. Announcement, header strip, home cards, product notes, and cart notes advertise those offers only.
- **Verification:** Commerce policy tests, web policy tests, and incentive banner tests. Shopify Admin still needs a fulfillment process for the US gift necklace.
- **Release or commit:** $1,000 look conversion commit.

## Return and shipping policies are published; shipping is distance from Richmond

- **Date:** 2026-10-30
- **Area:** Policy pages and Shopify shipping
- **Symptom:** Policy routes still said they were unpublished. Checkout used generic US shipping instead of a Richmond-distance rate.
- **Fix:** Shared `storePolicies` and `SHIPPING_ZONES` now render on `/policies/*`. Returns are 15 days with inspection. Failed inspection keeps the chain and pays a partial refund. Shopify US rates start at $10 near Richmond and rise by state distance, not weight. Orders of $500 or more ship free.
- **Verification:** Commerce and web policy tests. Shopify Admin shipping profile after the zone rates are saved.

## Shopify Payments is live so checkout can take cards and payouts

- **Date:** 2026-10-30
- **Area:** Shopify checkout and payouts
- **Reported behavior:** Shopify emailed that sales could be halted. The storefront showed prices but checkout had no card brands.
- **Root cause:** Shopify Payments setup was incomplete. The Next.js cart already redirected to Shopify `checkoutUrl`; it could not invent a processor.
- **Repair:** The owner finished Shopify Payments and payouts in Admin. Storefront now reports Visa, Mastercard, American Express, Discover, Diners Club, Shop Pay, Apple Pay, and Google Pay. Shop Pay installments are on. Checkout stays on Shopify.
- **Verification:** `meta.json` `shopify_pay_enabled_card_brands` is populated and `offers_shop_pay_installments` is true. Storefront `acceptedCardBrands` matches. `https://www.legacybytp.com/api/catalog-status` is `live` for Legacy and Flawless.
- **Release or commit:** Shopify Payments live docs commit.

## Shopify Admin apex DNS saved; www stays the public hostname until the zone publishes

- **Date:** 2026-10-28
- **Area:** Apex `legacybytp.com` DNS
- **Reported behavior:** After Admin DNS edits, no-www still sent visitors to the Shopify shop.
- **Root cause:** Shopify Admin can show apex `@` → `216.198.79.1` and no AAAA while Google Cloud nameservers still answer Shopify `A 23.227.38.36` and `AAAA 2620:127:f00f:4::`.
- **Repair:** Record the Admin-side cutover: A `@` `216.198.79.1`, AAAA removed, `www` CNAME to Vercel, `account` left on Shopify. Vercel verify reports `legacybytp.com` configured correctly by A and `www` already serves Next.js with live prices. Do not switch nameservers. Keep sharing `https://www.legacybytp.com` until public NS answers Vercel IPs and apex 308s to www.
- **Verification:** `npx vercel domains verify legacybytp.com` → `configured_correctly`, `aValues: 216.198.79.1`. `nslookup` against `ns-cloud-d1` / `8.8.8.8` still `23.227.38.36`. `https://legacybytp.com/` still 301s to `https://rcvvv5-tk.myshopify.com/`. `https://www.legacybytp.com/` remains `server: Vercel`.
- **Release or commit:** Apex Admin DNS docs commit.

## www.legacybytp.com now serves the Vercel storefront with live prices

- **Date:** 2026-10-28
- **Area:** Custom domain DNS and catalog visibility
- **Reported behavior:** The purchased domain showed Shopify's theme, and collection cards said "Price set at launch."
- **Root cause:** `www` still CNAMEd to Shopify, products were unpublished, and the Shopify DNS editor can show Vercel A records that the Google Cloud zone has not published yet.
- **Repair:** `www.legacybytp.com` CNAMEs to Vercel and returns Next.js (`TRUE POINTERS`, live Legacy/Flawless prices). Canonical origin and indexing already pointed at www. Apex `legacybytp.com` is attached on Vercel with a 308 to www; the published zone still has Shopify `A 23.227.38.36` and a Shopify AAAA, so the no-www URL can keep redirecting to `rcvvv5-tk.myshopify.com` until that zone updates. `account.legacybytp.com` stays on Shopify customer accounts.
- **Verification:** `https://www.legacybytp.com/` `server: Vercel`, `x-powered-by: Next.js`, catalog-status `{"state":"live","legacy":true,"flawless":true}`, prices `$329` / `$979`. Authoritative NS still answer apex `A 23.227.38.36`.
- **Release or commit:** Custom-domain live docs commit.

## Public origin and indexing prepared for www.legacybytp.com

- **Date:** 2026-10-28
- **Area:** Web storefront canonical host, robots, and catalog visibility
- **Reported behavior:** The Next.js shop on Vercel used the apex as its canonical origin and told crawlers not to index. `www.legacybytp.com` still showed Shopify's Liquid store. Collection cards said "Price set at launch" because Shopify returned no published products.
- **Root cause:** Launch-privacy noindex was still on. Live DNS for the purchased domain still points at Shopify (`A 23.227.38.36`, `www` CNAME `shops.myshopify.com`) on Shopify's Google Cloud nameservers, so Vercel's www assignment and apex 308 cannot take effect yet. Storefront API tokenless access sees the shop but an empty product list.
- **Repair:** Canonical public origin is now `https://www.legacybytp.com`. `robots.txt` and metadata allow indexing. Apex `legacybytp.com` remains the trusted checkout host and is already set on Vercel to 308 to www. Prices are not invented; they appear only after Shopify products are Active and published to the Headless/Storefront channel. Authoritative DNS still has to be edited in Shopify Admin.
- **Verification:** Lint, typecheck, and origin/robots tests. `https://truepointerslegacy.vercel.app/` returns Next.js (`TRUE POINTERS`, `server: Vercel`). Live `https://www.legacybytp.com/` still returns Shopify Liquid until DNS is changed.
- **Release or commit:** Public www origin and indexing commit.

## Product-page Legacy and Flawless clips were reversed

- **Date:** 2026-10-28
- **Area:** Legacy product gallery and Flawless upgrade box
- **Reported behavior:** On the live product page the gallery beside Legacy Tennis Chain played the colorful sparkle necklace, and the Flawless ice-ticket played the flatter necklace.
- **Root cause:** The home-page slot swap left `legacy-gallery` and `upgrade-panel` on the opposite clips. Those two slots drive the product page; Shopify had no videos on the Flawless product, so the local map was what customers saw.
- **Repair:** `legacy-gallery` now uses the flatter Legacy clip (`legacy-chain-5.mp4`, same as `home-hero`). `upgrade-panel`, `flawless-gallery`, and `pay-later` use the sparkle clip (`legacy-tennis-chain.mp4`). Home `home-hero` / `flawless-band` stayed as they were. Files were not renamed.
- **Verification:** Local-media slot test, product-experience gallery vs panel sources, and media-panel clip test.
- **Release or commit:** Product-page clip swap commit.

## Home Legacy and Flawless clips were reversed

- **Date:** 2026-10-28
- **Area:** Home hero and Flawless band
- **Reported behavior:** The necklace in the Flawless card was the clip that belonged on Legacy, and the other way around.
- **Root cause:** Local preview slots were assigned without the owner naming which file sat in which card.
- **Repair:** `home-hero` and `flawless-band` swapped files. The mp4s stayed put; only the slot map changed, so Shopify media still wins when it exists.
- **Verification:** Local-media slot test and a home-page check that both players are muted and sourced correctly.
- **Release or commit:** Home clip swap commit.

## Flawless box read as a second Legacy card

- **Date:** 2026-10-28
- **Area:** Legacy product page upgrade box and `/flawless`
- **Reported behavior:** After the pay-later path landed, Flawless looked like a duplicate Legacy buy box with a pay-later line.
- **Root cause:** The box reused the white product-card treatment and the Flawless page kept the Legacy tennis-chain heading pattern.
- **Repair:** Flawless now sits on the ice side of the same palette: an upgrade ticket marked FLAWLESS, "the one they ask for," and a HARDER ICE plate on the pay-later page. Pay later stays a quiet checkout note.
- **Verification:** Panel and product-experience tests.
- **Release or commit:** Flawless ice-ticket commit.

## Flawless Upgrade box did not sell pay later

- **Date:** 2026-10-28
- **Area:** Legacy product page and new `/flawless` route
- **Reported behavior:** The Flawless Upgrade box only expanded in place and had no buy-now-pay-later path.
- **Root cause:** The panel was a local toggle, not a shop for Flawless, and payments only existed as a generic Shopify checkout redirect.
- **Repair:** The box now says "Flawless shine. Every wear." with a quiet Shop Pay / Klarna / Afterpay line and links to `/flawless`. That page plays a necklace video and lets the customer add Flawless to cart or continue to Shopify checkout, where pay-later methods appear if the store has them on.
- **Verification:** Panel, product-experience, and commerce tests.
- **Release or commit:** Flawless pay-later page commit.

## Stone names and a nine-ways headline sat on the shop

- **Date:** 2026-10-28
- **Area:** Home collection, product page, and Flawless window
- **Reported behavior:** The shop said "Nine ways to wear it" and printed cubic zirconia and moissanite in product details.
- **Root cause:** The collection used a catalog headline, and the storefront dumped Shopify material lines onto the page.
- **Repair:** "The Legacy Collection" now sits over the 3-size / 3-length line with one short story. Public copy sells shine, craft, and a replace promise. Shopify fill names stay off the page.
- **Verification:** Commerce and product-experience tests for banned stone language.
- **Release or commit:** Public shine-copy commit.

## Hero still used the old era motto

- **Date:** 2026-10-27
- **Area:** Web hero motto and tape
- **Reported behavior:** The phone hero still read "A Legacy. The era that left a mark."
- **Root cause:** That line was still the shared marketing motto.
- **Repair:** The motto and tape now say "Hits Last Forever."
- **Verification:** Motto and commerce copy tests.
- **Release or commit:** Hits Last Forever motto commit.

## Footer still used the old era line

- **Date:** 2026-10-27
- **Area:** Web footer
- **Reported behavior:** The footer under TRUE POINTERS read "A Legacy. The era that left a mark."
- **Root cause:** That line was left over from the first motto pass.
- **Repair:** The footer now says "Hits that leave a mark."
- **Verification:** Footer test.
- **Release or commit:** Footer copy commit.

## Storefront read as a centered catalog template

- **Date:** 2026-10-27
- **Area:** Web storefront layout on phone and desktop
- **Reported behavior:** The shop felt generic: everything sat dead-center in a textbook two- and three-column grid, especially on a phone-sized screen.
- **Root cause:** The first visual pass copied a standard jewelry catalog: centered wordmark, centered collection copy, and equal product tiles.
- **Repair:** The masthead sits off-center with the cart on its own control. Collection cards use a staggered lookbook with mixed sizes and slight rotation. Hero, fit guide, Flawless band, and footer follow that uneven composition, with safe-area padding for phones.
- **Verification:** Collection and header tests plus format, lint, typecheck, and a desktop and mobile browser pass.
- **Release or commit:** Editorial lookbook layout commit.

## Entry template

- **Date:**
- **Area:**
- **Reported behavior:**
- **Root cause:**
- **Repair:**
- **Verification:**
- **Release or commit:**

## Vercel Next.js deploy could not see the storefront

- **Date:** 2026-10-27
- **Area:** Production deploy
- **Reported behavior:** Importing the GitHub repo into Vercel failed the build. `legacybytp.com` still showed Shopify's generic store.
- **Root cause:** The Vercel project Root Directory is the repository root and the preset is Next.js. The App Router lives in `apps/web`, so the builder looked for `app/` and `.next` at the repo root and did not find them.
- **Repair:** Install now runs `scripts/prepare-vercel-next.mjs`, which stages `apps/web` `src` and `public` at the repo root so `next build` matches the Vercel Next.js preset. Shopify stays the catalog and checkout host.
- **Verification:** Local `npm ci && node scripts/prepare-vercel-next.mjs && next build`.
- **Release or commit:** Vercel root-build staging commit.

## Necklace videos spun on a black loading loop

- **Date:** 2026-10-27
- **Area:** Home, collection grid, product gallery, and Flawless Upgrade panel
- **Reported behavior:** The Legacy jewelry video showed a black screen and a spinning loader instead of frames. Other clips on the page did the same.
- **Root cause:** Eleven players asked the browser for metadata at once. `play()` also ran on every in-view card, so the files queued and never reached a first frame.
- **Repair:** Grid clips use `preload="none"` and only the on-screen clip plays, muted. The hero and product gallery load one eager player with controls. Off-screen clips pause. Shopify media still replaces local files when present.
- **Verification:** Format, lint, typecheck, tests, and a browser pass on localhost.
- **Release or commit:** Video playback and public host commit.

## Localhost branding instead of the purchased domain

- **Date:** 2026-10-27
- **Area:** Web storefront metadata, footer, env example, and docs
- **Reported behavior:** After buying a custom domain in Shopify, the project still read as localhost and used the myshopify shop hostname as if it were the public site.
- **Root cause:** Customer-facing URLs were never set because the Next.js app has no production host yet.
- **Repair:** Public URLs now use `https://legacybytp.com`. Shopify API calls stay on `rcvvv5-tk.myshopify.com`. Checkout URLs on the custom domain are trusted. Footer and docs name the purchased hostname.
- **Verification:** Format, lint, typecheck, and tests for the public site origin and trusted checkout hosts.
- **Release or commit:** Custom domain and preview media commit.

## Placeholders across the storefront instead of necklace footage

- **Date:** 2026-10-27
- **Area:** Home, collection grid, product pages, Flawless Upgrade panel, and cart
- **Reported behavior:** Only one local clip was wired, so most product slots still showed empty placeholders.
- **Root cause:** The storefront had a single fallback video and Shopify still returns no published media.
- **Repair:** All five owner videos are in `apps/web/public/media`. A fixed assignment puts a clip on the home hero, Flawless band, nine collection cards, both product galleries, the Flawless Upgrade panel, and cart lines that have no Shopify image. Shopify media still wins. Clips are muted and labeled as representative footage.
- **Verification:** Format, lint, typecheck, and tests for the local media pool, collection grid, preview player, and product experience.
- **Release or commit:** Uncommitted site-wide preview media work.

## Placeholder shown instead of the Legacy product video

- **Date:** 2026-10-27
- **Area:** Web product gallery and Flawless Upgrade panel
- **Reported behavior:** The owner's Legacy chain video sat on a laptop, and the Legacy image box and Flawless Upgrade panel showed placeholders.
- **Root cause:** The site only played videos returned by the Shopify Storefront API, and the products are still unpublished drafts.
- **Repair:** The owner's video is served from `apps/web/public/media/legacy-tennis-chain.mp4`. It plays muted, with controls and no autoplay, in the Legacy image box and the Flawless Upgrade panel. A Shopify product video replaces it once one is uploaded and published.
- **Verification:** Format, lint, typecheck, tests, and build pass. Checked in the browser.
- **Release or commit:** Local Legacy video commit.

## Hydration mismatch in local development

- **Date:** 2026-10-27
- **Area:** Web storefront, development only
- **Reported behavior:** React reported a hydration mismatch on the policy page heading.
- **Root cause:** The Cursor browser injected `data-cursor-ref` attributes into the server HTML before React hydrated. The server output was clean.
- **Repair:** A development-only inline script removes those attributes before hydration. Production builds do not include it.
- **Verification:** The policy and product pages load in the Cursor browser without hydration errors.
- **Release or commit:** Storefront redesign commit.

## Naming, voice, and fit guide revisions

- **Date:** 2026-10-27
- **Area:** Web storefront copy and product page
- **Reported behavior:** "Explore Flawless" did not land as an upgrade. The product heading repeated "True Pointers Legacy Extended Tennis Chain". The motto and copy read as generic and machine-written. The comparison table felt like a widget, not a guide.
- **Root cause:** The first copy pass used placeholder brand language and showed the Shopify product title as the heading.
- **Repair:** The heading is now "Legacy Tennis Chain", with the extended silhouette described in the body copy. "Flawless Upgrade" replaces "Explore Flawless", and the header navigation reads "Legacy". The motto is now "A Legacy. The era that left a mark." with an animated ice shimmer and sparkles. The copy uses a streetwear voice. Varsity tape strips, a stitched TP patch, and outlined backdrop lettering were added. A to-scale torso fit guide replaces the comparison table.
- **Verification:** Format, lint, typecheck, tests, and build pass. Checked in the browser.
- **Release or commit:** Storefront voice and fit guide commit.

## Flat, unsaturated storefront presentation

- **Date:** 2026-10-27
- **Area:** Web storefront visual design
- **Reported behavior:** The site did not read as hip-hop luxury jewelry, the colors lacked saturation, and the type looked like presentation slides.
- **Root cause:** The first build used a soft pastel treatment and serif display type.
- **Repair:** The site has a new type system, saturated signal colors, a scrolling announcement bar, a centered wordmark header, a red hero, ring shortcuts, a nine-configuration Legacy collection grid that uses Shopify prices, a Flawless band, and a restyled product page, cart, and footer. See ADR-006 and ADR-007.
- **Verification:** Format, lint, typecheck, tests, and build pass. Checked in the browser at desktop and phone widths.
- **Release or commit:** Storefront redesign commit.
