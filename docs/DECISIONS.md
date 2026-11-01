# Architecture decisions

Record decisions here before they become expensive to reverse.

## Template

### ADR-000: Decision title

- **Status:** proposed | accepted | superseded
- **Date:** YYYY-MM-DD
- **Context:** What problem or constraint requires a decision?
- **Decision:** What was selected?
- **Alternatives:** What else was considered?
- **Consequences:** What becomes easier, harder, or more costly?

## Accepted decisions

### ADR-020: The house gets colder after ten seconds of shopping

- **Status:** accepted
- **Date:** 2026-10-31
- **Context:** The storefront needed a premium climate that rewards time on site without hiding the jewelry.
- **Decision:** After 10 seconds, frost climbs from the edges and a Tray temp widget drops from 16°C to −8°C over the next 50 seconds. As `--ice-depth` rises, store type, prices, and accents mix from cherry/ink into readable ice blues (`#0077b3` prices, `#0a3a52` body, `#006890` notes). Surfaces cool to match. Overlays are pointer-events none and never sit on product media. The start time lives in sessionStorage, so closing the shop clears the cold. Reduced motion turns the climate off.
- **Alternatives:** A full-screen freeze, or frosting the product cards themselves.
- **Consequence:** Keep `--ice-depth` on the document element only. Do not blur or dim `.price`, `.card-price`, or product media. Alerts and primary checkout CTAs stay cherry so the sale remains clear.

### ADR-019: Ice atmosphere instead of slogan beats

- **Status:** accepted
- **Date:** 2026-10-31
- **Context:** A “FLASH. SELF LOVE. THE ICE.” line read as a slogan. The house needed premium atmosphere.
- **Decision:** Remove that line. A looping, pointer-events-none flurry lives on every page. A frost splash plays on client route change and never blocks a tap. Reduced motion turns both off.
- **Alternatives:** Keep the slogan, or a blocking loading screen.
- **Consequence:** Navigation still uses Next.js links. Checkout stays on Shopify. The flurry must stay decorative.

### ADR-018: Desire at every move, never an interrupt

- **Status:** accepted
- **Date:** 2026-10-31
- **Context:** Conversion scales when the storefront sells wanting the ice, not when it explains deals. Interruptions on the product and cart kill the sale.
- **Decision:** Ten storefront moves, all live: (1) ice vitrine light across the house, (2) scroll reveals that discover jewelry, (3) light-catch on hover and tap, (4) desire navigation — The Chain, The Set, The Drop, Flawless, Tray, (5) short desire beats between sections, (6) selection and price as ritual, (7) fit as how it hits on you, (8) house courtesy stays off product and cart, (9) cart as the tray before checkout, (10) ice motion that stills when the visitor prefers reduced motion. No fake scarcity, no countdown, no invented discount, no deal cards over the jewelry.
- **Alternatives:** Popups on every page, or a louder $1,000 look lecture.
- **Consequence:** Home is the only courtesy popup. Checkout stays on Shopify. Public copy stays inside the banned-language scanner.

### ADR-001: Commerce authority

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Shopify is the single authority for catalog, variants, prices, inventory, checkout, orders, discounts, refunds, and fulfillment. Shopify Admin is the default private management experience.
- **Consequence:** No duplicate commerce database or unnecessary custom administration system will be created.

### ADR-002: Web and mobile applications

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Use a Next.js storefront for the web and a separate Expo/React Native storefront for native mobile.
- **Alternatives:** The interrupted Vite/Capacitor experiment was rejected because it would wrap the website rather than provide the approved native application architecture.
- **Consequence:** Web and native interfaces remain platform-specific while sharing safe TypeScript domain packages.

### ADR-003: Repository organization

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Use npm workspaces with `apps/web`, `apps/mobile`, and focused shared packages. Do not add a monorepo task runner until repository scale justifies it.

### ADR-004: Mobile delivery

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Use Expo Application Services for native builds, store submission, and compatible JavaScript/asset updates. Native dependency, entitlement, or permission changes require a new store binary.

### ADR-005: Storefront sales integration

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** The web storefront reads the Storefront API version `2026-10` for the `rcvvv5-tk.myshopify.com` shop. Tokens stay server-side. Cart creation and checkout use Shopify `checkoutUrl`. Browser code may display a price only after Shopify returns that variant. The customer-facing origin is `https://www.legacybytp.com`; see ADR-010.
- **Consequence:** Approved price matrices are audit checks, not a second price authority. Missing credentials, draft products, and unavailable variants cannot be purchased.

### ADR-006: Storefront typography

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Use a streetwear-luxury type system through `next/font`: Anton for poster headlines and prices, Tenor Sans for uppercase section headings, Graduate for varsity-style patches, tape strips, and shortcut numbers, and Lato with wide tracking for navigation and body text. All three are SIL Open Font License families. This replaces Fraunces and Source Sans 3, which read as generic presentation type.
- **Consequence:** These fonts remain until a licensed brand typeface is supplied.

