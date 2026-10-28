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
- **Decision:** The web storefront reads the Storefront API version `2026-10` for the `rcvvv5-tk.myshopify.com` shop. Tokens stay server-side. Cart creation and checkout use Shopify `checkoutUrl`. Browser code may display a price only after Shopify returns that variant.
- **Consequence:** Approved price matrices are audit checks, not a second price authority. Missing credentials, draft products, and unavailable variants cannot be purchased.

### ADR-006: Storefront typography

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Use a streetwear-luxury type system through `next/font`: Anton for poster headlines and prices, Tenor Sans for uppercase section headings, and Lato with wide tracking for navigation and body text. All three are SIL Open Font License families. This replaces Fraunces and Source Sans 3, which read as generic presentation type.
- **Consequence:** These fonts remain until a licensed brand typeface is supplied.

### ADR-007: Saturated signal colors

- **Status:** accepted
- **Date:** 2026-10-27
- **Decision:** Keep the seven approved palette values unchanged and add derived signal tokens in `@truepointers/tokens` so red and blue read loudly on screen: Cherry Signal `#E5002B`, Ice Signal `#00B4FF`, Ice Glow `#6FD8FF`, Deep Blood `#4A0414`, and Ink `#14060A` for text. The layout follows familiar hip-hop jewelry storefront patterns (announcement marquee, centered wordmark, ring shortcuts, product tile grid), but uses red and ice-blue bands on a bright base instead of a black theme.
- **Consequence:** Text on Ice Signal must use Ink, and white text is allowed on Cherry Signal and Deep Blood. A token test enforces at least 4.5:1 contrast for those pairings.

## Open decisions

- Initial iOS/Android release sequence
- Customer-account requirements for the first release
- Hosting, analytics, monitoring, and approved media providers
- Inventory, SKUs, weights, genuine media, policies, and fulfillment rules
