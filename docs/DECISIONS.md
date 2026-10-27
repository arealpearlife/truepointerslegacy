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

## Open decisions

- Shopify development or production store details
- Initial iOS/Android release sequence
- Customer-account requirements for the first release
- Hosting, analytics, monitoring, and approved media providers
- Final catalog, prices, product claims, policies, and fulfillment rules