### ADR-007: Saturated signal colors

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Keep the seven approved palette values unchanged and add derived signal tokens in `@truepointers/tokens` so red and blue read loudly on screen: Cherry Signal `#E5002B`, Ice Signal `#00B4FF`, Ice Glow `#6FD8FF`, Deep Blood `#4A0414`, and Ink `#14060A` for text. The layout still uses jewelry-storefront signals (announcement marquee, wordmark, ring shortcuts, product tiles) on a bright red and ice-blue base, but the composition is editorial rather than a centered catalog. See ADR-011.
- **Consequence:** Text on Ice Signal must use Ink, and white text is allowed on Cherry Signal and Deep Blood. A token test enforces at least 4.5:1 contrast for those pairings.

### ADR-008: Fit guide replaces the comparison table

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** The product page and landing page show a to-scale male torso fit guide instead of a Legacy and Flawless comparison table. Dotted chains show where 40, 44, and 48 inch lengths land, with drops of about 13, 15, and 17 inches below the neck notch on a 5'10" frame with a 15.5 inch neck. The guide follows the selected length, and selecting a length in the guide updates the purchase selection. "Explore Flawless" is now called "Flawless Upgrade". The Flawless window still never changes the variant or adds to the cart.
- **Consequence:** Public copy never names cubic zirconia or moissanite. Update the drop values if True Pointers measures the finished chains on a fit model. See ADR-012.

### ADR-009: Local preview media until Shopify publishes genuine shots

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Serve a small pool of the owner's laptop videos from `apps/web/public/media` so every storefront slot shows a necklace while Shopify products are still drafts. Assignment is a fixed shuffle, not `Math.random` at render, so server and client stay in sync. Shopify images and videos replace the local clips the moment they exist. Decorative grid and hero clips play muted and only while on screen; they stay still when the visitor prefers reduced motion. Cards that are a specific stone and length caption the clip as representative footage.
- **Consequence:** These files are stand-ins. After each configuration has its own Shopify media, remove the local copies from the public folder and keep Shopify as the only media source.

### ADR-011: Editorial lookbook instead of a textbook grid

- **Status:** accepted
- **Date:** 2026-10-27
- **Context:** The first storefront pass was readable but sat too perfectly centered, so phone and desktop both felt like a generic catalog template.
- **Decision:** Compose the public site as a lookbook: off-center masthead, left-weighted copy, staggered collection cards with mixed aspect ratios, and slight static rotation. On a phone, the first, fourth, and ninth cards take a wider slot and the rest sit in an uneven pair. Safe-area insets and `viewport-fit=cover` are for the mobile web display, not a substitute for the later Expo app.
- **Alternatives:** A uniform 2-up / 3-up catalog grid, or a horizontal snap carousel of identical tiles.
- **Consequence:** Card hover scale stays small so the stagger remains readable. Reduced-motion visitors still see the static offsets because those are layout, not animation.

### ADR-017: Jewelry leads; house courtesies arrive as a surprise

- **Status:** accepted
- **Date:** 2026-10-31
- **Context:** Deal cards and “$1,000 look” copy pushed explanation ahead of the chains and sounded cheap.
- **Decision:** The storefront shows the jewelry first. Privileges are a thin announcement, a delayed courtesy popup, and a rotating side rail — not page-length cards. Orders of $500 or more include five years of replacements, cleaning, and repair. Orders of $1,000 or more include a complimentary Legacy chain of the customer’s choosing. The three-length add is the Legacy set, a package that leaves them with more ice, not a look to brag about. No invented set discount. Pay later stays on Shopify checkout.
- **Alternatives:** Keep the conversion cards, or publish a $1,000 look headline.
- **Consequence:** Home no longer stacks incentive cards above the collection. Shipping rates stay in policy pages. The gift chain is fulfilled after checkout when the customer names the size and length; it is not a published SKU.

### ADR-016: $1,000 is the look; $500 stays a safe one-chain buy

- **Status:** superseded
- **Date:** 2026-10-30
- **Context:** The owner wants average orders at $1,000 (one Flawless or three Legacy lengths) and wants pay later used to get there, without scaring off a $500 sale.
- **Decision:** Superseded by ADR-017. Do not call a $1,000 order a look, and do not explain that one chain is still a full chain.
- **Alternatives:** Hide the $500 path, force a Shopify bundle SKU, or invent installment math on the site.
- **Consequence:** See ADR-017.

### ADR-015: $1,000 international shipping, US gift necklace, and 5-year care

