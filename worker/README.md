# Stripe sandbox checkout

The deployed Worker accepts test keys only. Hosted Checkout uses the server catalog (USD cents), never submitted browser prices. It requires billing address, U.S. delivery address, phone, and email; creates a Stripe customer and invoice; and returns an order confirmation. The D1 order status becomes paid only after a verified Stripe webhook. Repeat paid events are idempotent; failed or expired events cannot revert a paid order. Status access requires the browser's random checkout token; no personal data is returned.

## Development

- Copy `.dev.vars.example` to ignored `.dev.vars` and enter a restricted test API key and webhook signing secret locally.
- `npx wrangler d1 migrations apply ORDERS --local`
- Build the frontend: `PORT=4173 BASE_PATH=/ NODE_ENV=production corepack pnpm@10.11.1 --filter @workspace/serein run build`
- `npx wrangler dev --port 8787`
- `stripe listen --forward-to localhost:8787/api/stripe/webhook` (use this listener's signing secret locally).
- `corepack pnpm@10.11.1 exec tsx --test worker/payments.test.ts`
- `corepack pnpm@10.11.1 exec tsc -p worker/tsconfig.json`

## Deployed configuration

Secrets: `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, and `ORDER_EMAIL_FROM` (for example, `Serein <orders@sereinskn.com>`). Database: `serein-orders`.
Webhook: `https://serein.stratoma.workers.dev/api/stripe/webhook`.
Subscribe to checkout.session.completed, checkout.session.async_payment_succeeded,
checkout.session.async_payment_failed, checkout.session.expired. The first two confirm
payment; the latter two provide terminal failure status. A confirmed payment sends one branded Resend order email to the email collected by Stripe Checkout, using the Checkout Session ID as an idempotency key. Keep test and live destinations separate.

Before deploying order confirmations, verify `sereinskn.com` in Resend and configure the `RESEND_API_KEY` and `ORDER_EMAIL_FROM` Worker secrets. Apply the `0002_order_confirmation_email.sql` migration to the production D1 database before deploying the Worker.

## Verification and remaining launch work

2026-09-14: Completed a $22 sandbox card payment through the deployed site's cart.
Corrected the existing sandbox destination from the homepage to the Worker endpoint,
resent the signed event, and observed the site's test-payment-confirmed screen.
No real charge or shipment occurred.

This is a sandbox purchase demonstration. Before real sales: agree on shipping regions/rates,
configure applicable tax registrations, implement operational
fulfillment/customer notifications and inventory, add abuse/rate controls, and explicitly
enable a separately validated live integration. The sandbox cart remains available for repeat tests.
