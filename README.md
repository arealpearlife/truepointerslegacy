# Legacy

Foundation for the True Pointers Legacy commerce ecosystem.

## Current phase

The web storefront is in progress in `apps/web`. The customer-facing origin is `https://www.legacybytp.com` (apex `legacybytp.com` is meant to 308 there). Local development still runs at `http://localhost:3000`. Shopify remains authoritative for price, inventory, and checkout on `rcvvv5-tk.myshopify.com`. Unpublished products keep the storefront in an unavailable purchase state until Shopify returns a sellable variant. The Next.js app is deployed on Vercel; the purchased domain still needs Shopify DNS pointed at that project.

## Structure

- `apps/web/` — Next.js public storefront
- `apps/mobile/` — planned Expo/React Native storefront
- `packages/` — planned shared commerce contracts, validation, tokens, and tooling
- `assets/` — approved brand assets and color palettes
- `docs/` — setup, decisions, repairs, pricing, and operating documentation
- `data/customers/` — local customer-data staging; contents are excluded from Git
- `private/` — confidential project material; contents are excluded from Git

Shopify will be the authoritative source for catalog, pricing, inventory, checkout, orders, and business administration.

## Run the web storefront

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` before adding a Storefront API token. Tokenless access is used when no token is present. Prices and checkout still require the products to be active, published to a sales channel, and in stock.

Start with [`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md).
