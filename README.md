# Legacy

Foundation for the True Pointers Legacy commerce ecosystem.

## Current phase

The web storefront is in `apps/web`. The customer-facing origin is live at `https://www.legacybytp.com` (Vercel Next.js). Local development still runs at `http://localhost:3000`. Shopify remains authoritative for price, inventory, and checkout on `rcvvv5-tk.myshopify.com`. Bare `https://legacybytp.com` is meant to 308 to www once Shopify's published apex A/AAAA records leave Shopify's IPs; until then share www.

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
