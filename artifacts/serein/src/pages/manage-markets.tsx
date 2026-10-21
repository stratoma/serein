import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

type MarketEvent = { id: string; name: string; location: string; eventDate: string };
const blank = (): MarketEvent => ({ id: '', name: '', location: '', eventDate: '' });

export default function ManageMarkets() {
  const { user, isReady } = useAuth();
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [editing, setEditing] = useState<MarketEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const input = 'mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary';
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/markets', { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load markets.');
      setEvents(data.events);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load markets.'); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { if (user) void load(); }, [user, load]);
  async function save(event: FormEvent) {
    event.preventDefault(); if (!editing || !user) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/admin/markets', { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to save market.');
      setEditing(null); setMessage('Market saved.'); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save market.'); }
    finally { setBusy(false); }
  }
  async function remove(item: MarketEvent) {
    if (!user || !window.confirm(`Remove ${item.name}?`)) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/admin/markets', { method: 'DELETE', headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to remove market.');
      setMessage('Market removed.'); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to remove market.'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen px-6 pb-24 pt-10 md:px-10"><div className="mx-auto max-w-5xl">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Serein administration</p><h1 className="mt-3 font-serif text-5xl text-primary">Markets.</h1><p className="mt-3 text-sm text-foreground/60">Keep the market calendar current for your customers.</p></div>{user && !loading && !error && <button onClick={() => { setEditing(blank()); setMessage(''); }} className="flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground"><Plus size={17} /> Add market</button>}</div>
    {!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=manage-markets" className="mt-8 inline-block underline">Sign in</Link> : loading ? <p className="mt-8" role="status">Loading markets…</p> : error ? <p className="mt-8 text-red-900" role="alert">{error}</p> : <>
      {editing && <section className="mt-8 border border-foreground/10 bg-[#f9f5ee] p-6"><div className="flex items-start justify-between gap-4"><h2 className="font-serif text-2xl text-primary">{editing.id ? 'Edit market' : 'Add market'}</h2><button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-foreground/60"><X size={16} /> Close</button></div><form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs">Market name<input className={input} required maxLength={160} value={editing.name} onChange={event => setEditing({ ...editing, name: event.target.value })} /></label><label className="text-xs">Date<input className={input} required type="date" value={editing.eventDate} onChange={event => setEditing({ ...editing, eventDate: event.target.value })} /></label><label className="text-xs sm:col-span-2">Location<input className={input} required maxLength={240} value={editing.location} onChange={event => setEditing({ ...editing, location: event.target.value })} /></label><div className="sm:col-span-2"><button disabled={busy} className="bg-primary px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : 'Save market'}</button></div></form></section>}
      <section className="mt-8 overflow-hidden rounded-lg border border-foreground/10 bg-[#fdfbf7]"><div className="border-b border-foreground/10 p-5"><h2 className="font-serif text-2xl text-primary">Calendar events</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[580px] text-left text-sm"><thead className="bg-foreground/[0.03] text-xs text-foreground/55"><tr><th className="p-4 font-normal">Date</th><th className="p-4 font-normal">Market</th><th className="p-4 font-normal">Location</th><th className="p-4 font-normal"><span className="sr-only">Actions</span></th></tr></thead><tbody>{events.map(item => <tr key={item.id} className="border-t border-foreground/10"><td className="p-4 text-foreground/65">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${item.eventDate}T12:00:00`))}</td><td className="p-4 font-medium text-primary">{item.name}</td><td className="p-4 text-foreground/65">{item.location}</td><td className="p-4 text-right"><button onClick={() => { setEditing(item); setMessage(''); }} aria-label={`Edit ${item.name}`} className="rounded p-2 text-foreground/60 hover:bg-foreground/5"><Pencil size={17} /></button><button disabled={busy} onClick={() => void remove(item)} aria-label={`Remove ${item.name}`} className="rounded p-2 text-foreground/60 hover:bg-foreground/5"><Trash2 size={17} /></button></td></tr>)}</tbody></table>{!events.length && <p className="p-6 text-sm text-foreground/60">No market dates are scheduled yet.</p>}</div></section>
      {error && <p className="mt-4 text-sm text-red-900" role="alert">{error}</p>}{message && <p className="mt-4 text-sm text-primary" role="status">{message}</p>}
    </>}
  </div></main>;
}
