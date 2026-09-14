import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);
  const sessionId = new URLSearchParams(window.location.search).get("session_id");
  const canceled = new URLSearchParams(window.location.search).has("canceled");
  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    async function check() {
      try {
        const response = await fetch('/api/stripe/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, token: sessionStorage.getItem('serein-checkout-token') }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (stopped) return;
        setStatus(data.status);
        if (typeof data.amount === 'number') setConfirmedTotal(data.amount / 100);
        if (data.status === 'pending' && ++attempts < 30) timer = setTimeout(check, 2000);
      } catch (e) { if (!stopped) setError(e instanceof Error ? e.message : 'Unable to confirm payment.'); }
    }
    void check();
    return () => { stopped = true; clearTimeout(timer); };
  }, [sessionId]);
  useEffect(() => {
    if (status === 'paid') clearCart();
  }, [status]);
  async function pay() {
    setBusy(true); setError("");
    try {
      const token = sessionStorage.getItem('serein-checkout-token') || crypto.randomUUID();
      sessionStorage.setItem('serein-checkout-token', token);
      const response = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, items: items.map(({ id, quantity }) => ({ id, quantity })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const destination = new URL(data.url);
      if (destination.protocol !== 'https:' || destination.hostname !== 'checkout.stripe.com') throw new Error('Invalid checkout destination');
      window.location.assign(destination.href);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to start checkout.'); setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-background px-8 pb-24 pt-40 md:px-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/#collection" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 hover:text-primary">← Continue shopping</Link>
        <div className="mt-12 grid gap-16 md:grid-cols-[1fr_0.7fr]">
          <section>
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Checkout</span>
            <h1 className="mt-5 font-serif text-5xl leading-none text-primary md:text-7xl">Make it yours.</h1>
            {sessionId && status === 'paid' && <div role="status" className="mt-8 border-y border-foreground/10 py-8"><p className="text-[10px] uppercase tracking-[0.25em] text-foreground/45">Order confirmed</p><p className="mt-3 font-serif text-2xl text-primary">Thank you. Your order is complete.</p><p className="mt-3 text-sm text-foreground/55">Order reference {sessionId.slice(-12).toUpperCase()}</p><p className="mt-2 text-xs text-foreground/45">Sandbox order — Stripe processed the full test transaction, but no money was charged and no package will ship.</p></div>}
            {sessionId && status !== 'paid' && <p role="status" className="mt-8 text-lg text-primary">{status === 'failed' || status === 'expired' ? 'This payment did not complete. Return to checkout to try again.' : 'Confirming your order. This can take a moment.'}</p>}
            {canceled && <p role="status" className="mt-8 text-primary">Checkout canceled. Your cart is still here.</p>}
            {items.length === 0 && status !== 'paid' ? (
              <div className="mt-12 border-t border-foreground/10 pt-8">
                <p className="font-serif italic text-xl text-foreground/55">Your cart is empty.</p>
                <Link href="/#collection" className="mt-6 inline-block text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1">Explore the collection</Link>
              </div>
            ) : (
              <div className="mt-12 border-t border-foreground/10">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 border-b border-foreground/10 py-6">
                    <div><p className="font-serif text-xl text-primary">{item.name}</p><p className="mt-1 text-xs text-foreground/45">Quantity {item.quantity}</p></div>
                    <span className="text-sm text-foreground/55">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
          <aside className="self-start bg-[#f5efe6] p-8 md:p-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Order summary</p>
            <div className="mt-8 flex justify-between border-t border-foreground/10 pt-5 font-serif text-2xl text-primary"><span>{status === 'paid' ? 'Total paid' : 'Subtotal'}</span><span>{formatPrice(status === 'paid' && confirmedTotal !== null ? confirmedTotal : subtotal)}</span></div>
            <p className="mt-5 text-sm leading-relaxed text-foreground/60">Complete the full order in Stripe’s sandbox with card 4242 4242 4242 4242, any future expiry, and any three-digit CVC. Billing, delivery, contact details, and payment confirmation work like a live order.</p>
            {error && <p role="alert" className="mt-5 text-sm text-red-800">{error}</p>}
            {sessionId ? <Link href="/#collection" className="mt-8 inline-block text-primary underline" onClick={() => sessionStorage.removeItem('serein-checkout-token')}>Continue shopping</Link> : <button type="button" disabled={busy || !items.length} onClick={pay} className="mt-8 w-full bg-primary px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-40">{busy ? 'Opening secure checkout…' : 'Place sandbox order'}</button>}
          </aside>
        </div>
      </div>
    </main>
  );
}