- **Status:** accepted
- **Date:** 2026-10-30
- **Context:** The owner added order incentives after US $500 free shipping was already live.
- **Decision:** Keep US free shipping at $500. International orders of $1,000 or more ship free. Orders of $1,000 or more include a complimentary Legacy chain of the customer’s choice. Orders of $500 or more include replacements, cleaning, and repair for 5 years from delivery. The site advertises only these real offers. Shopify checkout must apply the shipping thresholds; the gift chain is fulfilled after the customer names size and length, and is not a published SKU.
- **Alternatives:** Replace the $500 US threshold with $1,000, or invent a specific gift variant.
- **Consequence:** Policy pages, announcement copy, and conversion banners share the same commerce constants. Do not publish a “90% more conversions” claim.

### ADR-014: Returns inspect in 15 days; shipping is distance from Richmond

- **Status:** accepted
- **Date:** 2026-10-30
- **Context:** The owner set the return and shipping rules. Shopify has no native “miles from Richmond” rate. All chains weigh the same.
- **Decision:** A return must start within 15 days of delivery. If the chain passes inspection, refund the item price. If it fails inspection or cannot be sold again, True Pointers keeps the chain and issues a partial refund after inspection. US shipping uses flat Shopify rates by state distance from Richmond, VA, starting at $10. Weight is not used. US orders of $500 or more ship free. International orders of $1,000 or more ship free.
- **Alternatives:** One US flat rate, carrier-calculated weight rates, or a custom distance app.
- **Consequence:** Next.js policy pages and Shopify legal/shipping must stay in sync. Partial refund amounts are set after inspection, not as a published percentage.

### ADR-013: Buy now, pay later stays on Shopify checkout

- **Status:** accepted
- **Date:** 2026-10-28
- **Context:** The Flawless Upgrade box needed a pay-later path without adding a custom payment processor.
- **Decision:** The storefront shows Shop Pay, Klarna, and Afterpay as checkout options. Customers still pay on Shopify `checkoutUrl`. Enable those methods in Shopify Admin → Settings → Payments. The `/flawless` page is the buy-now-pay-later shop for Flawless.
- **Alternatives:** A first-party Klarna or Afterpay SDK on the Next.js site.
- **Consequence:** Checkout only shows methods Shopify actually offers. Shop Pay and Shop Pay installments are on; Klarna and Afterpay still appear on the storefront only if the owner enables them in Payments.

### ADR-012: No stone chemistry on the public storefront

- **Status:** accepted
- **Date:** 2026-10-28
- **Context:** Naming the fill on the product page and in the Flawless window ("cubic zirconia", "moissanite") made the shop sound like a spec sheet and broke the sales story.
- **Decision:** Customer-facing copy describes VVS shine, flawless clarity shine, hand-set stones, the extra-long custom mold, daily wear, and a replace-if-the-ice-fails promise. Flawless may add that it passes the diamond tester. The collection story is told once. Shopify can still store the real material internally.
- **Alternatives:** Keep a required material disclosure on every product page.
- **Consequence:** If Shopify returns a description that names the fill, the storefront replaces it with the public shine copy and does not put that description into JSON-LD.

### ADR-010: Public hostname vs Shopify shop hostname

- **Status:** accepted
- **Date:** 2026-10-28
- **Context:** `legacybytp.com` was purchased through Shopify/Tucows. The public site is the Next.js storefront on Vercel project `truepointerslegacy` (team `tp-0f39`), not the Shopify Online Store theme. Authoritative DNS stays on Shopify-managed Google Cloud nameservers (`ns-cloud-d1` through `d4.googledomains.com`).
- **Decision:** Use `https://www.legacybytp.com` as the customer-facing origin for metadata, canonical URLs, env examples, and docs. On Vercel, apex `legacybytp.com` 308-redirects to `www.legacybytp.com` once the published apex records are Vercel's. Keep `rcvvv5-tk.myshopify.com` as the Storefront API host and Shopify as checkout authority. Trust checkout URLs on the shop hostname, `legacybytp.com`, `www.legacybytp.com`, `checkout.legacybytp.com`, and `checkout.shopify.com`. Keep `account.legacybytp.com` on Shopify customer accounts. Do not move nameservers to Vercel unless MX and the account CNAME are copied first.
- **Consequence:** `www` CNAME `f065d95d9ec4dd3e.vercel-dns-017.com` is live and serves Next.js. Shopify Admin DNS lists apex `@` as Vercel `216.198.79.1` with AAAA removed; Vercel verify reports `legacybytp.com` configured correctly by A. The Google Cloud zone can still answer Shopify `A 23.227.38.36` and `AAAA 2620:127:f00f:4::` until it publishes, so visitors to the no-www hostname may still land on `rcvvv5-tk.myshopify.com`. Local development remains `http://localhost:3000`. This development store is a non-transferable developer preview.

## Open decisions

- Initial iOS/Android release sequence
- Customer-account requirements for the first release
- Hosting, analytics, monitoring, and approved media providers
- Inventory, SKUs, weights, genuine media, policies, and fulfillment rules
