import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { getProductById } from "@/data/products";
import { ProductCarousel, CarouselImage } from "@/components/product-carousel";

const BASE = import.meta.env.BASE_URL;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductById(slug ?? "");

  if (!product) {
    return (
      <main className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-8">
          <p className="font-serif italic text-foreground/40 text-xl mb-8">This scent wasn't found.</p>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-400 font-sans"
          >
            Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  const carouselImages: CarouselImage[] = [
    { src: product.img, alt: `${product.name} — editorial still`, variant: "product" as const },
    product.scentCard && { src: product.scentCard, alt: `${product.name} — scent notes`, variant: "card" as const },
  ].filter(Boolean) as CarouselImage[];

  return (
    <main className="w-full bg-background overflow-hidden">

      {/* HERO — full-bleed image, text anchored to safe negative-space zones */}
      <section className="relative h-[100dvh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={product.cleanStill ?? product.img}
            alt={product.name}
            className="w-full h-full object-cover [object-position:center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/15" />
        </motion.div>

        {/* Top-left: pillar label + product name — sits in clear wall/background space */}
        <div className="absolute top-0 left-0 z-10 px-8 md:px-16 pt-24 md:pt-28">
          <FadeIn delay={0.2} direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/55 font-sans block mb-3">
              {product.pillar}
            </span>
            <h1 className="text-[clamp(2.8rem,7vw,6.5rem)] font-serif text-[#F3EBDD] leading-none tracking-tight">
              {product.name}
            </h1>
          </FadeIn>
        </div>

        {/* Bottom-right: scent descriptor — sits in the stone/linen negative space */}
        <div className="absolute bottom-0 right-0 z-10 px-8 md:px-16 pb-14 md:pb-20 text-right">
          <FadeIn delay={0.5} direction="none">
            <p className="font-serif italic text-[#F3EBDD]/65 text-lg md:text-xl leading-relaxed max-w-[22ch] ml-auto">
              {product.scent}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* BREADCRUMB / BACK */}
      <div className="px-8 md:px-16 pt-10 pb-0">
        <Link
          href="/#collection"
          className="text-[9px] uppercase tracking-[0.25em] text-foreground/35 hover:text-primary transition-colors duration-300 font-sans"
        >
          ← The Collection
        </Link>
      </div>

      {/* SCENT STORY */}
      <section className="py-24 md:py-36 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-8">
              The Scent Story
            </span>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-serif text-primary leading-none mb-8">
              {product.tagline}
            </h2>
          </FadeIn>
          <FadeIn direction="none" delay={0.2}>
            <div className="flex flex-col gap-7 md:pt-24">
              {product.story.map((paragraph, i) => (
                <p key={i} className="font-serif italic text-foreground/60 text-lg md:text-xl leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRODUCT IMAGE CAROUSEL */}
      <FadeIn direction="none">
        <ProductCarousel images={carouselImages} />
      </FadeIn>

      {/* SCENT NOTES */}
      <section className="py-10 md:py-14 bg-primary text-primary-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/40 font-sans block mb-12">
              Scent Notes
            </span>
          </FadeIn>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {product.notes.map((note, i) => (
              <FadeIn key={note} direction="none" delay={i * 0.1}>
                <span className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground/90 leading-none">
                  {note}
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT FEELS */}
      <section className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-4">
              Texture &amp; Feel
            </span>
            <p className="font-serif italic text-foreground/70 text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              {product.feelNote}
            </p>
          </FadeIn>
          <FadeIn direction="none" delay={0.2}>
            <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row md:gap-24 gap-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/35 font-sans shrink-0 md:pt-1">
                How to Use
              </span>
              <p className="text-foreground/55 text-base leading-loose max-w-[44ch]">
                {product.howToUse}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="py-28 md:py-40 bg-[#e9dfd0] px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="none">
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-sans block mb-4">
                  What's Inside
                </span>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-serif text-primary leading-none">
                  Ingredients.
                </h2>
              </div>
              <Link
                href="/ingredients"
                className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 border-b border-foreground/20 pb-1 hover:text-primary hover:border-primary transition-all duration-300 font-sans self-start md:self-end"
              >
                Full Botanical Study →
              </Link>
            </div>
          </FadeIn>

          <div className="space-y-0">
            {product.ingredients.map((ingredient, i) => (
              <FadeIn key={ingredient} direction="none" delay={i * 0.08}>
                <div className="border-b border-foreground/10 py-7 flex items-center justify-between group">
                  <h3 className="font-serif text-2xl md:text-3xl text-primary leading-none group-hover:translate-x-1 transition-transform duration-500">
                    {ingredient}
                  </h3>
                  <span className="text-foreground/20 font-serif text-2xl group-hover:text-foreground/40 transition-colors duration-300">
                    /
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PURCHASE */}
      <section className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-10">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/35 font-sans block mb-4">
              {product.pillar}
            </span>
            <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-serif text-primary leading-none mb-6">
              {product.name}
            </h2>
            <p className="font-serif italic text-foreground/50 text-lg leading-relaxed max-w-[34ch] mx-auto">
              {product.desc}
            </p>
          </FadeIn>

          <FadeIn direction="none" delay={0.2}>
            <div className="flex flex-col items-center gap-6 pt-2">
              <span className="text-foreground/40 text-sm font-sans tracking-wide">{product.price}</span>
              <button className="text-[11px] uppercase tracking-[0.3em] text-primary border border-primary/30 px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-500 font-sans">
                Add to Cart
              </button>
            </div>
          </FadeIn>

          <FadeIn direction="none" delay={0.35}>
            <div className="pt-4 flex flex-col items-center gap-4">
              <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/30 font-sans">
                Or explore the full collection
              </p>
              <div className="flex gap-8">
                {["supple-oud", "mint-moss", "lithe-bloom"]
                  .filter((id) => id !== product.id)
                  .map((id) => (
                    <Link
                      key={id}
                      href={`/collection/${id}`}
                      className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/15 pb-0.5 hover:text-primary hover:border-primary/40 transition-all duration-300 font-sans"
                    >
                      {id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Link>
                  ))}
                <Link
                  href="/collection/morrow-trio"
                  className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/15 pb-0.5 hover:text-primary hover:border-primary/40 transition-all duration-300 font-sans"
                >
                  The Trio
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
