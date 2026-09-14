# Build Log

## Project Status

Current Phase: Google authentication reliability verification
Last Updated: 2026-09-13
Overall Status: Active development

## Completed

- Project workspace initialized as a pnpm monorepo.
- Serein storefront artifact created under `artifacts/serein`.
- Core storefront routes wired with Wouter.
- Brand/product pages present for home, ingredients, markets, checkout, policies, product detail, and Morrow Trio collection.
- Cart context and cart drawer implemented.
- Shared API, DB, API spec, and React API client packages present.
- API server artifact present with Express router mounting.
- Playwright test coverage exists for ingredient links.
- Firebase Authentication client integration added for sign-in and password reset testing.
- Firebase signup UI and account creation added.
- Google authentication added for sign-in and first-time signup.
- Google redirect sign-in added for browsers that block popup authentication.
- Homepage hero copy styling and product-caption readability refinements completed.

## In Progress

- Serein storefront content, imagery, and interaction refinement.
- Product and ingredient presentation.
- Checkout experience.
- Runtime/API integration review.
- Security review of public storefront and API boundaries.
- Real Firebase login/password reset verification with configured environment variables.
- Real Firebase signup and email verification delivery verification with configured environment variables.
- Google provider verification in Firebase production configuration.
- Production verification of the Google redirect flow.

## Planned

- Production deployment verification.
- Checkout/payment boundary implementation or integration review.
- Accessibility and responsive QA.
- Public API/CORS hardening if server endpoints are exposed.
- Form validation review.
- Dependency/security audit.
- Build/test verification after meaningful changes.

## Changes

### Build Log

Status: Completed

Implemented:

- Added persistent project build log.
- Recorded current repository structure and development state.
- Added initial security findings and known issues.

Files affected:

1.
```
BUILD_LOG.md
```

Verification:

- Confirmed repository contains a frontend artifact, API server artifact, shared packages, and Playwright test configuration.
- Did not modify existing application code.

### Storefront Application

Status: In Progress

Implemented:

- App shell with navigation, footer, scroll restoration, cart provider, cart drawer, toast provider, tooltip provider, and query client provider.
- Routes for `/`, `/ingredients`, `/markets`, `/checkout`, `/privacy`, `/shipping`, `/collection/morrow-trio`, and `/collection/:slug`.
- Product data module and storefront UI components.

Files affected:

1.
```
artifacts/serein/src/App.tsx
```

1.
```
artifacts/serein/src/context/cart-context.tsx
```

1.
```
artifacts/serein/src/components/cart-drawer.tsx
```

1.
```
artifacts/serein/src/data/products.ts
```

1.
```
artifacts/serein/src/pages/home.tsx
```

1.
```
artifacts/serein/src/pages/ingredients.tsx
```

1.
```
artifacts/serein/src/pages/product-detail.tsx
```

1.
```
artifacts/serein/src/pages/morrow-trio.tsx
```

1.
```
artifacts/serein/src/pages/checkout.tsx
```

Verification:

- File structure inspected.
- Full build/test not run during this log initialization.

### API Server

Status: Present, Needs Review

Implemented:

- Express app setup.
- Pino HTTP request logging with limited request and response serialization.
- JSON and URL-encoded body parsing.
- `/api` router mount.

Files affected:

1.
```
artifacts/api-server/src/app.ts
```

Verification:

- App entry inspected.
- Endpoint-specific behavior not yet reviewed in this log pass.

### Firebase Authentication

Status: In Progress

Implemented:

- Added Firebase client SDK dependency to the Serein frontend package.
- Added Firebase initialization through Vite environment variables.
- Added authentication context with session tracking, email/password sign-in, account creation, email verification, password reset, and sign-out.
- Added `/auth` page with sign-in, sign-up, reset-password, signed-in, loading, and missing-configuration states.
- Added desktop and mobile navigation access for sign-in/sign-out.
- Added `.env.example` with required Firebase Vite variable names.
- Added `.env.local` ignore coverage so local Firebase values are not committed.
- Password reset UI uses a generic success message to avoid revealing whether an email address is registered.
- Signup sends a Firebase email-verification message after account creation.

