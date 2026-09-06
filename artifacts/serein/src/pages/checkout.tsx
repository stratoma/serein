import { Link } from "wouter";
import { useCart } from "@/context/cart-context";

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export default function Checkout() {
  const { items, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-background px-8 pb-24 pt-40 md:px-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/#collection" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 hover:text-primary">← Continue shopping</Link>
        <div className="mt-12 grid gap-16 md:grid-cols-[1fr_0.7fr]">
          <section>
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Checkout</span>
            <h1 className="mt-5 font-serif text-5xl leading-none text-primary md:text-7xl">Make it yours.</h1>
            {items.length === 0 ? (
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
            <div className="mt-8 flex justify-between border-t border-foreground/10 pt-5 font-serif text-2xl text-primary"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <p className="mt-5 text-sm leading-relaxed text-foreground/50">Checkout is currently being connected to Serein’s fulfillment partner. Your cart is saved locally while that final step is completed.</p>
            <button type="button" disabled className="mt-8 w-full cursor-not-allowed bg-primary/40 px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-primary-foreground">Checkout coming soon</button>
          </aside>
        </div>
      </div>
    </main>
  );
}
