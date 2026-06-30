import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";

const BASE = import.meta.env.BASE_URL;

const productList = [
  { id: "supple-oud", name: "Supple Oud" },
  { id: "mint-moss", name: "Mint + Moss" },
  { id: "lithe-bloom", name: "Lithe Bloom" },
];

const ingredientProducts: Record<string, typeof productList> = {
  "shea-butter": productList,
  "mango-butter": productList,
  "jojoba-oil": productList,
  "vitamin-e": productList,
  "arrowroot": productList,
  "fragrance": productList,
};

const ingredients = [
  {
    id: "shea-butter",
    name: "Shea Butter",
    provenance: "West Africa — Burkina Faso & Ghana",
    note: "Centuries of skin memory.",
    description:
      "Pressed from the nut of the karité tree, raw shea has been used across West Africa for generations. Its fatty-acid richness forms a breathable seal on the skin — softening without suffocating.",
    image: `${BASE}images/ingredients.png`,
    imageCaption: "Shea. In its natural state.",
  },
  {
    id: "mango-butter",
    name: "Mango Butter",
    provenance: "South Asia — India & Sri Lanka",
    note: "Tropical. Quietly rich.",
    description:
      "Drawn from the seed of the mango fruit. It melts on contact, leaving skin velvety and settled — as though it had been tended to for a long time.",
    image: `${BASE}images/journal-1.png`,
    imageCaption: "Sourced with care.",
  },
  {
    id: "jojoba-oil",
    name: "Jojoba Oil",
    provenance: "The Sonoran Desert — Arizona & Mexico",
    note: "Mirrors the skin's own oils.",
    description:
      "Technically a liquid wax, jojoba is structurally identical to the sebum your skin already makes. It absorbs without residue, balances without stripping, and keeps working long after it disappears.",
    image: `${BASE}images/journal-2.png`,
    imageCaption: "Light. Purposeful.",
  },
  {
    id: "vitamin-e",
    name: "Vitamin E",
    provenance: "Cold-pressed from sunflower & wheat germ",
    note: "Time, slowed.",
    description:
      "Quiet in its work. It protects what the skin already has — working before anything notices the day has begun. The kind of ingredient that asks nothing, and gives generously.",
    image: `${BASE}images/journal-3.png`,
    imageCaption: "Quiet protection.",
  },
  {
    id: "arrowroot",
    name: "Arrowroot",
    provenance: "The Caribbean — Saint Vincent & Grenada",
    note: "Comfort without heaviness.",
    description:
      "A fine white powder derived from the Maranta plant root. It absorbs excess moisture, softens the skin's texture, and gives our butters the dry-touch finish that makes them feel effortless rather than greasy.",
    image: `${BASE}images/story.png`,
    imageCaption: "Made carefully.",
  },
  {
    id: "fragrance",
    name: "Fragrance",
    provenance: "Thoughtfully sourced. Always intentional.",
    note: "Chosen, not added.",
    description:
      "Every scent in the SEREIN line begins with a memory — a place, a time of day, a feeling. We work with fragrance blends that meet rigorous safety standards, using the lightest hand needed to evoke, not overwhelm.",
    image: `${BASE}images/hero.png`,
    imageCaption: "A feeling, bottled.",
  },
];

function getHashId(): string | null {
  const hash = window.location.hash.slice(1);
  return hash || null;
}

