import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/context/auth-context';

type StoreSettings = {
  storeName: string;
  supportEmail: string;
  phoneNumber: string;
  streetAddress: string;
  shippingRateCents: number;
  freeShippingThresholdCents: number;
  displayTaxRateBasisPoints: number;
  transactionalFromEmail: string;
};

const initial: StoreSettings = {
  storeName: 'Serein', supportEmail: '', phoneNumber: '', streetAddress: '',
  shippingRateCents: 0, freeShippingThresholdCents: 0, displayTaxRateBasisPoints: 0, transactionalFromEmail: '',
};

function moneyInput(value: number) { return (value / 100).toFixed(2); }

export default function Settings() {
  const { user, isReady } = useAuth();
  const [settings, setSettings] = useState<StoreSettings>(initial);
  const [shippingRate, setShippingRate] = useState('0.00');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('0.00');
  const [taxRate, setTaxRate] = useState('0');
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const input = 'mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm outline-none focus:border-primary';

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load settings.');
      const next = data.settings as StoreSettings;
      setSettings(next);
      setShippingRate(moneyInput(next.shippingRateCents));
      setFreeShippingThreshold(moneyInput(next.freeShippingThresholdCents));
      setTaxRate((next.displayTaxRateBasisPoints / 100).toString());
      setHasLoaded(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load settings.'); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (user) void load(); }, [user, load]);
  function change<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) { setSettings(current => ({ ...current, [key]: value })); }

  async function save(event: FormEvent) {
    event.preventDefault(); setMessage(''); setError('');
    const shipping = Number(shippingRate);
    const threshold = Number(freeShippingThreshold);
    const tax = Number(taxRate);
    if (![shipping, threshold, tax].every(Number.isFinite) || shipping < 0 || threshold < 0 || tax < 0 || tax > 100 || !/^\d+(\.\d{1,2})?$/.test(shippingRate) || !/^\d+(\.\d{1,2})?$/.test(freeShippingThreshold) || !/^\d+(\.\d{1,2})?$/.test(taxRate)) {
      setError('Enter valid non-negative dollar amounts and a tax rate from 0 to 100.'); return;
    }
    if (!user) return;
    setBusy(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, shippingRateCents: Math.round(shipping * 100), freeShippingThresholdCents: Math.round(threshold * 100), displayTaxRateBasisPoints: Math.round(tax * 100) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save settings.');
      setMessage('Settings saved.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save settings.'); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen px-6 pb-24 pt-10 md:px-10"><div className="mx-auto max-w-4xl">
    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Serein administration</p>
    <h1 className="mt-3 font-serif text-5xl text-primary">Settings.</h1>
    <p className="mt-3 text-sm text-foreground/60">Manage your store configuration.</p>
    {!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=settings" className="mt-8 inline-block underline">Sign in</Link> : loading ? <p className="mt-8" role="status">Loading settings…</p> : error && !hasLoaded ? <p className="mt-8 text-red-900" role="alert">{error}</p> : <form onSubmit={save} className="mt-8 space-y-5">
      <section className="rounded-xl border border-foreground/15 bg-[#fdfbf7] p-5 shadow-sm md:p-6"><h2 className="text-sm font-semibold">General information</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs">Store name<input className={input} required maxLength={120} value={settings.storeName} onChange={event => change('storeName', event.target.value)} /></label>
        <label className="text-xs">Support email<input className={input} type="email" maxLength={254} value={settings.supportEmail} onChange={event => change('supportEmail', event.target.value)} /></label>
        <label className="text-xs sm:col-span-2">Phone number<input className={input} maxLength={64} value={settings.phoneNumber} onChange={event => change('phoneNumber', event.target.value)} /></label>
      </div></section>
      <section className="rounded-xl border border-foreground/15 bg-[#fdfbf7] p-5 shadow-sm md:p-6"><h2 className="text-sm font-semibold">Business address</h2><label className="mt-5 block text-xs">Street address<input className={input} maxLength={300} value={settings.streetAddress} onChange={event => change('streetAddress', event.target.value)} /></label></section>
      <section className="rounded-xl border border-foreground/15 bg-[#fdfbf7] p-5 shadow-sm md:p-6"><h2 className="text-sm font-semibold">Shipping</h2><p className="mt-1 text-xs text-foreground/60">Configure shipping rates for customer orders.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs">Standard shipping rate (USD)<input className={input} inputMode="decimal" value={shippingRate} onChange={event => setShippingRate(event.target.value)} /></label>
        <label className="text-xs">Free shipping threshold (USD)<input className={input} inputMode="decimal" value={freeShippingThreshold} onChange={event => setFreeShippingThreshold(event.target.value)} /><span className="mt-2 block text-[11px] text-foreground/55">Orders above this amount get free shipping. Set to 0 to disable.</span></label>
      </div></section>
      <section className="rounded-xl border border-foreground/15 bg-[#fdfbf7] p-5 shadow-sm md:p-6"><h2 className="text-sm font-semibold">Tax</h2><p className="mt-1 text-xs text-foreground/60">Tax collection is handled by Stripe. This rate is for display purposes only.</p><label className="mt-5 block max-w-sm text-xs">Display tax rate (%)<input className={input} inputMode="decimal" value={taxRate} onChange={event => setTaxRate(event.target.value)} /><span className="mt-2 block text-[11px] text-foreground/55">Set to 0 if taxes are collected automatically by Stripe Tax.</span></label></section>
      <section className="rounded-xl border border-foreground/15 bg-[#fdfbf7] p-5 shadow-sm md:p-6"><h2 className="text-sm font-semibold">Transactional email</h2><p className="mt-1 text-xs text-foreground/60">Use a verified sender address. This display value does not change the Worker’s configured sending address.</p><label className="mt-5 block text-xs">From email (display)<input className={input} type="email" maxLength={254} value={settings.transactionalFromEmail} onChange={event => change('transactionalFromEmail', event.target.value)} /></label></section>
      {error && <p className="text-sm text-red-900" role="alert">{error}</p>}{message && <p className="text-sm text-primary" role="status">{message}</p>}
      <button disabled={busy} className="bg-primary px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : 'Save settings'}</button>
    </form>}
  </div></main>;
}