Files affected:

1.
```
.env.example
```

1.
```
.gitignore
```

1.
```
artifacts/serein/package.json
```

1.
```
pnpm-lock.yaml
```

1.
```
artifacts/serein/src/App.tsx
```

1.
```
artifacts/serein/src/components/nav.tsx
```

1.
```
artifacts/serein/src/context/auth-context.tsx
```

1.
```
artifacts/serein/src/lib/firebase.ts
```

1.
```
artifacts/serein/src/pages/auth.tsx
```

Verification:

- `corepack pnpm@10 --filter @workspace/serein run typecheck` passed.
- `PORT=4173 BASE_PATH=/ corepack pnpm@10 --filter @workspace/serein run build` passed.
- Local dev server started on `http://localhost:4174/`.
- Browser smoke test confirmed `/auth` renders and fails closed with a missing Firebase configuration message when local env vars are absent.
- Signup UI added after the initial auth push; current verification is recorded in the latest auth milestone update.

Unfinished:

- Real sign-in and password reset email delivery are not verified locally because Firebase Vite variables are not present in the local runtime.
- Real signup and email verification delivery are not verified locally because Firebase Vite variables are not present in the local runtime.
- Need to test against a Cloudflare preview/production build with the configured variables, or add the same values to a local `.env.local`.

### Firebase Signup

Status: In Progress

Implemented:

- Added Firebase email/password account creation.
- Sends Firebase email verification after a customer account is created.
- Added Sign up tab to `/auth`.
- Reuses the password input with `new-password` autocomplete and minimum client-side length.
- Keeps account-creation errors generic in the public UI.

Files affected:

1.
```
artifacts/serein/src/context/auth-context.tsx
```

1.
```
artifacts/serein/src/pages/auth.tsx
```

1.
```
BUILD_LOG.md
```

Verification:

- `corepack pnpm@10 --filter @workspace/serein run typecheck` passed.
- `PORT=4173 BASE_PATH=/ corepack pnpm@10 --filter @workspace/serein run build` passed.
- Local dummy-config smoke test on `http://localhost:4175/auth` confirmed the Sign up tab renders and changes the submit button to Create account.

Unfinished:

- Real account creation and email verification delivery must be tested against Cloudflare production/preview with real Firebase web config.

### Google Authentication

Status: In Progress

Implemented:

- Added Firebase Google provider support.
- Added a shared Continue with Google button for sign-in and sign-up modes.
- Google flow prompts customers to choose an account.
- Google auth errors are shown as generic public UI messages.

Files affected:

1.
```
artifacts/serein/src/context/auth-context.tsx
```

1.
```
artifacts/serein/src/pages/auth.tsx
```

1.
```
BUILD_LOG.md
```

Verification:

- `corepack pnpm@10 --filter @workspace/serein run typecheck` passed.
- `PORT=4173 BASE_PATH=/ corepack pnpm@10 --filter @workspace/serein run build` passed.
- Local dummy-config smoke test on `http://localhost:4175/auth` confirmed Continue with Google renders in sign-in mode.
- Local dummy-config smoke test confirmed Sign up mode keeps Continue with Google visible and changes the email submit button to Create account.

Unfinished:

- Firebase Console must have Google as an enabled sign-in provider.
- Production domain must remain listed in Firebase Authorized domains.

### Production Deployment

Status: Completed

Implemented:

- Deployed the current Serein static asset build to Cloudflare Workers.
- Production now references the latest built JavaScript asset bundle.

Files affected:

1.
```
artifacts/serein/dist/public
```

1.
```
BUILD_LOG.md
```

Verification:

- `CLOUDFLARE_ACCOUNT_ID=ebba4f358bac6d74783717739970c11f npx wrangler deploy` completed successfully.
- Wrangler uploaded `/index.html` and `/assets/index-79oNh3Gd.js`.
- Production HTML at `https://serein.stratoma.workers.dev/` references `assets/index-79oNh3Gd.js` and `assets/index-BFr7Etst.css`.
- Cloudflare deployment version: `eeb1f99a-944e-4a0c-b561-8f8ddd012813`.

