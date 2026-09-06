import { Link } from "wouter";
import type { ReactNode } from "react";

export function Privacy() {
  return <PolicyLayout eyebrow="Privacy" title="A quiet commitment to your privacy."><p>We only collect information needed to respond to you, fulfill an order, or send the Serein notes you request. We do not sell personal information.</p><p>If you join the list, you can unsubscribe at any time. For questions about your information, contact Serein directly.</p></PolicyLayout>;
}

export function Shipping() {
  return <PolicyLayout eyebrow="Shipping" title="Care, all the way to your door."><p>Shipping timing, delivery regions, and rates are confirmed at checkout. Orders are packed in small batches and you receive tracking when your ritual is on its way.</p><p>If an order arrives damaged or does not arrive as expected, contact Serein so we can make it right.</p></PolicyLayout>;
}

function PolicyLayout({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <main className="min-h-screen bg-background px-8 pb-24 pt-40 md:px-16"><div className="mx-auto max-w-3xl"><Link href="/" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 hover:text-primary">← Back to Serein</Link><span className="mt-16 block text-[10px] uppercase tracking-[0.25em] text-foreground/40">{eyebrow}</span><h1 className="mt-5 font-serif text-5xl leading-none text-primary md:text-7xl">{title}</h1><div className="mt-12 space-y-7 border-t border-foreground/10 pt-10 text-base leading-loose text-foreground/60">{children}</div></div></main>;
}
