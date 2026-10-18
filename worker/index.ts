import Stripe from 'stripe';
import { catalog, validateCart } from './catalog';
import { customerUid } from './customer-auth';

type Bindings = Env & {
  STRIPE_API_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  ORDER_EMAIL_FROM?: string;
  FIREBASE_PROJECT_ID?: string;
  ORDER_ADMIN_UIDS?: string;
};
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const formatUsd = (amount: number) => `$${(amount / 100).toFixed(2)}`;
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

async function sendOrderConfirmation(
  env: Bindings,
  session: Stripe.Checkout.Session,
  order: { amount: number; items: string },
) {
  if (!env.RESEND_API_KEY || !env.ORDER_EMAIL_FROM) throw new Error('Order email is not configured');
  const recipient = session.customer_details?.email ?? session.customer_email;
  if (!recipient) throw new Error('Checkout customer email is missing');
  let items: { id: string; quantity: number }[];
  try { items = validateCart(JSON.parse(order.items)); } catch { throw new Error('Stored order items are invalid'); }
  const lines = items.map((item) => `${catalog[item.id].name} × ${item.quantity}`);
  const orderReference = session.id.slice(-12).toUpperCase();
  const sandboxNote = session.livemode ? '' : '<p style="margin:24px 0 0;color:#766f69;font-size:14px;line-height:1.5">This is a sandbox test order. No payment was collected and no package will ship.</p>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `serein-order-confirmation/${session.id}`,
    },
    body: JSON.stringify({
      from: env.ORDER_EMAIL_FROM,
      to: [recipient],
      subject: `Your Serein order is confirmed · ${orderReference}`,
      text: `Your Serein order is confirmed. Order ${orderReference}. ${lines.join(', ')}. Total: ${formatUsd(order.amount)}.${session.livemode ? '' : ' This is a sandbox test order. No payment was collected and no package will ship.'}`,
      html: `<main style="max-width:560px;margin:0 auto;padding:40px 24px;background:#f8f3eb;color:#2d211f;font-family:Arial,sans-serif"><p style="margin:0 0 28px;font-size:13px;letter-spacing:4px">S E R E I N</p><h1 style="margin:0;font-family:Georgia,serif;font-size:38px;font-weight:400">Make it yours.</h1><p style="margin:20px 0 0;font-size:16px;line-height:1.6">Your order is confirmed. Thank you for choosing a little more room for ritual.</p><p style="margin:28px 0 10px;font-size:12px;letter-spacing:2px;color:#766f69">ORDER ${escapeHtml(orderReference)}</p><section style="border-top:1px solid #d9d0c6;border-bottom:1px solid #d9d0c6;padding:18px 0">${lines.map((line) => `<p style="margin:0 0 10px;font-size:16px">${escapeHtml(line)}</p>`).join('')}<p style="margin:14px 0 0;font-size:18px"><strong>Total</strong> ${escapeHtml(formatUsd(order.amount))}</p></section>${sandboxNote}</main>`,
    }),
  });
  if (!response.ok) throw new Error(`Order email delivery failed (${response.status})`);
  const result = await response.json() as { id?: unknown };
  if (typeof result.id !== 'string') throw new Error('Order email provider returned an invalid response');
  return result.id;
}
export default {
  async fetch(request: Request, env: Bindings): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (url.pathname === '/api/account/orders' || url.pathname === '/api/admin/orders') {
      if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Account orders are not configured yet.' }, 503);
      const uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
      if (!uid) return json({ error: 'Please sign in again.' }, 401);
      const admin = url.pathname === '/api/admin/orders';
      if (admin && !env.ORDER_ADMIN_UIDS?.split(',').map(value => value.trim()).includes(uid)) return json({ error: 'Not authorized.' }, 403);
      try {
        if (request.method === 'GET') {
          const query = admin
            ? env.ORDERS.prepare("SELECT session_id, amount, currency, items, created_at, fulfillment_status, tracking_carrier, tracking_number, tracking_url, fulfillment_updated_at FROM orders WHERE status = 'paid' ORDER BY created_at DESC")
            : env.ORDERS.prepare("SELECT session_id, amount, currency, items, created_at, fulfillment_status, tracking_carrier, tracking_number, tracking_url, fulfillment_updated_at FROM orders WHERE status = 'paid' AND customer_uid = ? ORDER BY created_at DESC").bind(uid);
          const result = await query.all();
          return json({ orders: result.results });
        }
        if (admin && request.method === 'PATCH') {
          if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
          let data: Record<string, unknown>;
          try { data = JSON.parse(await body(request, 8192)); } catch { return json({ error: 'Invalid request' }, 400); }
          if (!data || typeof data.sessionId !== 'string' || !/^cs_test_[a-zA-Z0-9]+$/.test(data.sessionId) ||
              typeof data.status !== 'string' || !['received', 'in_progress', 'shipped', 'delivered'].includes(data.status)) return json({ error: 'Invalid order or status.' }, 400);
          const fields = [data.carrier, data.trackingNumber, data.trackingUrl];
          if (fields.some(value => typeof value !== 'string' || value.length > 500)) return json({ error: 'Invalid tracking details.' }, 400);
          const [carrier, trackingNumber, trackingUrl] = fields as string[];
          if (trackingUrl) {
            try { if (new URL(trackingUrl).protocol !== 'https:') throw new Error(); } catch { return json({ error: 'Tracking links must use HTTPS.' }, 400); }
          }
          const result = await env.ORDERS.prepare("UPDATE orders SET fulfillment_status = ?, tracking_carrier = ?, tracking_number = ?, tracking_url = ?, fulfillment_updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND status = 'paid'").bind(data.status, carrier.trim() || null, trackingNumber.trim() || null, trackingUrl.trim() || null, data.sessionId).run();
          return result.meta.changes ? json({ updated: true }) : json({ error: 'Order not found.' }, 404);
        }
        return json({ error: 'Method not allowed' }, 405);
      } catch { return json({ error: 'Unable to load or update orders right now.' }, 503); }
    }
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
        const order = await env.ORDERS.prepare('SELECT amount, currency, items, confirmation_email_id FROM orders WHERE session_id = ?').bind(session.id).first<{ amount: number; currency: string; items: string; confirmation_email_id: string | null }>();
        if (!order) return json({ error: 'Order not ready; retry delivery' }, 503);
        if (order.amount !== session.amount_total || order.currency !== session.currency) return json({ error: 'Order total mismatch' }, 400);
        const paid = session.payment_status === 'paid';
        if (paid) {
          await env.ORDERS.prepare("UPDATE orders SET status = 'paid', paid_at = COALESCE(paid_at, CURRENT_TIMESTAMP) WHERE session_id = ?").bind(session.id).run();
          if (!order.confirmation_email_id) {
            const emailId = await sendOrderConfirmation(env, session, order);
            await env.ORDERS.prepare('UPDATE orders SET confirmation_email_id = ?, confirmation_email_sent_at = CURRENT_TIMESTAMP WHERE session_id = ? AND confirmation_email_id IS NULL').bind(emailId, session.id).run();
          }
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
      let uid: string | null = null;
      if (request.headers.has('Authorization')) {
        if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Account orders are not configured yet.' }, 503);
        uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
        if (!uid) return json({ error: 'Please sign in again before checkout.' }, 401);
      }
      const amount = items.reduce((sum, item) => sum + catalog[item.id].amount * item.quantity, 0);
      const fingerprint = await hash(JSON.stringify(items));
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        integration_identifier: 'serein_checkout_vqhrbczm',
        billing_address_collection: 'required',
        customer_creation: 'always',
        invoice_creation: { enabled: true },
        phone_number_collection: { enabled: true },
        shipping_address_collection: { allowed_countries: ['US'] },
        line_items: items.map(item => ({ quantity: item.quantity, price_data: { currency: 'usd', unit_amount: catalog[item.id].amount, product_data: { name: catalog[item.id].name } } })),
        metadata: { app: 'serein' },
        success_url: `${url.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url.origin}/checkout?canceled=1`,
      }, { idempotencyKey: `serein-${tokenHash}-${fingerprint}` });
      await env.ORDERS.prepare('INSERT OR IGNORE INTO orders (session_id, token_hash, amount, currency, items, customer_uid) VALUES (?, ?, ?, ?, ?, ?)').bind(session.id, tokenHash, amount, 'usd', JSON.stringify(items), uid).run();
      return json({ url: session.url });
    } catch (error) {
      console.error(JSON.stringify({ event: 'checkout_error', type: error instanceof Stripe.errors.StripeError ? error.type : 'internal' }));
      return json({ error: 'Unable to process checkout right now. Please try again.' }, 503);
    }
  },
} satisfies ExportedHandler<Bindings>;
