import { FadeIn } from "@/components/ui/fade-in";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { products } from "@/data/products";
import terracottaWall from "@assets/terracott_walls_1783048465994.png";

const BASE = import.meta.env.BASE_URL;


const ingredients = [
  { name: "Shea Butter", note: "Rich in fatty acids and vitamins A and E — deeply softens and supports the skin barrier. The foundation of every batch." },
  { name: "Mango Butter", note: "Rich in oleic and stearic fatty acids, it nourishes and restores resilience. Melts into skin like it was always there." },
  { name: "Jojoba Oil", note: "Structurally identical to the skin's own sebum — absorbs without residue, balances without stripping." },
  { name: "Vitamin E", note: "A powerful antioxidant that shields the skin from environmental stress and supports moisture retention. Quiet in its work." },
  { name: "Arrowroot", note: "Absorbs excess moisture and softens skin texture, giving every formula a dry-touch finish that feels effortless." },
  { name: "Fragrance", note: "Meets rigorous safety standards. Chosen to evoke, never to overwhelm." },
];

function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section ref={ref} className="relative h-[100dvh] overflow-hidden flex items-end">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <img
          src={`${BASE}images/hero-tonal.png`}
          alt="Warm architectural earthy tones with linen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30" />
      </motion.div>

      <div className="relative z-10 w-full px-8 md:px-16 pb-16 md:pb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <FadeIn delay={0.15} direction="none">
          <h1 className="text-[clamp(4rem,14vw,12rem)] font-serif text-[#F3EBDD] leading-none tracking-tight">
            Serein
          </h1>
        </FadeIn>
        <FadeIn delay={0.45} direction="none" className="md:text-right max-w-xs">
          <p className="text-[#F3EBDD]/80 font-serif italic text-lg md:text-xl leading-relaxed mb-6">
            For skin that remembers touch.
          </p>
          <a
            href="#collection"
            className="inline-block text-[10px] uppercase tracking-[0.25em] text-[#F3EBDD]/70 border-b border-[#F3EBDD]/30 pb-1 hover:text-[#F3EBDD] hover:border-[#F3EBDD]/70 transition-all duration-500"
          >
            Explore the Collection
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full bg-background overflow-hidden">

      {/* HERO */}
      <ParallaxHero />

      {/* OPENING STATEMENT */}
      <section className="py-28 md:py-40 px-8 md:px-16 max-w-3xl mx-auto text-center">
        <FadeIn direction="none">
          <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-primary leading-relaxed tracking-wide">
            The quiet architecture of everyday ritual.
          </p>
        </FadeIn>
        <FadeIn direction="none" delay={0.2}>
          <p className="mt-8 text-foreground/50 text-base leading-loose max-w-[42ch] mx-auto font-sans">
            Small-batch body butters made with rich botanical butters that deeply nourish and soften the skin — crafted for the rituals that anchor your day.
          </p>
        </FadeIn>
      </section>

      {/* BRAND PILLARS — Transform / Root / Become */}
      <section className="py-10 md:py-16 bg-primary text-primary-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/10 gap-y-2 md:gap-y-0"
            style={{ columnGap: "clamp(40px, 6vw, 96px)" }}
          >
            {[
              { word: "Transform.", sub: "Rich botanicals. Skin that knows it has been tended to." },
              { word: "Root.", sub: "Grounded in nature. Made with intention." },
              { word: "Become.", sub: "Daily rituals. Lasting change." },
            ].map(({ word, sub }, i) => (
              <FadeIn key={word} delay={i * 0.18} direction="none">
                <div className="py-10 md:py-20 flex flex-col justify-center gap-5 min-w-0">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-none break-words text-right">
                    {word}
                  </h2>
                  <p className="text-primary-foreground/50 text-sm leading-loose tracking-wide max-w-[22ch]">
                    {sub}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section id="collection" className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="none">
            <div className="mb-20 flex items-end justify-between">
              <h2 className="text-[clamp(2rem,6vw,4rem)] font-serif text-primary leading-none">
                The Collection.
              </h2>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans">
                Three scents.
              </span>
            </div>
          </FadeIn>

          <div className="space-y-28 md:space-y-40">
            {products.map((product, i) => (
              <FadeIn key={product.id} direction="none" delay={0.1}>
                <div id={product.id} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-10 md:gap-20 items-center`}>
                  <div className="w-full md:w-[58%] relative overflow-hidden group">
                    <img
                      src={product.cleanStill ?? product.img}
                      alt={product.name}
                      className="w-full aspect-[4/5] object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                    />
                    <p className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[0.2em] text-white/60 font-sans">
                      {product.caption}
                    </p>
                  </div>
                  <div className="w-full md:w-[42%] flex flex-col gap-6 md:py-12">
                    <FadeIn direction="none" delay={0.2}>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/35 font-sans">{product.pillar}</span>
                      <h3 className="text-3xl md:text-4xl font-serif text-primary leading-none mt-2">
                        {product.name}
                      </h3>
                    </FadeIn>
                    <FadeIn direction="none" delay={0.3}>
                      <p className="font-serif italic text-foreground/60 text-lg leading-relaxed">
                        {product.scent}
                      </p>
                      <p className="text-foreground/50 text-sm leading-relaxed mt-2 max-w-[32ch]">
                        {product.desc}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-sans mt-3">{product.tagline}</p>
                    </FadeIn>
                    <FadeIn direction="none" delay={0.4}>
                      <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                        <span className="text-foreground/40 text-sm font-sans">{product.price}</span>
                        <Link
                          href={`/collection/${product.id}`}
                          className="text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-400 font-sans"
                        >
                          Choose This Scent
                        </Link>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* THE MORROW TRIO */}
      <section id="morrow-trio" className="py-28 md:py-40 px-8 md:px-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center">
            <div className="w-full md:w-[58%] relative overflow-hidden group">
              <img
                src={`${BASE}images/morrow-trio-gd.png`}
                alt="The Morrow Trio — three travel-sized body butters"
                className="w-full aspect-[4/5] object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                style={{ filter: "brightness(1.12) contrast(0.94) saturate(0.78) hue-rotate(-6deg)" }}
              />
            </div>
            <div className="w-full md:w-[42%] flex flex-col gap-6 md:py-12">
              <FadeIn direction="none" delay={0.2}>
                <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/35 font-sans">The Morrow Trio</span>
                <h3 className="text-3xl md:text-4xl font-serif text-primary leading-none mt-2">
                  The complete collection.
                </h3>
              </FadeIn>
              <FadeIn direction="none" delay={0.3}>
                <p className="text-foreground/50 text-sm leading-relaxed max-w-[32ch]">
                  Discover all three signature scents in one thoughtfully curated set. An invitation to experience the full Serein ritual before choosing the fragrance that becomes yours.
                </p>
              </FadeIn>
              <FadeIn direction="none" delay={0.4}>
                <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                  <span className="text-foreground/40 text-sm font-sans">$11</span>
                  <Link
                    href="/collection/morrow-trio"
                    className="text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-400 font-sans"
                  >
                    Bring It Home
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section id="ingredients" className="py-28 md:py-40 px-8 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32 items-start">
          <FadeIn direction="none" className="w-full lg:w-[45%] lg:sticky lg:top-28">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-8">
              A Botanical Study
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif text-primary leading-none mb-8">
              Sourced with<br />intention.
            </h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-sans">
              Shea. In its natural state.
            </p>
          </FadeIn>

          <div className="w-full lg:w-[55%] pt-0 lg:pt-24 space-y-0">
            {ingredients.map((item, i) => (
              <FadeIn key={item.name} direction="none" delay={i * 0.1}>
                <div className="border-b border-foreground/10 py-10 flex flex-col gap-3 group">
                  <h3 className="font-serif text-3xl md:text-4xl text-primary leading-none group-hover:translate-x-1 transition-transform duration-500">
                    {item.name}
                  </h3>
                  <p className="text-foreground/40 text-sm font-sans italic max-w-[46ch] leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </FadeIn>
            ))}
            <FadeIn direction="none" delay={0.6}>
              <div className="pt-10">
                <button className="text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-400 font-sans">
                  View Full Ingredients
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="py-28 md:py-40 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center gap-16 md:gap-28">
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <FadeIn direction="none" delay={0.1}>
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/30 font-sans">
                About
              </span>
            </FadeIn>
            <FadeIn direction="none" delay={0.2}>
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif leading-none">
                SEREIN came<br />from stillness.
              </h2>
            </FadeIn>
            <FadeIn direction="none" delay={0.3}>
              <p className="text-primary-foreground/60 leading-loose text-base max-w-[38ch]">
                A quiet insistence that beauty should be slower. That the jar you reach for each morning should be something you chose — not something you grabbed.
              </p>
            </FadeIn>
            <FadeIn direction="none" delay={0.4}>
              <p className="text-primary-foreground/60 leading-loose text-base max-w-[38ch]">
                We blend every batch by hand, in small quantities, because the act of care matters as much as the ingredients inside it.
              </p>
            </FadeIn>
            <FadeIn direction="none" delay={0.5}>
              <p className="font-serif italic text-primary-foreground/80 text-xl leading-relaxed border-t border-primary-foreground/10 pt-8 max-w-[32ch]">
                Skin that remembers touch is skin that has been tended to.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section id="markets" className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="none">
            <div className="mb-20 flex items-end justify-between">
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-serif text-primary leading-none">
                Find Us.
              </h2>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans">
                2026 Dates
              </span>
            </div>
          </FadeIn>

          <div className="space-y-0">
            <FadeIn direction="none" delay={0.1}>
              <div className="border-t border-foreground/10 py-10 flex flex-col sm:flex-row justify-between sm:items-end gap-3 group">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#C48C1E] font-sans">Next Up</span>
                  <h3 className="text-2xl font-serif text-primary group-hover:translate-x-0.5 transition-transform duration-500">Lagos Handcraft Fair</h3>
                  <p className="text-foreground/40 text-xs font-sans tracking-wide">Victoria Island Community Centre</p>
                </div>
                <p className="font-serif italic text-foreground/50 text-lg sm:text-xl whitespace-nowrap">July 12, 2026</p>
              </div>
            </FadeIn>

            <FadeIn direction="none" delay={0.2}>
              <div className="border-t border-foreground/10 py-10 flex flex-col sm:flex-row justify-between sm:items-end gap-3 group">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-serif text-primary/70 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-500">The Makers Market</h3>
                  <p className="text-foreground/30 text-xs font-sans tracking-wide">Lekki Phase 1</p>
                </div>
                <p className="font-serif italic text-foreground/40 text-lg sm:text-xl whitespace-nowrap">August 2, 2026</p>
              </div>
            </FadeIn>

            <FadeIn direction="none" delay={0.3}>
              <div className="border-t border-b border-foreground/10 py-10 flex flex-col sm:flex-row justify-between sm:items-end gap-3 group">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-serif text-primary/70 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-500">Craft & Co. Pop-Up</h3>
                  <p className="text-foreground/30 text-xs font-sans tracking-wide">Ikoyi Arts Quarter</p>
                </div>
                <p className="font-serif italic text-foreground/40 text-lg sm:text-xl whitespace-nowrap">August 23, 2026</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn direction="none" delay={0.4}>
            <div className="mt-14">
              <button className="text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-400 font-sans">
                See Full Market Calendar
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CLOSING ATMOSPHERE — quiet architectural exhale before the footer */}
      <section className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
        <FadeIn direction="none" className="absolute inset-0">
          <img
            src={terracottaWall}
            alt="Sunlit terracotta wall and staircase with a dark bowl resting on linen"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center] md:object-[60%_center]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-black/10" />
        </FadeIn>

        <div className="relative z-10 h-full flex items-center px-8 md:px-16">
          <FadeIn direction="none" delay={0.15} className="max-w-md">
            <p className="font-serif italic text-[#F3EBDD] text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              Every ritual begins with intention.
            </p>
            <p className="mt-6 text-[#F3EBDD]/70 text-sm md:text-base font-sans leading-relaxed max-w-[36ch]">
              Join the Serein list for quiet rituals, seasonal notes, and first access.
            </p>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
