import { Link } from "wouter";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { products } from "@/data/products";

const BASE = import.meta.env.BASE_URL;

export default function MorrowTrio() {
  return (
    <main className="w-full bg-background overflow-hidden">

      {/* HERO */}
      <section className="relative h-[100dvh] overflow-hidden flex items-end">
        <motion.div
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={`${BASE}images/product-trio.png`}
            alt="The Morrow Trio — three travel-sized body butters"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
        </motion.div>

        <div className="relative z-10 w-full px-8 md:px-16 pb-16 md:pb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <FadeIn delay={0.2} direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-sans block mb-3">
              The Morrow Trio
            </span>
            <h1 className="text-[clamp(3rem,11vw,9rem)] font-serif text-[#F3EBDD] leading-none tracking-tight">
              Your ritual,<br />wherever you are.
            </h1>
          </FadeIn>
          <FadeIn delay={0.45} direction="none" className="md:text-right max-w-xs">
            <p className="font-serif italic text-[#F3EBDD]/70 text-lg md:text-xl leading-relaxed">
              Three rituals. One discovery.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="px-8 md:px-16 pt-10">
        <Link
          href="/#collection"
          className="text-[9px] uppercase tracking-[0.25em] text-foreground/35 hover:text-primary transition-colors duration-300 font-sans"
        >
          ← The Collection
        </Link>
      </div>

      {/* INTRODUCTION */}
      <section className="py-24 md:py-36 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-8">
              Start Here
            </span>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-serif text-primary leading-none">
              All three.<br />Together.
            </h2>
          </FadeIn>
          <FadeIn direction="none" delay={0.2}>
            <div className="flex flex-col gap-7 md:pt-24">
              <p className="font-serif italic text-foreground/60 text-lg md:text-xl leading-relaxed">
                The Morrow Trio is how most people find their scent. Three travel-sized butters, each one a different ritual — so you can discover which one becomes yours.
              </p>
              <p className="font-serif italic text-foreground/50 text-base md:text-lg leading-relaxed">
                Carry all three. Layer them. Take your time. There is no wrong way to begin a ritual.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* THE THREE SCENTS */}
      <section className="py-10 md:py-14 bg-primary text-primary-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/40 font-sans block mb-12">
              What's Inside
            </span>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/10">
            {products.map((product, i) => (
              <FadeIn key={product.id} direction="none" delay={i * 0.15}>
                <div className="py-14 md:py-20 px-0 md:px-12 first:pl-0 last:pr-0 flex flex-col gap-6">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/30 font-sans">
                    {product.pillar}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl text-primary-foreground leading-none">
                    {product.name}
                  </h3>
                  <p className="font-serif italic text-primary-foreground/50 text-base leading-relaxed">
                    {product.scent}
                  </p>
                  <Link
                    href={`/collection/${product.id}`}
                    className="text-[9px] uppercase tracking-[0.2em] text-primary-foreground/40 border-b border-primary-foreground/15 pb-0.5 hover:text-primary-foreground hover:border-primary-foreground/40 transition-all duration-300 font-sans self-start"
                  >
                    Full Story →
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTOGRAPHY — three product images */}
      <section className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-16">
              The Scents
            </span>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, i) => (
              <FadeIn key={product.id} direction="none" delay={i * 0.15}>
                <Link href={`/collection/${product.id}`} className="group block">
                  <div className="overflow-hidden mb-5">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/35 font-sans mb-2">
                    {product.pillar}
                  </p>
                  <h3 className="font-serif text-xl text-primary mb-1">{product.name}</h3>
                  <p className="font-serif italic text-foreground/45 text-sm leading-relaxed">
                    {product.scent}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT TRAVELS */}
      <section className="py-28 md:py-40 bg-[#e9dfd0] px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-28">
          <FadeIn direction="none" className="w-full md:w-1/2">
            <div className="aspect-square overflow-hidden">
              <img
                src={`${BASE}images/product-trio.png`}
                alt="The Morrow Trio packaging"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-foreground/35 font-sans">
              Thoughtfully packaged.
            </p>
          </FadeIn>
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <FadeIn direction="none" delay={0.1}>
              <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans">
                Designed for Travel
              </span>
            </FadeIn>
            <FadeIn direction="none" delay={0.2}>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-serif text-primary leading-none">
                Ritual doesn't<br />have a destination.
              </h2>
            </FadeIn>
            <FadeIn direction="none" delay={0.3}>
              <p className="font-serif italic text-foreground/60 text-lg leading-relaxed max-w-[34ch]">
                Each butter in the Trio is travel-sized — small enough for a carry-on, generous enough to last through the trip.
              </p>
            </FadeIn>
            <FadeIn direction="none" delay={0.4}>
              <p className="text-foreground/45 text-sm leading-loose max-w-[38ch]">
                We packaged them together so you could keep all three on the bathroom shelf, rotate through your moods, or give them as an introduction to someone who hasn't yet found their ritual.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FULL-BLEED IMAGE */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={`${BASE}images/hero.png`}
          alt="SEREIN in natural light"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <FadeIn direction="none" className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif italic text-[#F3EBDD]/80 text-2xl md:text-4xl lg:text-5xl text-center px-8 max-w-2xl leading-relaxed">
            Made by hand. Always.
          </p>
        </FadeIn>
      </section>

      {/* PURCHASE */}
      <section className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-10">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/35 font-sans block mb-4">
              The Morrow Trio
            </span>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-serif text-primary leading-none mb-6">
              Begin here.
            </h2>
            <p className="font-serif italic text-foreground/50 text-lg leading-relaxed max-w-[34ch] mx-auto">
              Three rituals. One discovery set. All three scents, together — at the price of one.
            </p>
          </FadeIn>

          <FadeIn direction="none" delay={0.2}>
            <div className="flex flex-col items-center gap-6 pt-2">
              <span className="text-foreground/40 text-sm font-sans tracking-wide">$11</span>
              <button className="text-[11px] uppercase tracking-[0.3em] text-primary border border-primary/30 px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-500 font-sans">
                Bring It Home
              </button>
            </div>
          </FadeIn>

          <FadeIn direction="none" delay={0.35}>
            <div className="pt-4 flex flex-col items-center gap-4">
              <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/30 font-sans">
                Or explore each scent individually
              </p>
              <div className="flex gap-8">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/collection/${p.id}`}
                    className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/15 pb-0.5 hover:text-primary hover:border-primary/40 transition-all duration-300 font-sans"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
