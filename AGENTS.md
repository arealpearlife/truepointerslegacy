# Agent instructions

## Scope

- Keep business rules separate from UI and payment-provider integrations.
- Use TypeScript for application code.
- Build the web storefront with Next.js and the native storefront with Expo/React Native.
- Keep Shopify authoritative for products, variants, prices, inventory, checkout, and orders.
- Share contracts, validation, design tokens, and commerce logic; do not force web and native UI into one component library.
- Do not introduce Capacitor, a duplicate catalog, or a custom payment processor.
- Add or update tests with each behavior change.
- Record user-visible repairs in `docs/REPAIRS.md`.
- Record durable technical decisions in `docs/DECISIONS.md`.

## Security

- Never commit customer records, credentials, payment data, API keys, certificates, or signing profiles.
- Use synthetic fixtures in tests and documentation.
- Do not store raw card data. Payment handling must use a PCI-compliant provider and tokenized SDK.
- Never expose Shopify Admin API credentials to either public client.
- Treat `data/customers/` and `private/` as local-only locations.

## Verification

Before considering a change complete, run the repository's formatting, lint, test, type-check, and build scripts once those scripts exist.