### Google Authentication Deployment

Status: Completed

Implemented:

- Deployed the Google authentication UI and Firebase provider integration to Cloudflare Workers.

Files affected:

1.
```
artifacts/serein/dist/public
```

1.
```
BUILD_LOG.md
```

Verification:

- `CLOUDFLARE_ACCOUNT_ID=ebba4f358bac6d74783717739970c11f npx wrangler deploy` completed successfully.
- Wrangler uploaded `/index.html`, `/assets/index-CYFg_iaf.css`, and `/assets/index-hRClWz1r.js`.
- Production HTML at `https://serein.stratoma.workers.dev/` references `assets/index-hRClWz1r.js` and `assets/index-CYFg_iaf.css`.
- Cloudflare deployment version: `6849fa1a-aa66-44c8-8422-1f9288bd3e8a`.

### Google Authentication Reliability

Status: Blocked on project-console configuration

Implemented:

- Uses redirect sign-in to avoid browser popup and embedded-browser restrictions.
- Reads the redirect result when the app returns to the auth page.
- Preserves generic customer-facing error messaging after redirect failures.

Files affected:

1.
```
artifacts/serein/src/context/auth-context.tsx
```

1.
```
artifacts/serein/src/pages/auth.tsx
```

1.
```
BUILD_LOG.md
```

Verification:

- `corepack pnpm@10 --filter @workspace/serein run typecheck` passed.
- Production-configured Vite build passed.
- Local auth page smoke test confirmed the Google button remains available in sign-in mode.
- Production test confirmed the request is rejected before the Google account picker opens.
- Clean redirect build deployed to Cloudflare Worker version `313a0862-b9dc-4af2-9574-6662c5cc036f`.

Unfinished:

- Production Google account completion must be re-tested after deployment.
- The Google provider must be enabled in the project console.
- `serein.stratoma.workers.dev` must be listed under authorized domains in the project console.
- The available browser account cannot access the `sereinskn` project, so those console settings were not changed by this task.

### Auth Page Provider-Neutral Copy

Status: Completed

Implemented:

- Removed public Firebase/provider wording from the authentication page.
- Replaced configuration and session messages with customer-facing account language.
- Kept implementation details in code and developer documentation only.

Files affected:

1.
```
artifacts/serein/src/pages/auth.tsx
```

1.
```
BUILD_LOG.md
```

Verification:

- Confirmed `artifacts/serein/src/pages/auth.tsx` no longer contains `Firebase` or `firebase`.
- `corepack pnpm@10 --filter @workspace/serein run typecheck` passed.
- `PORT=4173 BASE_PATH=/ corepack pnpm@10 --filter @workspace/serein run build` passed.
- Deployed provider-neutral copy to Cloudflare Workers.
- Production `/auth` no longer displays provider names or internal `VITE_FIREBASE_*` variable names.
- Cloudflare deployment version: `49031d57-1164-4c07-9dc8-1b6aa0af1b4b`.

### Homepage Copy And Caption Readability

Status: Completed

Implemented:

- Increased hero supporting-copy contrast and readability.
- Adjusted hero supporting-copy spacing and max width.
- Replaced the homepage section em dash sentence with two shorter sentences.
- Added product-card caption gradient backing and stronger text treatment for image readability.

Files affected:

1.
```
artifacts/serein/src/pages/home.tsx
```

1.
```
BUILD_LOG.md
```

Verification:

- `corepack pnpm@10 --filter @workspace/serein run typecheck` passed.
- `PORT=4173 BASE_PATH=/ corepack pnpm@10 --filter @workspace/serein run build` passed.

## Security Findings

