# Project foundation

## Verified on this HP Windows laptop

- Node.js: `v24.15.0`
- npm: `11.12.1`
- Git: `2.56.0.windows.4` installed at `C:\Program Files\Git\cmd\git.exe`
- GitHub account: connected in Cursor
- GitHub CLI: installation did not complete and is not required once Git remote access is working

Restart Cursor or Windows Terminal if `git` is not found, because the current session did not inherit Git's PATH entry.

## Before application development

### Accounts and decisions

- Confirm the full GitHub owner/repository URL and default branch.
- Define legal business name, locations, tax jurisdictions, currencies, roles, and approval rules.
- Choose a PCI-compliant payment provider and supported card-reader hardware.
- Choose receipt printer, cash drawer, barcode scanner, and supported iPad/iPhone models.
- Decide offline behavior, conflict resolution, backup retention, and disaster recovery.
- Document privacy, refund, return, discount, and employee-access policies.

### Approved technical baseline

- TypeScript with Next.js for the web storefront.
- Expo and React Native for the native mobile storefront.
- npm workspaces with a committed lockfile; use `npm ci` in automated builds.
- Shopify as the authoritative catalog, inventory, checkout, order, and administration system.
- Shared packages for runtime-validated commerce contracts, domain logic, design tokens, analytics contracts, and tooling.
- Shopify-hosted payment capture; never handle raw card numbers.
- Automated formatting, linting, type checking, unit tests, integration tests, and production builds.
- Separate development, test, and production environments.

Web and native user interfaces remain separate. They share safe domain code and connect to the same Shopify records.

### Install or activate

- Git PATH integration (restart the terminal first).
- GitHub remote authentication and branch protection.
- A supported code editor plus ESLint and Prettier extensions.
- Payment-provider sandbox account and test hardware SDK.
- Error reporting, structured logging, uptime monitoring, and encrypted backups.
- CI workflow that runs `npm ci`, lint, type-check, tests, and `npm run build`.
- Secret manager for deployment credentials.

### iOS requirements

Windows can develop the Expo application. EAS can build and submit iOS binaries remotely, but Apple still requires:

- An Apple Developer Program membership
- An approved app identifier and signing credentials
- App Store Connect record, privacy disclosures, screenshots, and review metadata

Some native debugging may still require access to macOS and Xcode. Expo updates may change compatible JavaScript and assets only; native changes require a new binary.

## Required outputs before feature work

1. Approved requirements and glossary.
2. Data classification and retention policy.
3. Architecture and threat model.
4. Payment and hardware proof of concept.
5. Database schema and API contract.
6. Design tokens, accessible color palette, and core component inventory.
7. Test strategy and acceptance criteria.
8. Deployment, backup, rollback, and incident-response runbooks.
9. Pricing and operating-cost estimate.
10. Prioritized implementation backlog.

## Repository readiness gate

Do not begin POS implementation until:

- the GitHub remote is verified;
- secrets and private data are excluded;
- the target hardware and payment provider are selected;
- the iOS build path is available;
- the npm toolchain and CI build are reproducible;
- security, privacy, tax, and receipt requirements are documented.