export default function Ingredients() {
  const [openId, setOpenId] = useState<string | null>(() => getHashId());

  useEffect(() => {
    const initial = getHashId();
    if (initial) {
      setOpenId(initial);
      requestAnimationFrame(() => {
        const el = document.getElementById(initial);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  useEffect(() => {
    function onPopState() {
      setOpenId(getHashId());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function toggle(id: string) {
    const next = openId === id ? null : id;
    if (next) {
      history.pushState(null, "", `#${next}`);
    } else {
      history.pushState(null, "", window.location.pathname + window.location.search);
    }
    setOpenId(next);
  }

  return (
    <main className="w-full bg-background min-h-screen">

      {/* PAGE HEADER */}
      <section className="pt-40 pb-20 px-8 md:px-16 max-w-7xl mx-auto">
        <FadeIn direction="none">
          <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-8">
            A Botanical Study
          </span>
        </FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <FadeIn direction="none" delay={0.1}>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-serif text-primary leading-none tracking-tight">
              What's<br />Inside.
            </h1>
          </FadeIn>
          <FadeIn direction="none" delay={0.25} className="md:max-w-[32ch] md:pb-3">
            <p className="font-serif italic text-foreground/50 text-lg md:text-xl leading-relaxed">
              Six ingredients. Each one earned its place.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="border-t border-foreground/10 mx-8 md:mx-16" />

      {/* ACCORDION */}
      <section className="px-8 md:px-16 max-w-7xl mx-auto pb-40">
        {ingredients.map((item, i) => {
          const isOpen = openId === item.id;

          return (
            <FadeIn key={item.id} direction="none" delay={i * 0.07}>
              <div id={item.id} className="border-b border-foreground/10">

                {/* ROW — always visible */}
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left py-10 flex items-end justify-between gap-6 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col gap-2">
                    <motion.h2
                      animate={{ x: isOpen ? 4 : 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="font-serif text-[clamp(2rem,5vw,3.5rem)] text-primary leading-none"
                    >
                      {item.name}
                    </motion.h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-sans">
                      {item.provenance}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 shrink-0">
                    <p className="hidden sm:block font-serif italic text-foreground/40 text-base leading-relaxed max-w-[22ch] text-right">
                      {item.note}
                    </p>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-2xl font-serif text-foreground/30 group-hover:text-primary transition-colors duration-300 leading-none select-none"
                    >
                      +
                    </motion.span>
                  </div>
                </button>

                {/* EXPANDED PANEL */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="pb-16 pt-4 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
                      >
                        {/* TEXT SIDE */}
                        <div className="flex flex-col gap-6">
                          <p className="font-serif italic text-foreground/60 text-xl md:text-2xl leading-relaxed">
                            {item.description}
                          </p>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 font-sans mt-2">
                            {item.provenance}
                          </p>
                          {ingredientProducts[item.id] && (
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-4 border-t border-foreground/10">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/30 font-sans shrink-0">
                                Find it in:
                              </span>
                              {ingredientProducts[item.id].map((product, idx, arr) => (
                                <span key={product.id} className="inline-flex items-baseline gap-x-2">
                                  <a
                                    href={`${BASE}#${product.id}`}
                                    className="font-sans text-[9px] uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-px hover:border-primary transition-colors duration-300"
                                  >
                                    {product.name}
                                  </a>
                                  {idx < arr.length - 1 && (
                                    <span className="text-foreground/20 font-sans text-[9px]">·</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* IMAGE SIDE */}
                        <div className="overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full aspect-[4/3] object-cover"
                          />
                          <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-foreground/30 font-sans">
                            {item.imageCaption}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </FadeIn>
          );
        })}
      </section>

      {/* CLOSING NOTE */}
      <section className="py-28 md:py-40 bg-primary text-primary-foreground px-8 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="none">
            <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-primary-foreground/80 leading-relaxed tracking-wide">
              Every ingredient was chosen because it works — and because it belongs.
            </p>
          </FadeIn>
          <FadeIn direction="none" delay={0.3}>
            <a
              href="#collection"
              onClick={(e) => { e.preventDefault(); window.location.href = import.meta.env.BASE_URL; }}
              className="inline-block mt-14 text-[10px] uppercase tracking-[0.25em] text-primary-foreground/50 border-b border-primary-foreground/20 pb-1 hover:text-primary-foreground hover:border-primary-foreground/50 transition-all duration-500 font-sans"
            >
              Explore the Collection
            </a>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
