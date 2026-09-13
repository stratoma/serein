# Build Log

## Project Status

Current Phase: Firebase authentication integration
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
- Homepage hero copy styling and product-caption readability refinements completed.

## In Progress

- Serein storefront content, imagery, and interaction refinement.
- Product and ingredient presentation.
- Checkout experience.
- Runtime/API integration review.
- Security review of public storefront and API boundaries.
- Real Firebase login/password reset verification with configured environment variables.
- Real Firebase signup and email verification delivery verification with configured environment variables.

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
- Production deployment status is not verified.
- Local Firebase login/reset cannot be fully tested until Firebase environment variables are available to the running app.
