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

### ADR-013: Buy now, pay later stays on Shopify checkout

- **Status:** accepted
- **Date:** 2026-10-28
- **Context:** The Flawless Upgrade box needed a pay-later path without adding a custom payment processor.
- **Decision:** The storefront shows Shop Pay, Klarna, and Afterpay as checkout options. Customers still pay on Shopify `checkoutUrl`. Enable those methods in Shopify Admin → Settings → Payments. The `/flawless` page is the buy-now-pay-later shop for Flawless.
- **Alternatives:** A first-party Klarna or Afterpay SDK on the Next.js site.
- **Consequence:** If the shop has not turned those methods on, the labels still appear and checkout only shows what Shopify actually offers.

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
- **Consequence:** `www` CNAME `f065d95d9ec4dd3e.vercel-dns-017.com` is live and serves Next.js. Shopify Admin DNS can display a Vercel A for `@` while the published zone still has Shopify `A 23.227.38.36` and a Shopify AAAA; the no-www hostname then stays on Shopify until those records actually publish. Local development remains `http://localhost:3000`. This development store is a non-transferable developer preview.

## Open decisions

- Initial iOS/Android release sequence
- Customer-account requirements for the first release
- Hosting, analytics, monitoring, and approved media providers
- Inventory, SKUs, weights, genuine media, policies, and fulfillment rules
