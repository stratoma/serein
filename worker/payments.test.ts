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
  let confirmationEmailId: string | null = null;
  let savedDelivery: unknown[] = [];
  const emails: { headers: Headers; body: { to: string[]; subject: string; template: { id: string; variables: Record<string, string> } } }[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    if (String(input) === 'https://api.resend.com/emails') {
      emails.push({ headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
      return Response.json({ id: 'email_fixture' });
    }
    return originalFetch(input, init);
  };
  const env = {
    STRIPE_API_KEY: 'sk_test_fixture', STRIPE_WEBHOOK_SECRET: 'whsec_fixture', RESEND_API_KEY: 're_fixture', ORDER_EMAIL_FROM: 'Serein <orders@sereinskn.com>',
    ORDERS: { prepare(sql: string) { return { bind(...args: unknown[]) { return {
      first: async () => ({ amount: 2200, currency: 'usd', items: JSON.stringify([{ id: 'supple-oud', quantity: 1 }]), confirmation_email_id: confirmationEmailId }),
      run: async () => {
        if (sql.includes("SET status = 'paid'")) { status = 'paid'; savedDelivery = args; }
        else if (sql.includes('confirmation_email_id')) confirmationEmailId = String(args[0]);
        else if (status !== 'paid') status = String(args[0]);
      },
    }; } }; } },
  };
  async function deliver(type: string, payment_status: string, signature = true, amount = 2200) {
    const payload = JSON.stringify({ id: 'evt_fixture', object: 'event', livemode: false, type, data: { object: { id: 'cs_test_fixture', livemode: false, metadata: { app: 'serein' }, customer_details: { email: 'buyer@example.com', name: 'Thierry Louis' }, collected_information: { shipping_details: { name: 'Recipient', address: { line1: '1 Test Street', line2: null, city: 'Testville', state: 'NY', postal_code: '10001', country: 'US' } } }, payment_status, amount_total: amount, currency: 'usd' } } });
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET });
    // Minimal D1 fixture exercises production handler and Stripe signature verification.
    return worker.fetch(new Request('https://serein.test/api/stripe/webhook', { method: 'POST', body: payload, headers: { 'stripe-signature': signature ? header : 'bad' } }), env as unknown as Parameters<typeof worker.fetch>[1]);
  }
  try {
    assert.equal((await deliver('checkout.session.completed', 'paid', false)).status, 400);
    assert.equal(status, 'pending');
    assert.equal((await deliver('checkout.session.completed', 'unpaid')).status, 200);
    assert.equal(status, 'pending');
    assert.equal((await deliver('checkout.session.async_payment_succeeded', 'paid', true, 1)).status, 400);
    assert.equal((await deliver('checkout.session.async_payment_succeeded', 'paid')).status, 200);
    assert.equal(status, 'paid');
    assert.equal(savedDelivery[0], 'Thierry Louis');
    assert.equal(savedDelivery[2], 'Recipient');
    assert.equal(JSON.parse(String(savedDelivery[3])).line1, '1 Test Street');
    assert.equal(confirmationEmailId, 'email_fixture');
    assert.equal(emails.length, 1);
    assert.equal(emails[0].headers.get('idempotency-key'), 'serein-order-confirmation/cs_test_fixture');
    assert.deepEqual(emails[0].body.to, ['buyer@example.com']);
    assert.match(emails[0].body.subject, /TEST ORDER/);
    assert.equal(emails[0].body.template.id, '5fdd8391-bae2-4cd7-868d-38237b293537');
    assert.equal(emails[0].body.template.variables.First_Name, 'Thierry');
    assert.equal(emails[0].body.template.variables.ORDER_NUMBER, 'TEST_FIXTURE');
    assert.match(emails[0].body.template.variables.ORDER_ITEMS, /Supple Oud × 1.*no payment was collected and no package will ship/);
    assert.equal(emails[0].body.template.variables.ORDER_TOTAL, '$22.00');
    assert.equal((await deliver('checkout.session.async_payment_succeeded', 'paid')).status, 200);
    assert.equal(emails.length, 1);
    assert.equal((await deliver('checkout.session.async_payment_failed', 'unpaid')).status, 200);
    assert.equal(status, 'paid');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