- API server currently uses default `cors()` behavior in `artifacts/api-server/src/app.ts`; review and restrict allowed origins before exposing production endpoints.
- API server uses default JSON and URL-encoded body parsing; review request size limits for public endpoints.
- No authentication or role-based access implementation confirmed during this log initialization.
- Checkout/payment behavior needs review before collecting sensitive data or redirecting to external payment providers.
- Existing request logging intentionally omits query strings, which helps avoid leaking sensitive URL parameters.
- Firebase password reset currently returns generic UI messaging, reducing email enumeration risk.
- Firebase config variables are referenced through Vite env vars; no Firebase Admin credentials or service account secrets were added.
- Auth currently proves identity only. Any future customer data, orders, admin pages, or backend endpoints must add authorization checks using Firebase ID token verification, ownership checks, security rules, or custom claims.

## Known Issues

- Existing uncommitted repository changes were present before this log was created:
  - `artifacts/serein/src/pages/home.tsx`
  - `serein-main.zip`
- Full build, typecheck, dependency audit, and Playwright test suite were not run during this log initialization.
- Production deployment is verified through Cloudflare Worker version `313a0862-b9dc-4af2-9574-6662c5cc036f`; Google account completion remains blocked on project-console settings.
- Local Firebase login/reset cannot be fully tested until Firebase environment variables are available to the running app.
# Stripe sandbox Checkout — 2026-09-14

- Implemented and deployed hosted Checkout from the existing cart, server-owned prices, D1 orders, signed webhook verification, and token-protected confirmation polling.
- Test-only key enforcement prevents real payments. No shipping/tax/physical fulfillment is performed.
- Passed cart validation and signed webhook tests (including forged signatures, unpaid events, mismatched amounts, duplicate events, and paid-state regression), frontend/Worker typechecks, production build, and Wrangler dry run.
- End-to-end verification: bought Supple Oud for $22 in Stripe sandbox using a fictitious test card; corrected existing destination `we_1UFjAbHiM6owGJBCzanLqaTQ` from `https://sereinskn.com/` to the deployed webhook; resent event `evt_1UFjQrHiM6owGJBCUHpCJEi1`; observed “Test payment confirmed” in Serein.
- Deployment: `d10b37bc-bce3-439e-961a-ede82e9a4e49`. Database migration applied to dedicated `serein-orders`.
- Secrets remained in Cloudflare; no secret values were read or committed. Build retains pre-existing large-chunk/sourcemap warnings.
- Remaining for real sales: shipping rates and regions, tax configuration, inventory/fulfillment and notifications, rate limits, and explicit live-mode setup. See `worker/README.md`.

# Realistic sandbox order flow — 2026-09-14

- Expanded sandbox Checkout to require billing address, U.S. delivery address, phone, and email, and to create Stripe customers and one-time invoices.
- Paid confirmation now reads like an order receipt, includes a reference, and clears the cart after the signed webhook confirms payment.
- Stripe sandbox currently has no shipping rates or tax registrations, so the flow does not invent shipping charges, delivery promises, or tax collection.
- Passed payment/webhook tests, frontend and Worker typechecks, production build, and Wrangler dry run. Final deployed Worker version: `683feae1-db8e-4371-9ef9-3faec754238c`.
- Live sandbox inspection confirmed `customer_creation: always`, invoice creation, required billing address, phone collection, U.S. delivery-address collection, and the expected $22 USD total.
- Completed a fresh $22 sandbox purchase through the deployed flow with fictitious contact, U.S. delivery, billing, and test-card data; Stripe marked it paid and complete, created a customer and invoice, retained the delivery details, and the signed webhook confirmed the order. Serein showed the order reference, cleared the cart, and retained the correct $22 paid total after refresh. A receipt-total regression found during this check was fixed before final verification.

# Checkout retry token fix — 2026-09-14

- Fixed checkout attempts reusing a browser token from an earlier completed or expired Stripe Checkout Session.
- Each click now creates a fresh attempt token while retaining it through Stripe's return redirect for token-protected order confirmation.
- Frontend and Worker typechecks passed; the production build passed with the existing sourcemap and large-chunk warnings; Wrangler dry run completed.
- Deployed Worker version `435ebb4d-2650-42a1-88b8-e90be98c062c`. Two consecutive live sandbox requests for the same cart returned distinct Stripe Checkout Sessions.
