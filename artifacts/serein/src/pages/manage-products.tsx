import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/auth-context';
import { products as editorialProducts } from '@/data/products';
import { ImageOff, Pencil, Plus, Search, X } from 'lucide-react';

export type ManagedProduct = { id: string; name: string; amount: number; description: string; image_url: string; stock: number | null; low_stock_threshold: number; active: number };

async function prepareImage(file: File): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  if (file.size > 20 * 1024 * 1024) throw new Error('The picture is larger than 20 MB. Choose a smaller file.');
  if (file.size <= 512 * 1024) return file;
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Unable to read this picture.')); image.src = url; });
    let scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    for (let attempt = 0; attempt < 8; attempt++) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Unable to resize this picture in your browser.');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
      if (!blob || blob.type !== 'image/webp') throw new Error('Your browser cannot resize this picture. Please choose an image smaller than 512 KB.');
      if (blob.size <= 512 * 1024) return blob;
      scale *= 0.75;
    }
    throw new Error('Unable to reduce this picture enough. Please choose a smaller image.');
  } finally { URL.revokeObjectURL(url); }
}

function ProductForm({ product, save, upload }: { product?: ManagedProduct; save: (data: object) => Promise<void>; upload: (file: File) => Promise<string> }) {
  const editorialProduct = !!product && ['supple-oud', 'mint-moss', 'lithe-bloom', 'morrow-trio'].includes(product.id);
  const [id, setId] = useState(product?.id ?? '');
  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product ? (product.amount / 100).toFixed(2) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    try { const savedImageUrl = imageFile ? await upload(imageFile) : imageUrl; if (imageFile) { setImageUrl(savedImageUrl); setImageFile(null); } await save({ id, name, amount: Math.round(Number(price) * 100), description, imageUrl: savedImageUrl, stock: stock === '' ? null : Number(stock), previousStock: product?.stock ?? null, threshold: Number(threshold), active, create: !product }); setMessage('Saved.'); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to save.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="border border-foreground/10 bg-[#f9f5ee] p-6"><h2 className="font-serif text-2xl text-primary">{product ? product.name : 'Add a product'}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
    <label className="text-xs">Product ID <input className={input} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} disabled={!!product} value={id} onChange={e => setId(e.target.value)} placeholder="example-product" /></label>
    <label className="text-xs">Name <input className={input} required maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label>
    <label className="text-xs">Price (USD) <input className={input} required inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} /></label>
    <label className="text-xs">Stock on hand (blank means unknown) <input className={input} type="number" min="0" step="1" value={stock} onChange={e => setStock(e.target.value)} /></label>
    <label className="text-xs">Low-stock threshold <input className={input} required type="number" min="0" step="1" value={threshold} onChange={e => setThreshold(e.target.value)} /></label>
    <label className="text-xs">Product picture (JPEG, PNG or WebP; larger images are resized automatically) <input className={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setImageFile(e.target.files?.[0] ?? null)} /></label>
    <label className="text-xs sm:col-span-2">Image URL (optional, HTTPS) <input className={input} maxLength={500} value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></label>
    <label className="text-xs sm:col-span-2">Description{editorialProduct && ' — editorial copy is managed in the site'} <textarea className={input} disabled={editorialProduct} maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} /></label>
  </div><label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /> Available in the shop</label><button disabled={busy} className="mt-5 bg-primary px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : 'Save product'}</button>{message && <p role="status" className="mt-3 text-sm">{message}</p>}</form>;
}

