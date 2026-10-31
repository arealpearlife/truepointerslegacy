# Legacy

Foundation for the True Pointers Legacy commerce ecosystem.

## Current phase

The web storefront is in `apps/web`. The customer-facing origin is live at `https://www.legacybytp.com` (Vercel Next.js, live Shopify prices). Local development still runs at `http://localhost:3000`. Shopify remains authoritative for price, inventory, checkout, and payouts on `rcvvv5-tk.myshopify.com`. Shopify Payments accepts Visa, Mastercard, American Express, Discover, Shop Pay, Apple Pay, and Google Pay. Shopify Admin DNS lists apex `@` as `216.198.79.1` with no AAAA; Vercel marks `legacybytp.com` verified. Public nameservers can still answer Shopify `A 23.227.38.36` until that zone publishes, so share www for the no-www hostname.

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
