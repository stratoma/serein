import Stripe from 'stripe';
import { catalog } from './catalog';
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
const configuredAdmins = (env: Bindings) => (env.ORDER_ADMIN_UIDS ?? '').split(',').map(value => value.trim()).filter(Boolean);
async function staffAccess(env: Bindings, uid: string): Promise<boolean> {
  if (configuredAdmins(env).includes(uid)) return true;
  return !!await env.ORDERS.prepare('SELECT uid FROM staff_users WHERE uid = ?').bind(uid).first();
}
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
  let items: { id: string; name?: string; quantity: number }[];
  try { items = JSON.parse(order.items); if (!Array.isArray(items)) throw new Error(); } catch { throw new Error('Stored order items are invalid'); }
  const lines = items.map((item) => `${item.name ?? catalog[item.id]?.name ?? item.id} × ${item.quantity}`);
  const orderReference = session.id.slice(-12).toUpperCase();
  const firstName = session.customer_details?.name?.trim().split(/\s+/)[0] || 'there';
  const orderItems = lines.join(', ');
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
      ...(!session.livemode ? { subject: `TEST ORDER — no payment or shipment · ${orderReference}` } : {}),
      template: {
        id: '5fdd8391-bae2-4cd7-868d-38237b293537',
        variables: {
          First_Name: escapeHtml(firstName),
          ORDER_NUMBER: orderReference,
          ORDER_ITEMS: escapeHtml(session.livemode ? orderItems : `${orderItems} — TEST ORDER: no payment was collected and no package will ship.`),
          ORDER_TOTAL: formatUsd(order.amount),
        },
      },
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
    if (url.pathname === '/api/admin/users') {
      if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Staff access is not configured yet.' }, 503);
      const uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
      if (!uid) return json({ error: 'Please sign in again.' }, 401);
      const owners = configuredAdmins(env);
      if (!owners.includes(uid)) return json({ error: 'Only configured administrators can manage users.' }, 403);
      try {
        if (request.method === 'GET') {
          const result = await env.ORDERS.prepare('SELECT uid, name, email, added_at FROM staff_users ORDER BY added_at DESC').all();
          return json({ users: result.results, configured: owners, currentUid: uid });
        }
        if (!['POST', 'DELETE'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
        if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
        let data: Record<string, unknown>;
        try { data = JSON.parse(await body(request, 16384)); } catch { return json({ error: 'Invalid request.' }, 400); }
        if (!data) return json({ error: 'Invalid request.' }, 400);
        if (request.method === 'DELETE') {
          if (typeof data.uid !== 'string' || !/^[^\s]{1,128}$/.test(data.uid)) return json({ error: 'Enter a valid user.' }, 400);
          if (owners.includes(data.uid)) return json({ error: 'Configured administrators are managed in the Worker settings.' }, 400);
          await env.ORDERS.prepare('DELETE FROM staff_users WHERE uid = ?').bind(data.uid).run();
          return json({ saved: true });
        }
        if (typeof data.name !== 'string' || data.name.length > 120 || typeof data.email !== 'string' || data.email.length > 254 || (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) return json({ error: 'Check the name and email.' }, 400);
        let staffUid: string | null = null;
        if (typeof data.userToken === 'string' && data.userToken.length <= 12000) {
          staffUid = await customerUid(new Request(url.origin, { headers: { Authorization: `Bearer ${data.userToken}` } }), env.FIREBASE_PROJECT_ID);
        } else if (typeof data.uid === 'string' && /^[^\s]{1,128}$/.test(data.uid)) {
          // Editing profile labels retains support for staff added before account creation was available.
          staffUid = data.uid;
        }
        if (!staffUid) return json({ error: 'The new account could not be verified. Please try again.' }, 400);
        if (owners.includes(staffUid)) return json({ error: 'Configured administrators are managed in the Worker settings.' }, 400);
        await env.ORDERS.prepare('INSERT INTO staff_users (uid, name, email) VALUES (?, ?, ?) ON CONFLICT(uid) DO UPDATE SET name = excluded.name, email = excluded.email').bind(staffUid, data.name.trim(), data.email.trim()).run();
        return json({ saved: true });
      } catch { return json({ error: 'Unable to manage users right now.' }, 503); }
    }
    if (url.pathname === '/api/admin/email-logs' && request.method === 'GET') {
      if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Staff access is not configured yet.' }, 503);
      const uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
      if (!uid) return json({ error: 'Please sign in again.' }, 401);
      try {
        if (!await staffAccess(env, uid)) return json({ error: 'Not authorized.' }, 403);
        const type = url.searchParams.get('type') ?? 'all';
        const status = url.searchParams.get('status') ?? 'all';
        const types = ['all', 'order_confirmation', 'payment_confirmation', 'shipping_confirmation', 'cancellation', 'refund'];
        const statuses = ['all', 'sent', 'pending', 'failed'];
        if (!types.includes(type) || !statuses.includes(status)) return json({ error: 'Invalid email log filter.' }, 400);
        const where = ['1 = 1']; const values: string[] = [];
        if (type !== 'all') { where.push('email_type = ?'); values.push(type); }
        if (status !== 'all') { where.push('status = ?'); values.push(status); }
        const result = await env.ORDERS.prepare(`SELECT id, recipient, subject, email_type, status, sent_at FROM email_logs WHERE ${where.join(' AND ')} ORDER BY sent_at DESC LIMIT 250`).bind(...values).all();
        return json({ emails: result.results });
      } catch { return json({ error: 'Unable to load email logs right now.' }, 503); }
    }
    const imageMatch = url.pathname.match(/^\/api\/product-images\/([0-9a-f-]{36})$/);
    if (imageMatch && request.method === 'GET') {
      try {
        const image = await env.ORDERS.prepare('SELECT mime_type, data FROM product_images WHERE id = ?').bind(imageMatch[1]).first<{ mime_type: string; data: string }>();
        if (!image) return json({ error: 'Image not found.' }, 404);
        const bytes = Uint8Array.from(atob(image.data), char => char.charCodeAt(0));
        return new Response(bytes, { headers: { 'Content-Type': image.mime_type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
      } catch { return json({ error: 'Image unavailable.' }, 503); }
    }
    if (url.pathname === '/api/admin/product-images' && request.method === 'POST') {
      if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Staff access is not configured yet.' }, 503);
      const uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
      if (!uid) return json({ error: 'Please sign in again.' }, 401);
      try { if (!await staffAccess(env, uid)) return json({ error: 'Not authorized.' }, 403); } catch { return json({ error: 'Staff access is temporarily unavailable.' }, 503); }
      if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
      try {
        const data = JSON.parse(await body(request, 710000)) as { mime?: unknown; data?: unknown };
        if (typeof data.data !== 'string' || typeof data.mime !== 'string' || !['image/jpeg', 'image/png', 'image/webp'].includes(data.mime) || data.data.length > 699052 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.data)) return json({ error: 'Choose a JPEG, PNG, or WebP image up to 512 KB.' }, 400);
        let bytes: string;
        try { bytes = atob(data.data); } catch { return json({ error: 'Invalid image.' }, 400); }
        const signature = (offset: number, expected: number[]) => expected.every((value, i) => bytes.charCodeAt(offset + i) === value);
        const valid = data.mime === 'image/jpeg' ? signature(0, [255, 216, 255]) : data.mime === 'image/png' ? signature(0, [137, 80, 78, 71, 13, 10, 26, 10]) : signature(0, [82, 73, 70, 70]) && signature(8, [87, 69, 66, 80]);
        if (!valid || bytes.length > 524288) return json({ error: 'Invalid image or image larger than 512 KB.' }, 400);
        const id = crypto.randomUUID();
        await env.ORDERS.prepare('INSERT INTO product_images (id, mime_type, data) VALUES (?, ?, ?)').bind(id, data.mime, data.data).run();
        return json({ url: `/api/product-images/${id}` });
      } catch { return json({ error: 'Unable to upload image. Check its size and try again.' }, 400); }
    }
    if (url.pathname === '/api/products' && request.method === 'GET') {
      try { const result = await env.ORDERS.prepare('SELECT id, name, amount, description, image_url, stock FROM products WHERE active = 1 ORDER BY name').all(); return json({ products: result.results }); }
      catch { return json({ error: 'Products are temporarily unavailable.' }, 503); }
    }
    if (url.pathname === '/api/admin/products') {
      if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Staff access is not configured yet.' }, 503);
      const uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
      if (!uid) return json({ error: 'Please sign in again.' }, 401);
      try { if (!await staffAccess(env, uid)) return json({ error: 'Not authorized.' }, 403); } catch { return json({ error: 'Staff access is temporarily unavailable.' }, 503); }
      try {
        if (request.method === 'GET') { const result = await env.ORDERS.prepare('SELECT * FROM products ORDER BY name').all(); return json({ products: result.results }); }
        if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
        if (request.headers.get('origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
        let data: Record<string, unknown>;
        try { data = JSON.parse(await body(request, 8192)); } catch { return json({ error: 'Invalid request' }, 400); }
        if (!data || typeof data.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.id) || data.id.length > 80 || typeof data.name !== 'string' || !data.name.trim() || data.name.length > 120 || !Number.isInteger(data.amount) || (data.amount as number) < 0 || (data.amount as number) > 10000000 || typeof data.description !== 'string' || data.description.length > 2000 || typeof data.imageUrl !== 'string' || data.imageUrl.length > 500 || (data.stock !== null && (!Number.isInteger(data.stock) || (data.stock as number) < 0 || (data.stock as number) > 1000000)) || !Number.isInteger(data.threshold) || (data.threshold as number) < 0 || (data.threshold as number) > 1000000 || typeof data.active !== 'boolean') return json({ error: 'Please check product details and stock.' }, 400);
        if (data.imageUrl && !/^\/images\/[a-zA-Z0-9._/-]+$/.test(data.imageUrl) && !/^\/api\/product-images\/[0-9a-f-]{36}$/.test(data.imageUrl)) { try { if (new URL(data.imageUrl).protocol !== 'https:') throw new Error(); } catch { return json({ error: 'Image must be an HTTPS URL or an uploaded image.' }, 400); } }
        if (data.create === true) {
          const result = await env.ORDERS.prepare('INSERT OR IGNORE INTO products (id, name, amount, description, image_url, stock, low_stock_threshold, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(data.id, data.name.trim(), data.amount, data.description, data.imageUrl, data.stock, data.threshold, data.active ? 1 : 0).run();
          return result.meta.changes ? json({ saved: true }) : json({ error: 'A product with this ID already exists.' }, 409);
        }
        // Stock updates are deliberate absolute counts; checkout deductions remain atomic.
        const result = await env.ORDERS.prepare('UPDATE products SET name = ?, amount = ?, description = ?, image_url = ?, stock = ?, low_stock_threshold = ?, active = ? WHERE id = ? AND stock IS ?').bind(data.name.trim(), data.amount, data.description, data.imageUrl, data.stock, data.threshold, data.active ? 1 : 0, data.id, data.previousStock).run();
        return result.meta.changes ? json({ saved: true }) : json({ error: 'Product or stock changed. Refresh and try again.' }, 409);
      } catch { return json({ error: 'Unable to load or save products.' }, 503); }
    }
    if (url.pathname === '/api/account/orders' || url.pathname === '/api/admin/orders') {
      if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Account orders are not configured yet.' }, 503);
      const uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
      if (!uid) return json({ error: 'Please sign in again.' }, 401);
      const admin = url.pathname === '/api/admin/orders';
      if (admin) { try { if (!await staffAccess(env, uid)) return json({ error: 'Not authorized.' }, 403); } catch { return json({ error: 'Staff access is temporarily unavailable.' }, 503); } }
      try {
        if (request.method === 'GET') {
          const query = admin
            ? env.ORDERS.prepare("SELECT session_id, amount, currency, items, created_at, fulfillment_status, tracking_carrier, tracking_number, tracking_url, fulfillment_updated_at, customer_uid, customer_name, customer_email, delivery_name, delivery_address FROM orders WHERE status = 'paid' ORDER BY created_at DESC")
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
          // Webhook destinations can be pinned to an older Stripe API version.
          const legacySession = session as Stripe.Checkout.Session & { shipping_details?: Stripe.Checkout.Session.CollectedInformation.ShippingDetails | null };
          const shipping = session.collected_information?.shipping_details ?? legacySession.shipping_details;
          const address = shipping?.address;
          const deliveryAddress = address ? JSON.stringify({ line1: address.line1, line2: address.line2, city: address.city, state: address.state, postal_code: address.postal_code, country: address.country }) : null;
          await env.ORDERS.prepare("UPDATE orders SET status = 'paid', paid_at = COALESCE(paid_at, CURRENT_TIMESTAMP), customer_name = COALESCE(customer_name, ?), customer_email = COALESCE(customer_email, ?), delivery_name = COALESCE(delivery_name, ?), delivery_address = COALESCE(delivery_address, ?) WHERE session_id = ?").bind(session.customer_details?.name ?? null, session.customer_details?.email ?? session.customer_email ?? null, shipping?.name ?? null, deliveryAddress, session.id).run();
          if (!order.confirmation_email_id) {
            const emailId = await sendOrderConfirmation(env, session, order);
            await env.ORDERS.prepare('UPDATE orders SET confirmation_email_id = ?, confirmation_email_sent_at = CURRENT_TIMESTAMP WHERE session_id = ? AND confirmation_email_id IS NULL').bind(emailId, session.id).run();
            const recipient = session.customer_details?.email ?? session.customer_email;
            if (recipient) await env.ORDERS.prepare("INSERT OR IGNORE INTO email_logs (id, recipient, subject, email_type, status, provider_id, order_session_id) VALUES (?, ?, ?, 'order_confirmation', 'sent', ?, ?)").bind(`resend-${emailId}`, recipient, session.livemode ? 'Order confirmation' : 'TEST ORDER — no payment or shipment', emailId, session.id).run();
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
      if (!Array.isArray(input.items) || !input.items.length || input.items.length > 50) return json({ error: 'Please check your cart.' }, 400);
      const seen = new Set<string>();
      const items: { id: string; quantity: number; name: string; amount: number }[] = [];
      for (const item of input.items) {
        if (!item || typeof item.id !== 'string' || seen.has(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) return json({ error: 'Please check your cart. Limit: 10 of each product.' }, 400);
        seen.add(item.id);
        const product = await env.ORDERS.prepare('SELECT id, name, amount, stock FROM products WHERE id = ? AND active = 1').bind(item.id).first<{ id: string; name: string; amount: number; stock: number | null }>();
        if (!product || (product.stock !== null && product.stock < item.quantity)) return json({ error: 'A product is unavailable or has insufficient stock. Please update your cart.' }, 409);
        items.push({ id: product.id, name: product.name, amount: product.amount, quantity: item.quantity });
      }
      let uid: string | null = null;
      if (request.headers.has('Authorization')) {
        if (!env.FIREBASE_PROJECT_ID) return json({ error: 'Account orders are not configured yet.' }, 503);
        uid = await customerUid(request, env.FIREBASE_PROJECT_ID);
        if (!uid) return json({ error: 'Please sign in again before checkout.' }, 401);
      }
      const amount = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
      const fingerprint = await hash(JSON.stringify(items));
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        integration_identifier: 'serein_checkout_vqhrbczm',
        billing_address_collection: 'required',
        customer_creation: 'always',
        invoice_creation: { enabled: true },
        phone_number_collection: { enabled: true },
        shipping_address_collection: { allowed_countries: ['US'] },
        line_items: items.map(item => ({ quantity: item.quantity, price_data: { currency: 'usd', unit_amount: item.amount, product_data: { name: item.name } } })),
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