export default function ManageProducts() {
  const { user, isReady } = useAuth();
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'out'>('all');
  const [editing, setEditing] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try { const response = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setProducts(data.products); setVersion(v => v + 1); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load products.'); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { setProducts([]); if (user) void load(); }, [user, load]);
  async function save(data: object) { if (!user) throw new Error('Please sign in again.'); const response = await fetch('/api/admin/products', { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); await load(); setEditing(null); }
  async function upload(file: File) {
    if (!user) throw new Error('Please sign in again.');
    const image = await prepareImage(file);
    const encoded = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(new Error('Unable to read the image.')); reader.readAsDataURL(image); });
    const response = await fetch('/api/admin/product-images', { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ mime: image.type, data: encoded }) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to upload the image.'); return result.url as string;
  }
  const visible = products.filter(product => {
    const matchesSearch = `${product.name} ${product.id}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (filter === 'all' || (filter === 'active' && !!product.active) || (filter === 'draft' && !product.active) || (filter === 'out' && product.stock !== null && product.stock <= 0));
  });
  const selected = products.find(product => product.id === editing);
  return <main className="min-h-screen px-6 pb-24 pt-10 md:px-10"><div className="mx-auto max-w-7xl">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Serein administration</p><h1 className="mt-3 font-serif text-5xl text-primary">Products.</h1><p className="mt-3 text-sm text-foreground/60">Manage your product catalog and inventory.</p></div>{user && !loading && !error && <button onClick={() => setEditing('new')} className="flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground"><Plus size={17} /> Add product</button>}</div>
    <p className="mt-5 text-xs leading-5 text-foreground/55">Blank stock is untracked. Paid sandbox orders deduct stock automatically; stock is not reserved during checkout.</p>
    {!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=manage-products" className="mt-8 inline-block underline">Sign in</Link> : loading ? <p className="mt-8" role="status">Loading products…</p> : error ? <p role="alert" className="mt-8 text-red-900">{error}</p> : <>
      {editing && <section className="mt-8" aria-label={editing === 'new' ? 'Add product' : 'Edit product'}><div className="mb-3 flex justify-end"><button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-foreground/60"><X size={16} /> Close</button></div><ProductForm key={`${editing}-${version}`} product={selected} save={save} upload={upload} /></section>}
      <div className="mt-8 overflow-hidden rounded-lg border border-foreground/10 bg-[#fdfbf7]"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 p-4"><label className="flex min-w-[220px] flex-1 items-center gap-2 rounded border border-foreground/20 px-3 py-2 sm:max-w-sm"><Search size={17} className="text-foreground/50" /><span className="sr-only">Search products</span><input className="w-full bg-transparent text-sm outline-none" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></label><div className="flex flex-wrap gap-2" aria-label="Filter products">{([['all', 'All'], ['active', 'Active'], ['draft', 'Draft'], ['out', 'Out of stock']] as const).map(([value, label]) => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded border px-3 py-2 text-xs ${filter === value ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 text-foreground/75'}`}>{label}</button>)}</div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-foreground/[0.03] text-xs text-foreground/55"><tr><th className="p-4 font-normal">Image</th><th className="p-4 font-normal">Product</th><th className="p-4 font-normal">Status</th><th className="p-4 font-normal">Price</th><th className="p-4 font-normal">Stock</th><th className="p-4 font-normal"><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map(product => { const image = product.image_url || editorialProducts.find(item => item.id === product.id)?.img; return <tr key={product.id} className="border-t border-foreground/10"><td className="p-4">{image ? <img src={image} alt="" className="h-12 w-12 rounded object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded bg-foreground/5 text-foreground/35"><ImageOff size={18} /></span>}</td><td className="p-4 font-medium text-primary">{product.name}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs ${product.active ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-foreground/70'}`}>{product.active ? 'Active' : 'Draft'}</span></td><td className="p-4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.amount / 100)}</td><td className={`p-4 ${product.stock !== null && product.stock <= product.low_stock_threshold ? 'text-red-700' : 'text-foreground/70'}`}>{product.stock === null ? 'Unknown' : product.stock}</td><td className="p-4 text-right"><button onClick={() => { setEditing(product.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label={`Edit ${product.name}`} className="rounded p-2 text-foreground/60 hover:bg-foreground/5 hover:text-primary"><Pencil size={17} /></button></td></tr>; })}</tbody></table>{!visible.length && <p className="p-6 text-sm text-foreground/60">No products match your search and filters.</p>}</div>
      </div>
    </>}
  </div></main>;
}
