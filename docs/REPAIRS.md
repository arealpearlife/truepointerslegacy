# Repair log

Use this changelog for defects corrected after development begins.

## Entry template

- **Date:**
- **Area:**
- **Reported behavior:**
- **Root cause:**
- **Repair:**
- **Verification:**
- **Release or commit:**

## Hydration mismatch in local development

- **Date:** 2026-10-27
- **Area:** Web storefront, development only
- **Reported behavior:** React reported a hydration mismatch on the policy page heading.
- **Root cause:** The Cursor browser injected `data-cursor-ref` attributes into the server HTML before React hydrated. The server output was clean.
- **Repair:** A development-only inline script removes those attributes before hydration. Production builds do not include it.
- **Verification:** The policy and product pages load in the Cursor browser without hydration errors.
- **Release or commit:** Storefront redesign commit.

## Flat, unsaturated storefront presentation

- **Date:** 2026-10-27
- **Area:** Web storefront visual design
- **Reported behavior:** The site did not read as hip-hop luxury jewelry, the colors lacked saturation, and the type looked like presentation slides.
- **Root cause:** The first build used a soft pastel treatment and serif display type.
- **Repair:** The site has a new type system, saturated signal colors, a scrolling announcement bar, a centered wordmark header, a red hero, ring shortcuts, a nine-configuration Legacy collection grid that uses Shopify prices, a Flawless band, and a restyled product page, cart, and footer. See ADR-006 and ADR-007.
- **Verification:** Format, lint, typecheck, tests, and build pass. Checked in the browser at desktop and phone widths.
- **Release or commit:** Storefront redesign commit.
