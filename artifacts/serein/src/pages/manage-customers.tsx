import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/auth-context';
import { orderDate, steps, type Order } from './account';
import type { AdminDelivery } from '@/data/order-delivery';

type CustomerOrder = Order & AdminDelivery & { customer_uid: string | null };
type Customer = { key: string; uid: string | null; name: string | null; email: string | null; orders: CustomerOrder[] };

function groupOrders(orders: CustomerOrder[]) {
  const customers = new Map<string, Customer>();
  let unidentified = 0;
  for (const order of orders) {
    const email = order.customer_email?.trim() || null;
    const uid = order.customer_uid || null;
    const key = uid ? `account:${uid}` : email ? `guest:${email.toLowerCase()}` : null;
    if (!key) { unidentified++; continue; }
    const customer = customers.get(key) ?? { key, uid, name: null, email: null, orders: [] };
    customer.name ||= order.customer_name || order.delivery_name || null;
    customer.email ||= email;
    customer.orders.push(order);
    customers.set(key, customer);
  }
  return { customers: [...customers.values()], unidentified };
}

function totals(orders: CustomerOrder[]) {
  const amounts = new Map<string, number>();
  for (const order of orders) amounts.set(order.currency.toUpperCase(), (amounts.get(order.currency.toUpperCase()) ?? 0) + order.amount);
  return [...amounts].map(([currency, amount]) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount / 100)).join(' · ');
}

export default function ManageCustomers() {
  const { user, isReady } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load customers.');
      setOrders(result.orders);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load customers.'); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { setOrders([]); if (user) void load(); }, [user, load]);
  const { customers, unidentified } = useMemo(() => groupOrders(orders), [orders]);
  const visible = customers.filter(customer => [customer.name, customer.email, customer.uid].some(value => value?.toLowerCase().includes(search.trim().toLowerCase())));
  const detail = customers.find(customer => customer.key === selected);
  return <main className="min-h-screen px-6 pb-24 pt-10 md:px-10"><div className="mx-auto max-w-7xl">
    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Serein administration</p><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="mt-3 font-serif text-5xl text-primary">Customers.</h1><p className="mt-3 text-sm text-foreground/60">View customers and their paid order history.</p></div>{user && !loading && !error && <p className="text-sm text-foreground/60">{customers.length} {customers.length === 1 ? 'customer' : 'customers'}</p>}</div>
    <p className="mt-5 text-xs leading-5 text-foreground/55">Based on paid orders. Registered accounts without orders and signup dates are not available here. Guest orders are grouped by email; guest and account orders are kept separate. Checkout is currently in test mode.{unidentified > 0 && ` ${unidentified} paid ${unidentified === 1 ? 'order has' : 'orders have'} no account or email and cannot be assigned to a customer.`}</p>
    {!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=manage-customers" className="mt-8 inline-block underline">Sign in</Link> : loading ? <p className="mt-8">Loading customers…</p> : error ? <p role="alert" className="mt-8 text-sm text-red-900">{error}</p> : detail ? <section className="mt-8"><button onClick={() => setSelected(null)} className="mb-5 border border-primary px-5 py-3 text-xs text-primary hover:bg-primary hover:text-primary-foreground">← Back to customers</button><div className="border border-foreground/10 bg-[#f9f5ee] p-6"><h2 className="font-serif text-2xl text-primary">{detail.name || detail.email || 'Name unavailable'}</h2>{detail.email && <p className="mt-2 break-all text-sm text-foreground/60">{detail.email}</p>}<p className="mt-2 text-xs text-foreground/55">{detail.uid ? 'Linked account' : 'Guest'} · {detail.orders.length} paid {detail.orders.length === 1 ? 'order' : 'orders'} · {totals(detail.orders)}</p><h3 className="mt-8 font-serif text-xl">Order history</h3><div className="mt-4 divide-y divide-foreground/10">{detail.orders.map(order => <div key={order.session_id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><div><a className="text-primary underline underline-offset-4" href={`/manage-orders?order=${encodeURIComponent(order.session_id)}&from=orders`}>Order {order.session_id.slice(-12).toUpperCase()}</a><p className="mt-1 text-xs text-foreground/55">{orderDate(order.created_at)} · {steps.find(([value]) => value === order.fulfillment_status)?.[1] ?? 'Unavailable'}</p></div><span>{totals([order])}</span></div>)}</div></div></section> : <div className="mt-8 overflow-hidden rounded-lg border border-foreground/10 bg-[#fdfbf7]"><div className="border-b border-foreground/10 p-4"><label className="flex max-w-sm items-center gap-2 rounded border border-foreground/20 px-3 py-2"><Search size={17} className="text-foreground/50" /><span className="sr-only">Search customers</span><input className="w-full bg-transparent text-sm outline-none" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-foreground/[0.03] text-xs text-foreground/55"><tr>{['Name / Email', 'Orders', 'Total spent', 'Last order', 'Joined'].map(label => <th key={label} className="p-4 font-normal">{label}</th>)}<th className="p-4"><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map(customer => <tr key={customer.key} className="border-t border-foreground/10"><td className="p-4"><span className="font-medium text-primary">{customer.name || customer.email || 'Name unavailable'}</span> <span className="rounded bg-foreground/5 px-2 py-1 text-xs text-foreground/60">{customer.uid ? 'Linked account' : 'Guest'}</span>{customer.email && customer.email !== customer.name && <span className="mt-1 block break-all text-xs text-foreground/55">{customer.email}</span>}</td><td className="p-4">{customer.orders.length}</td><td className="p-4">{totals(customer.orders)}</td><td className="p-4 text-foreground/60">{orderDate(customer.orders[0].created_at)}</td><td className="p-4 text-foreground/55">{customer.uid ? 'Unavailable' : 'Guest'}</td><td className="p-4 text-right"><button onClick={() => setSelected(customer.key)} aria-label={`View ${customer.name || customer.email || 'customer'} order history`} className="text-primary underline underline-offset-4">View</button></td></tr>)}</tbody></table>{!visible.length && <p className="p-6 text-sm text-foreground/60">{customers.length ? 'No customers match your search.' : 'No identifiable customers with paid orders yet.'}</p>}</div></div>}
  </div></main>;
}
