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
- **Decision:** The web storefront reads the Storefront API version `2026-10` for the `rcvvv5-tk.myshopify.com` shop. Tokens stay server-side. Cart creation and checkout use Shopify `checkoutUrl`. Browser code may display a price only after Shopify returns that variant. The customer-facing hostname is `legacybytp.com`; see ADR-010.
- **Consequence:** Approved price matrices are audit checks, not a second price authority. Missing credentials, draft products, and unavailable variants cannot be purchased.

### ADR-006: Storefront typography

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Use a streetwear-luxury type system through `next/font`: Anton for poster headlines and prices, Tenor Sans for uppercase section headings, Graduate for varsity-style patches, tape strips, and shortcut numbers, and Lato with wide tracking for navigation and body text. All three are SIL Open Font License families. This replaces Fraunces and Source Sans 3, which read as generic presentation type.
- **Consequence:** These fonts remain until a licensed brand typeface is supplied.

### ADR-007: Saturated signal colors

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Keep the seven approved palette values unchanged and add derived signal tokens in `@truepointers/tokens` so red and blue read loudly on screen: Cherry Signal `#E5002B`, Ice Signal `#00B4FF`, Ice Glow `#6FD8FF`, Deep Blood `#4A0414`, and Ink `#14060A` for text. The layout follows familiar hip-hop jewelry storefront patterns (announcement marquee, centered wordmark, ring shortcuts, product tile grid), but uses red and ice-blue bands on a bright base instead of a black theme.
- **Consequence:** Text on Ice Signal must use Ink, and white text is allowed on Cherry Signal and Deep Blood. A token test enforces at least 4.5:1 contrast for those pairings.

### ADR-008: Fit guide replaces the comparison table

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** The product page and landing page show a to-scale male torso fit guide instead of a Legacy and Flawless comparison table. Dotted chains show where 40, 44, and 48 inch lengths land, with drops of about 13, 15, and 17 inches below the neck notch on a 5'10" frame with a 15.5 inch neck. The guide follows the selected length, and selecting a length in the guide updates the purchase selection. "Explore Flawless" is now called "Flawless Upgrade". The Flawless window still never changes the variant or adds to the cart.
- **Consequence:** Stone material disclosures stay in the product details and the Flawless window. Update the drop values if True Pointers measures the finished chains on a fit model.

### ADR-009: Local preview media until Shopify publishes genuine shots

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Serve a small pool of the owner's laptop videos from `apps/web/public/media` so every storefront slot shows a necklace while Shopify products are still drafts. Assignment is a fixed shuffle, not `Math.random` at render, so server and client stay in sync. Shopify images and videos replace the local clips the moment they exist. Decorative grid and hero clips play muted and only while on screen; they stay still when the visitor prefers reduced motion. Cards that are a specific stone and length caption the clip as representative footage.
- **Consequence:** These files are stand-ins. After each configuration has its own Shopify media, remove the local copies from the public folder and keep Shopify as the only media source.

### ADR-010: Public hostname vs Shopify shop hostname

- **Status:** accepted
- **Date:** 2026-10-27
- **Context:** `legacybytp.com` was purchased and connected in Shopify. The public site is a Next.js storefront, not the Shopify Online Store theme.
- **Decision:** Use `https://legacybytp.com` as the customer-facing origin for metadata, canonical URLs, env examples, and docs. Keep `rcvvv5-tk.myshopify.com` as the Storefront API host. Trust checkout URLs on the shop hostname, `legacybytp.com`, `www.legacybytp.com`, `checkout.legacybytp.com`, and `checkout.shopify.com`.
- **Consequence:** Connecting the domain in Shopify does not host the Next.js app. Until that app is deployed, `legacybytp.com` currently serves Shopify's password-protected Online Store. Local development remains `http://localhost:3000`.

## Open decisions

- Initial iOS/Android release sequence
- Customer-account requirements for the first release
- Hosting, analytics, monitoring, and approved media providers
- Inventory, SKUs, weights, genuine media, policies, and fulfillment rules
