import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/auth-context';
import { getProductById } from '@/data/products';

export type Order = { session_id: string; amount: number; currency: string; items: string; created_at: string; fulfillment_status: string; tracking_carrier: string | null; tracking_number: string | null; tracking_url: string | null; fulfillment_updated_at: string | null };
export const steps = [ ['received', 'Received'], ['in_progress', 'In progress'], ['shipped', 'Shipped'], ['delivered', 'Delivered'] ] as const;
export function orderItems(value: string) {
  try {
    const items = JSON.parse(value) as { id: string; quantity: number }[];
    return items.map(item => `${item.id === 'morrow-trio' ? 'The Morrow Trio' : getProductById(item.id)?.name ?? item.id} × ${item.quantity}`).join(', ');
  } catch { return 'Order details unavailable'; }
}
export function orderDate(value: string) {
  const date = new Date(value.replace(' ', 'T') + (value.includes('T') ? '' : 'Z'));
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
export function OrderCard({ order }: { order: Order }) {
  const index = steps.findIndex(([value]) => value === order.fulfillment_status);
  let trackingUrl: string | null = null;
  try { if (order.tracking_url && new URL(order.tracking_url).protocol === 'https:') trackingUrl = order.tracking_url; } catch { /* Invalid stored URLs are not rendered. */ }
  return <article className="border border-foreground/10 bg-[#f9f5ee] p-6 md:p-8">
    <div className="flex flex-wrap justify-between gap-4 border-b border-foreground/10 pb-6"><div><p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Order {order.session_id.slice(-12).toUpperCase()}</p><p className="mt-2 text-sm text-foreground/60">{orderDate(order.created_at)}</p></div><div className="md:text-right"><p className="font-serif text-xl text-primary">{new Intl.NumberFormat(undefined, { style: 'currency', currency: order.currency.toUpperCase() }).format(order.amount / 100)}</p><p className="mt-1 text-xs text-foreground/55">{index >= 0 ? steps[index][1] : 'Status unavailable'}</p></div></div>
    <p className="mt-6 text-sm leading-7 text-foreground/70">{orderItems(order.items)}</p>
    <ol aria-label="Order progress" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{steps.map(([value, label], i) => <li key={value} className={`border-t-2 pt-3 text-[10px] uppercase tracking-[0.13em] ${i <= index ? 'border-primary text-primary' : 'border-foreground/15 text-foreground/40'}`} aria-current={i === index ? 'step' : undefined}>{label}</li>)}</ol>
    {(order.tracking_carrier || order.tracking_number || trackingUrl) && <div className="mt-7 border-t border-foreground/10 pt-5 text-sm leading-7 text-foreground/65"><p>{[order.tracking_carrier, order.tracking_number].filter(Boolean).join(' · ')}</p>{trackingUrl && <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-block border-b border-primary/30 text-primary">Track shipment ↗</a>}</div>}
    {index < 2 && !order.tracking_number && <p className="mt-6 text-sm text-foreground/50">Tracking details will appear here when available.</p>}
  </article>;
}
export default function Account() {
  const { user, isReady, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const load = useCallback(async () => {
    if (!user) return;
    const version = ++requestVersion.current;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/account/orders', { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (version === requestVersion.current) setOrders(result.orders);
    } catch (e) { if (version === requestVersion.current) setError(e instanceof Error ? e.message : 'Unable to load your orders.'); }
    finally { if (version === requestVersion.current) setLoading(false); }
  }, [user]);
  useEffect(() => { setOrders([]); if (user) void load(); return () => { requestVersion.current++; }; }, [user, load]);
  return <main className="min-h-screen bg-background px-8 pb-24 pt-40 md:px-16"><div className="mx-auto max-w-5xl">
    <Link href="/" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 hover:text-primary">← Back to Serein</Link>
    {!isReady ? <p className="mt-12 text-sm text-foreground/55">Checking your account…</p> : !user ? <div className="mt-16"><h1 className="font-serif text-5xl text-primary">Your account.</h1><p className="mt-5 text-sm text-foreground/60">Sign in to see your orders.</p><Link href="/auth" className="mt-8 inline-block bg-primary px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-primary-foreground">Sign in</Link></div> : <>
      <div className="mt-14 flex flex-wrap items-end justify-between gap-6 border-b border-foreground/10 pb-9"><div><p className="text-[10px] uppercase tracking-[0.25em] text-foreground/45">Your Serein account</p><h1 className="mt-4 font-serif text-5xl text-primary md:text-7xl">Your orders.</h1><p className="mt-4 break-all text-sm text-foreground/55">{user.email}</p></div><button onClick={() => void signOut()} className="border-b border-primary/30 pb-1 text-[10px] uppercase tracking-[0.2em] text-primary">Sign out</button></div>
      <div className="mt-10 flex items-center justify-between"><h2 className="font-serif text-3xl text-primary">Order history</h2><button onClick={() => void load()} className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 underline">Refresh</button></div>
      {loading ? <p className="mt-8 text-sm text-foreground/55" role="status">Loading your orders…</p> : error ? <p className="mt-8 text-sm text-red-900" role="alert">{error}</p> : orders.length ? <div className="mt-8 space-y-5">{orders.map(order => <OrderCard key={order.session_id} order={order} />)}</div> : <div className="mt-8 bg-[#f9f5ee] p-8"><p className="font-serif text-2xl text-primary">Nothing here yet.</p><p className="mt-3 text-sm leading-7 text-foreground/55">Orders placed while signed in will appear here. Guest orders and orders placed before account tracking was added are not linked automatically.</p><Link href="/#collection" className="mt-6 inline-block border-b border-primary/30 pb-1 text-[10px] uppercase tracking-[0.2em] text-primary">Explore the collection</Link></div>}
    </>}
  </div></main>;
}
