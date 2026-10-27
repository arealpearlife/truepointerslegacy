# Agent instructions

## Scope

- Keep business rules separate from UI and payment-provider integrations.
- Use TypeScript for application code.
- Keep the web build compatible with a future Capacitor iOS wrapper.
- Add or update tests with each behavior change.
- Record user-visible repairs in `docs/REPAIRS.md`.
- Record durable technical decisions in `docs/DECISIONS.md`.

## Security

- Never commit customer records, credentials, payment data, API keys, certificates, or signing profiles.
- Use synthetic fixtures in tests and documentation.
- Do not store raw card data. Payment handling must use a PCI-compliant provider and tokenized SDK.
- Treat `data/customers/` and `private/` as local-only locations.

## Verification

Before considering a change complete, run the repository's formatting, lint, test, type-check, and build scripts once those scripts exist.
