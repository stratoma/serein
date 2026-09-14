import { test } from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import worker from './index';
import { validateCart, catalog } from './catalog';

test('cart uses trusted product IDs and bounded integer quantities', () => {
  assert.equal(catalog['supple-oud'].amount, 2200);
  assert.deepEqual(validateCart([{ id: 'supple-oud', quantity: 2, price: 1 }]), [{ id: 'supple-oud', quantity: 2 }]);
  for (const items of [[], [{ id: '__proto__', quantity: 1 }], [{ id: 'supple-oud', quantity: -1 }], [{ id: 'supple-oud', quantity: 1.5 }], [{ id: 'supple-oud', quantity: 11 }], [{ id: 'mint-moss', quantity: 1 }, { id: 'mint-moss', quantity: 1 }]]) assert.throws(() => validateCart(items));
});

test('signed webhook confirms payment, survives duplicates and cannot regress paid orders', async () => {
  const stripe = new Stripe('sk_test_fixture');
  let status = 'pending';
  const env = {
    STRIPE_API_KEY: 'sk_test_fixture', STRIPE_WEBHOOK_SECRET: 'whsec_fixture',
    ORDERS: { prepare(sql: string) { return { bind(...args: unknown[]) { return {
      first: async () => ({ amount: 2200, currency: 'usd' }),
      run: async () => { if (sql.includes("SET status = 'paid'")) status = 'paid'; else if (status !== 'paid') status = String(args[0]); },
    }; } }; } },
  };
  async function deliver(type: string, payment_status: string, signature = true, amount = 2200) {
    const payload = JSON.stringify({ id: 'evt_fixture', object: 'event', livemode: false, type, data: { object: { id: 'cs_test_fixture', metadata: { app: 'serein' }, payment_status, amount_total: amount, currency: 'usd' } } });
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
    // Minimal D1 fixture exercises production handler and Stripe signature verification.
    return worker.fetch(new Request('https://serein.test/api/stripe/webhook', { method: 'POST', body: payload, headers: { 'stripe-signature': signature ? header : 'bad' } }), env as unknown as Parameters<typeof worker.fetch>[1]);
  }
  assert.equal((await deliver('checkout.session.completed', 'paid', false)).status, 400);
  assert.equal(status, 'pending');
  assert.equal((await deliver('checkout.session.completed', 'unpaid')).status, 200);
  assert.equal(status, 'pending');
  assert.equal((await deliver('checkout.session.async_payment_succeeded', 'paid', true, 1)).status, 400);
  assert.equal((await deliver('checkout.session.async_payment_succeeded', 'paid')).status, 200);
  assert.equal(status, 'paid');
  assert.equal((await deliver('checkout.session.async_payment_succeeded', 'paid')).status, 200);
  assert.equal((await deliver('checkout.session.async_payment_failed', 'unpaid')).status, 200);
  assert.equal(status, 'paid');
});
