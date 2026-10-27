# Legacy

Foundation for the True Pointers Legacy commerce ecosystem.

## Current phase

This repository currently contains the approved architecture, security boundaries, brand tokens, and implementation plan. Storefront and mobile application code have not been generated yet.

## Structure

- `apps/web/` — planned Next.js public storefront
- `apps/mobile/` — planned Expo/React Native storefront
- `packages/` — planned shared commerce contracts, validation, tokens, and tooling
- `assets/` — approved brand assets and color palettes
- `docs/` — setup, decisions, repairs, pricing, and operating documentation
- `data/customers/` — local customer-data staging; contents are excluded from Git
- `private/` — confidential project material; contents are excluded from Git

Shopify will be the authoritative source for catalog, pricing, inventory, checkout, orders, and business administration.

Start with [`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md).
