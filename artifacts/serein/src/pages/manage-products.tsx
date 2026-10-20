import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/auth-context';

export type ManagedProduct = { id: string; name: string; amount: number; description: string; image_url: string; stock: number | null; low_stock_threshold: number; active: number };

function ProductForm({ product, save }: { product?: ManagedProduct; save: (data: object) => Promise<void> }) {
  const editorialProduct = !!product && ['supple-oud', 'mint-moss', 'lithe-bloom', 'morrow-trio'].includes(product.id);
  const [id, setId] = useState(product?.id ?? '');
  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product ? (product.amount / 100).toFixed(2) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [stock, setStock] = useState(product?.stock == null ? '' : String(product.stock));
  const [threshold, setThreshold] = useState(String(product?.low_stock_threshold ?? 5));
  const [active, setActive] = useState(product ? !!product.active : false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const input = 'mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm';
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage('');
    if (!/^\d+(\.\d{1,2})?$/.test(price)) { setMessage('Enter a price with up to two decimal places.'); return; }
    setBusy(true);
    try { await save({ id, name, amount: Math.round(Number(price) * 100), description, imageUrl, stock: stock === '' ? null : Number(stock), previousStock: product?.stock ?? null, threshold: Number(threshold), active, create: !product }); setMessage('Saved.'); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to save.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="border border-foreground/10 bg-[#f9f5ee] p-6"><h2 className="font-serif text-2xl text-primary">{product ? product.name : 'Add a product'}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
    <label className="text-xs">Product ID <input className={input} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} disabled={!!product} value={id} onChange={e => setId(e.target.value)} placeholder="example-product" /></label>
    <label className="text-xs">Name <input className={input} required maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label>
    <label className="text-xs">Price (USD) <input className={input} required inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} /></label>
    <label className="text-xs">Stock on hand (blank means unknown) <input className={input} type="number" min="0" step="1" value={stock} onChange={e => setStock(e.target.value)} /></label>
    <label className="text-xs">Low-stock threshold <input className={input} required type="number" min="0" step="1" value={threshold} onChange={e => setThreshold(e.target.value)} /></label>
    <label className="text-xs">Image URL (HTTPS){editorialProduct && ' — editorial image is managed in the site'} <input className={input} disabled={editorialProduct} maxLength={500} value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></label>
    <label className="text-xs sm:col-span-2">Description{editorialProduct && ' — editorial copy is managed in the site'} <textarea className={input} disabled={editorialProduct} maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} /></label>
  </div><label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /> Available in the shop</label><button disabled={busy} className="mt-5 bg-primary px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : 'Save product'}</button>{message && <p role="status" className="mt-3 text-sm">{message}</p>}</form>;
}

export default function ManageProducts() {
  const { user, isReady } = useAuth();
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try { const response = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setProducts(data.products); setVersion(v => v + 1); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load products.'); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { setProducts([]); if (user) void load(); }, [user, load]);
  async function save(data: object) { if (!user) throw new Error('Please sign in again.'); const response = await fetch('/api/admin/products', { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); await load(); }
  return <main className="min-h-screen bg-background px-6 pb-24 pt-40 md:px-16"><div className="mx-auto max-w-5xl"><Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] underline">← Dashboard</Link><h1 className="mt-12 font-serif text-5xl text-primary">Products & inventory.</h1><p className="mt-4 text-sm leading-6 text-foreground/60">Enter your actual stock counts. Paid sandbox orders deduct stock automatically. Blank stock is untracked. New products start unpublished.</p><p className="mt-3 text-sm text-foreground/60">Stock is checked when checkout starts but is not reserved; simultaneous checkouts can result in a negative quantity.</p>{!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=manage-products" className="mt-8 inline-block underline">Sign in</Link> : loading ? <p className="mt-8">Loading products…</p> : error ? <p role="alert" className="mt-8 text-red-900">{error}</p> : <div className="mt-8 space-y-5"><ProductForm key={`new-${version}`} save={save} />{products.map(product => <ProductForm key={`${product.id}-${version}`} product={product} save={save} />)}</div>}</div></main>;
}
