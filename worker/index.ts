import Stripe from 'stripe';
import { catalog, validateCart } from './catalog';

type Bindings = Env & { STRIPE_API_KEY?: string; STRIPE_WEBHOOK_SECRET?: string };
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');
async function body(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  let size = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); throw new Error('Request too large'); }
    parts.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  return new TextDecoder().decode(bytes);
}
export default {
  async fetch(request: Request, env: Bindings): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!['/api/stripe/checkout', '/api/stripe/webhook', '/api/stripe/status'].includes(url.pathname)) return json({ error: 'Not found' }, 404);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    if (!env.STRIPE_API_KEY || !/^[sr]k_test_/.test(env.STRIPE_API_KEY) || !env.STRIPE_WEBHOOK_SECRET) {
      return json({ error: 'Test checkout is not configured yet. Please try again later.' }, 503);
    }
    const stripe = new Stripe(env.STRIPE_API_KEY, { httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 1, timeout: 15000 });
    try {
      if (url.pathname === '/api/stripe/webhook') {
        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(await body(request, 262144), request.headers.get('stripe-signature') ?? '', env.STRIPE_WEBHOOK_SECRET, undefined, Stripe.createSubtleCryptoProvider());
        } catch { return json({ error: 'Invalid webhook signature' }, 400); }
        if (event.livemode) return json({ error: 'Test events only' }, 400);
        if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'checkout.session.expired'].includes(event.type)) return json({ received: true });
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.app !== 'serein') return json({ received: true });
        const order = await env.ORDERS.prepare('SELECT amount, currency FROM orders WHERE session_id = ?').bind(session.id).first<{ amount: number; currency: string }>();
        if (!order) return json({ error: 'Order not ready; retry delivery' }, 503);
        if (order.amount !== session.amount_total || order.currency !== session.currency) return json({ error: 'Order total mismatch' }, 400);
        const paid = session.payment_status === 'paid';
        if (paid) {
          await env.ORDERS.prepare("UPDATE orders SET status = 'paid', paid_at = COALESCE(paid_at, CURRENT_TIMESTAMP) WHERE session_id = ?").bind(session.id).run();
        } else if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
          await env.ORDERS.prepare("UPDATE orders SET status = ? WHERE session_id = ? AND status != 'paid'").bind(event.type.endsWith('expired') ? 'expired' : 'failed', session.id).run();
        }
        return json({ received: true });
      }
      if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
      let input;
      try { input = JSON.parse(await body(request, 8192)); } catch { return json({ error: 'Invalid request' }, 400); }
      if (!input || typeof input.token !== 'string' || !/^[a-f0-9-]{36}$/.test(input.token)) return json({ error: 'Invalid checkout token' }, 400);
      const tokenHash = await hash(input.token);
      if (url.pathname === '/api/stripe/status') {
        if (typeof input.sessionId !== 'string' || !/^cs_test_[a-zA-Z0-9]+$/.test(input.sessionId)) return json({ error: 'Invalid session' }, 400);
        const order = await env.ORDERS.prepare('SELECT status, amount, currency FROM orders WHERE session_id = ? AND token_hash = ?').bind(input.sessionId, tokenHash).first();
        return order ? json(order) : json({ error: 'Order not found in this browser' }, 404);
      }
      let items;
      try { items = validateCart(input.items); } catch { return json({ error: 'Please check your cart. Limit: 10 of each product.' }, 400); }
      const amount = items.reduce((sum, item) => sum + catalog[item.id].amount * item.quantity, 0);
      const fingerprint = await hash(JSON.stringify(items));
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        integration_identifier: 'serein_checkout_vqhrbczm',
        line_items: items.map(item => ({ quantity: item.quantity, price_data: { currency: 'usd', unit_amount: catalog[item.id].amount, product_data: { name: catalog[item.id].name } } })),
        metadata: { app: 'serein' },
        success_url: `${url.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url.origin}/checkout?canceled=1`,
      }, { idempotencyKey: `serein-${tokenHash}-${fingerprint}` });
      await env.ORDERS.prepare('INSERT OR IGNORE INTO orders (session_id, token_hash, amount, currency, items) VALUES (?, ?, ?, ?, ?)').bind(session.id, tokenHash, amount, 'usd', JSON.stringify(items)).run();
      return json({ url: session.url });
    } catch (error) {
      console.error(JSON.stringify({ event: 'checkout_error', type: error instanceof Stripe.errors.StripeError ? error.type : 'internal' }));
      return json({ error: 'Unable to process checkout right now. Please try again.' }, 503);
    }
  },
} satisfies ExportedHandler<Bindings>;
