import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/auth-context';
import { orderDate, steps, type Order } from './account';
import type { ManagedProduct } from './manage-products';
import { deliveryLines } from '@/data/order-delivery';

type AdminOrder = Order & { customer_uid: string | null; customer_name?: string | null; customer_email?: string | null; delivery_name?: string | null; delivery_address?: string | null };
const money = (amount: number, currency: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
const previewOrders: AdminOrder[] = [
  { session_id: 'cs_test_PREVIEW001', amount: 4400, currency: 'usd', items: '[]', created_at: '2026-10-19 14:00:00', fulfillment_status: 'received', customer_uid: 'sample-customer-1', tracking_carrier: null, tracking_number: null, tracking_url: null, fulfillment_updated_at: null },
  { session_id: 'cs_test_PREVIEW002', amount: 2200, currency: 'usd', items: '[]', created_at: '2026-10-18 14:00:00', fulfillment_status: 'shipped', customer_uid: 'sample-customer-2', tracking_carrier: null, tracking_number: null, tracking_url: null, fulfillment_updated_at: null },
];

export default function AdminDashboard() {
  const { user, isReady } = useAuth();
  const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1';
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const load = useCallback(async () => {
    if (!user) return;
    const version = ++requestVersion.current;
    setLoading(true); setError('');
    try {
      const headers = { Authorization: `Bearer ${await user.getIdToken()}` };
      const [response, productResponse] = await Promise.all([fetch('/api/admin/orders', { headers, cache: 'no-store' }), fetch('/api/admin/products', { headers, cache: 'no-store' })]);
      const [result, productResult] = await Promise.all([response.json(), productResponse.json()]);
      if (!response.ok || !productResponse.ok) throw new Error(result.error || productResult.error || 'Unable to load the dashboard.');
      if (version === requestVersion.current) { setOrders(result.orders); setProducts(productResult.products); }
    } catch (e) { if (version === requestVersion.current) { setOrders([]); setError(e instanceof Error ? e.message : 'Unable to load the dashboard.'); } }
    finally { if (version === requestVersion.current) setLoading(false); }
  }, [user]);
  useEffect(() => { setOrders([]); if (user) void load(); return () => { requestVersion.current++; }; }, [user, load]);
  const displayOrders = preview ? previewOrders : orders;
  const customers = new Set(displayOrders.map(order => order.customer_uid).filter(Boolean)).size;
  const pending = displayOrders.filter(order => ['received', 'in_progress'].includes(order.fulfillment_status)).length;
  const lowStock = products.filter(product => product.active && product.stock !== null && product.stock <= product.low_stock_threshold);
  const currencies = [...new Set(displayOrders.map(order => order.currency.toLowerCase()))];
  const revenue = currencies.length ? currencies.map(currency => money(displayOrders.filter(order => order.currency.toLowerCase() === currency).reduce((sum, order) => sum + order.amount, 0), currency)).join(' / ') : money(0, 'usd');
  const metrics = [
    { label: 'Total revenue', value: revenue, note: 'Gross paid order totals; refunds not included' },
    { label: 'Orders', value: String(displayOrders.length), note: 'Paid orders' },
    { label: 'Customers', value: String(customers), note: 'Unique linked accounts with paid orders' },
    { label: 'Low inventory', value: preview ? '—' : String(lowStock.length), note: preview ? 'Sign in to see actual inventory' : `${products.filter(product => product.active && product.stock === null).length} active products have unknown stock` },
  ];
  return <main className="min-h-screen bg-background px-6 pb-24 pt-40 md:px-16"><div className="mx-auto max-w-6xl">
    <Link href="/account" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40">← My account</Link>
    <div className="mt-12 flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[0.25em] text-foreground/45">Serein administration</p><h1 className="mt-4 font-serif text-5xl text-primary md:text-7xl">Dashboard.</h1><p className="mt-4 text-sm text-foreground/55">Your store at a glance.</p></div>{user && <button onClick={() => void load()} className="text-[10px] uppercase tracking-[0.2em] text-primary underline">Refresh</button>}</div>
    {!preview && !isReady ? <p className="mt-10" role="status">Checking your account…</p> : !preview && !user ? <Link href="/auth?next=dashboard" className="mt-10 inline-block underline">Sign in to the dashboard</Link> : !preview && loading ? <p className="mt-10" role="status">Loading dashboard…</p> : !preview && error ? <div className="mt-10"><p className="text-sm text-red-900" role="alert">{error}</p>{import.meta.env.DEV && user && <p className="mt-4 break-all text-sm text-foreground/65">Signed-in Firebase user ID: {user.uid}. Staff access must be configured on the local Worker.</p>}<Link href="/account" className="mt-4 inline-block text-sm underline">Return to your account</Link></div> : <>
      <p className="mt-8 border border-foreground/10 bg-[#f9f5ee] p-4 text-sm text-foreground/65">{preview ? 'Local preview with sample data. These are not real orders or customers.' : 'Checkout currently operates in test mode. Revenue and orders below are sandbox data, not live sales.'}</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(metric => <section key={metric.label} className="border border-foreground/10 bg-[#f9f5ee] p-6"><h2 className="text-[10px] uppercase tracking-[0.18em] text-foreground/55">{metric.label}</h2><p className="mt-4 break-words font-serif text-3xl text-primary">{metric.value}</p><p className="mt-3 text-xs leading-5 text-foreground/55">{metric.note}</p></section>)}</div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_250px]"><section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Fulfillment</p><h2 className="mt-2 font-serif text-3xl text-primary">Recent orders</h2></div><Link href="/manage-orders" className="text-[10px] uppercase tracking-[0.15em] text-primary underline">Manage all orders</Link></div><p className="mt-3 text-xs leading-5 text-foreground/55">Paid orders, newest first. Older orders may not have customer details or a linked account.</p>
        {displayOrders.length ? <div className="mt-6 overflow-x-auto border border-foreground/10"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-[#f9f5ee] text-[10px] uppercase tracking-[0.15em] text-foreground/55"><tr>{['Order', 'Customer', 'Status', 'Amount'].map(label => <th key={label} className="p-4 font-normal">{label}</th>)}</tr></thead><tbody>{displayOrders.map(order => <tr key={order.session_id} className="border-t border-foreground/10"><td className="p-4"><span className="text-primary">{order.session_id.slice(-12).toUpperCase()}</span><span className="mt-1 block text-xs text-foreground/50">{orderDate(order.created_at)}</span></td><td className="max-w-[200px] break-all p-4 text-foreground/65">{order.customer_name || order.customer_email || (order.customer_uid ? `Account ${order.customer_uid}` : 'Not available')}{order.delivery_name && <span className="mt-2 block text-xs">Ship to: {order.delivery_name}</span>}{deliveryLines(order.delivery_address ?? null).map((line, index) => <span key={index} className="block text-xs">{line}</span>)}</td><td className="p-4 text-foreground/65">{steps.find(([value]) => value === order.fulfillment_status)?.[1] ?? 'Unavailable'}</td><td className="p-4 text-primary">{money(order.amount, order.currency)}</td></tr>)}</tbody></table></div> : <p className="mt-6 bg-[#f9f5ee] p-6 text-sm text-foreground/60">No paid orders yet.</p>}</section>
        <section><h2 className="font-serif text-3xl text-primary">Quick actions</h2><div className="mt-6 space-y-3"><Link href="/manage-orders?filter=pending" className="block border border-foreground/15 bg-[#f9f5ee] p-5 text-sm text-primary">Pending orders <span className="float-right">{pending} →</span></Link><Link href="/manage-products" className="block border border-foreground/15 bg-[#f9f5ee] p-5 text-sm text-primary">Add products & manage inventory →</Link>{!preview && lowStock.map(product => <p key={product.id} className="text-sm text-red-900">{product.name}: {product.stock} remaining</p>)}</div></section></div>
    </>}
  </div></main>;
}
