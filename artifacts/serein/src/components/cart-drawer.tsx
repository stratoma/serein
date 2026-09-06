import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/cart-context";

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/35"
        onClick={() => setIsOpen(false)}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-background text-foreground shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Your ritual</p>
            <h2 id="cart-title" className="mt-1 font-serif text-2xl text-primary">Cart ({itemCount})</h2>
          </div>
          <button type="button" aria-label="Close cart" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-foreground/50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-5 h-8 w-8 text-foreground/25" strokeWidth={1.25} />
              <p className="font-serif italic text-lg text-foreground/55">Your cart is quiet.</p>
              <Link href="/#collection" onClick={() => setIsOpen(false)} className="mt-5 text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1">Explore the collection</Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-foreground/10 pb-6">
                  {item.image && <img src={item.image} alt="" className="h-20 w-16 object-cover" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3">
                      <h3 className="font-serif text-lg text-primary">{item.name}</h3>
                      <span className="text-sm text-foreground/55">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-foreground/15">
                        <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-foreground/50 hover:text-primary"><Minus className="h-3 w-3" /></button>
                        <span className="min-w-8 text-center text-xs" aria-label={`${item.quantity} in cart`}>{item.quantity}</span>
                        <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-foreground/50 hover:text-primary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="text-[9px] uppercase tracking-[0.2em] text-foreground/35 hover:text-primary">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-foreground/10 px-6 py-6">
            <div className="mb-4 flex justify-between font-serif text-xl text-primary"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <p className="mb-5 text-xs leading-relaxed text-foreground/45">Shipping and taxes are calculated at checkout. Your order is not reserved until checkout is complete.</p>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="block w-full bg-primary px-6 py-4 text-center text-[10px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90">Continue to checkout</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
