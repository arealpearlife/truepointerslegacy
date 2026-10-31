# True Pointers Legacy implementation plan

## Current status

The npm workspace, shared commerce package, and Next.js storefront are in the repository. The public origin `https://www.legacybytp.com` serves the Vercel Next.js shop with live Shopify prices. Shopify Payments is on (cards, Shop Pay, Apple Pay, Google Pay). Shopify Admin DNS now shows apex `@` → `216.198.79.1` and no AAAA; Vercel reports `legacybytp.com` configured correctly by A record. Google Cloud nameservers can still answer Shopify `A 23.227.38.36` and a Shopify AAAA, so bare `legacybytp.com` may keep 301ing to `rcvvv5-tk.myshopify.com` until that zone publishes. Phase 2 is the Expo native storefront in `apps/mobile`, which has not been generated yet.

## Target system

- Shopify Admin: private business management
- Shopify APIs: authoritative commerce data and checkout
- Next.js: public web storefront
- Expo/React Native: native mobile storefront
- Shared TypeScript packages: contracts, validation, domain rules, design tokens, analytics contracts, and tooling

No duplicate catalog, payment system, inventory database, or custom admin will be created unless Shopify fails a documented owner workflow.

## Step-by-step execution

### 1. Create the Shopify development environment

Owner action:

1. Complete Shopify human verification and sign in.
2. Create a development or trial store named **Legacy by True Pointers**.
3. Do not activate a paid production plan, Shopify Payments, or live checkout without owner approval.

Implementation:

1. Enable Shopify's supported headless storefront channel.
2. Select and pin a supported Storefront API version.
3. Create minimum-scope storefront access for web and mobile.
4. Keep Admin API credentials server-side only.
5. Record variable names in `.env.example`; store actual values outside Git.

Gate: A draft test product can be queried without exposing secrets or unpublished production content.

### 2. Establish the monorepo

1. Create npm workspaces.
2. Create `apps/web` with Next.js App Router and strict TypeScript.
3. Create `apps/mobile` with Expo Router and strict TypeScript.
4. Create focused shared packages for commerce, validation, design tokens, analytics contracts, and tooling.
5. Add linting, formatting, type checking, unit tests, and CI.
6. Confirm no server-only dependency can enter the mobile bundle.

Gate: Both applications build independently and consume shared packages safely.

### 3. Define Shopify content and commerce contracts

1. Define normalized Product, Variant, Money, Media, Cart, Content, and CommerceError contracts.
2. Validate Shopify responses at runtime in addition to generated GraphQL types.
3. Implement exact variant resolution for edition, length, and stone size.
4. Return incomplete, invalid, unavailable, or exact-available states; never select the closest variant.
5. Configure editable Shopify metaobjects for announcement, hero, comparison, fit guide, FAQs, story, support, and campaign content.

Gate: Contract tests pass against valid and malformed fixtures.

### 4. Build the design systems

1. Implement the approved palette as semantic tokens.
2. Select and license editorial and body typography.
3. Verify text and control contrast.
4. Build separate accessible web and native primitives.
5. Define loading, empty, unavailable, success, error, focus, touch, and reduced-motion behavior.

Gate: Foundational controls pass web and native accessibility checks.

### 5. Verify the owner management workflow

In Shopify Admin, verify that the owner can:

- create, duplicate, draft, publish, unpublish, and archive products;
- manage options, variants, SKUs, prices, inventory, weight, and SEO;
- upload, reorder, replace, remove, and describe media;
- edit approved storefront content through metaobjects;
- create discounts and review eligibility;
- review orders, payments, fulfillment, tracking, refunds, inventory, and reports.

Gate: Routine management requires no code edit. Build custom administration only for a tested unmet requirement.

### 6. Build one complete web commerce slice

1. Retrieve one published test product.
2. Render verified media and product information.
3. Resolve an exact variant.
4. display Shopify's current price and availability.
5. Add the variant to a real Shopify cart.
6. Update quantity and remove cart lines.
7. Redirect to Shopify test checkout.
8. Handle rejected variants, stale price displays, network errors, and repeated taps.

Gate: An automated browser test reaches Shopify test checkout with the exact selected variant and current price.

### 7. Complete the web storefront

Build the announcement, navigation, hero, gallery, configurator, cart, fit guide, edition comparison, education, FAQs, brand story, policies, support, footer, SEO, structured data, sitemap, robots configuration, and error pages.

Gate: Every visible control has a real outcome and no unapproved claim or policy is published.

### 8. Build the native storefront

1. Implement Expo Router navigation and platform-native screens.
2. Reuse commerce contracts and rules, not web UI components.
3. Implement media, variant selection, cart, network recovery, and app-resume reconciliation.
4. Open Shopify checkout with the supported React Native checkout surface.
5. Configure secure deep links and universal links.
6. Add EAS development, preview, and production profiles.
7. Configure compatible EAS updates with staged release and rollback procedures.

Gate: A development build on a physical device reaches Shopify test checkout with the exact selected variant.

### 9. Add customer accounts only if approved

Use Shopify Customer Account API. Web uses a secure server-managed session; mobile uses authorization code with PKCE and secure token storage. Guest checkout remains available unless the owner approves a different policy.

Gate: Login, cancellation, expiry, refresh, logout, protected routes, and required account deletion work correctly.

### 10. Configure operations

1. Configure real shipping zones, weights, parcels, rates, and fulfillment location.
2. Test Shopify order confirmation, fulfillment, tracking, cancellation, refund, and reporting workflows.
3. Add HMAC-verified, idempotent webhooks only where required.
4. Add consent-aware analytics; purchase revenue comes from verified Shopify records.
5. Add error monitoring and operational runbooks.

Gate: A test order completes paid, fulfilled, tracked, cancelled, and refunded scenarios without duplicate effects.

### 11. Add approved products and production policies

Owner must approve:

- every sellable variant, SKU, price, currency, inventory rule, weight, and material disclosure;
- official logo, product photographs, videos, fit-guide media, and alt text;
- shipping, returns, refunds, privacy, terms, warranty, care, and support content;
- business contact information and brand story;
- payment, shipping, fulfillment, and promotion rules.

Unknown combinations remain unpublished. Supplier costs and internal margin information remain private.

Gate: Catalog and policy approval records are complete before production publication.

### 12. Quality, release, and launch

1. Run unit, integration, web end-to-end, native end-to-end, accessibility, visual, security, and performance tests.
2. Configure web preview, staging, and production environments.
3. Configure TestFlight and the selected Android testing track.
4. Verify domain, HTTPS, privacy disclosures, store metadata, support URL, and account-deletion requirements.
5. Release native updates in controlled stages; never publish production OTA automatically on merge.
6. Complete a production-readiness review using real configuration.

Gate: Production status is reported honestly and requires verified live configuration—not merely successful builds.

## Manual work and external approvals

The owner must personally complete or approve:

- Shopify account verification, plan selection, and Shopify Payments onboarding
- Business identity, tax, banking, and merchant verification
- Apple Developer and Google Play organization enrollment
- Domain purchase or DNS authorization
- Final product catalog and price approval
- Product claims, policies, shipping promises, and legal text
- Official media and brand assets
- Live payment-method activation
- Final production deployment and store submission approvals

Passwords, one-time codes, banking information, identity documents, and secret keys must be entered directly into the relevant provider and never pasted into Git or project documentation.
