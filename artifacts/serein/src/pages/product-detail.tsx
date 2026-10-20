import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { getProductById } from "@/data/products";
import { useManagedCatalog, catalogPrice, available } from "@/data/managed-catalog";
import { ProductCarousel, CarouselImage } from "@/components/product-carousel";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL;

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const originalProduct = getProductById(slug ?? "");
  const managed = useManagedCatalog()?.find(item => item.id === slug);
  const product = originalProduct && { ...originalProduct, name: managed?.name ?? originalProduct.name };
  const { addItem } = useCart();
  const { toast } = useToast();

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

  const addToCart = () => {
    addItem({ id: product.id, name: product.name, price: (managed?.amount ?? 0) / 100, image: product.cleanStill ?? product.img });
    toast({ title: `${product.name} added`, description: "A considered ritual, saved for you." });
  };

  return (
    <main className="w-full bg-background overflow-hidden">

      {/* HERO */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/60" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-8 md:px-16 pb-10 md:pb-16">
          <FadeIn delay={0.2} direction="none" className="max-w-xl">
            <h1 className="text-[clamp(2.8rem,7vw,6.5rem)] font-serif text-[#F3EBDD] leading-none tracking-tight mb-5">
              {product.name}
            </h1>
            <p className="font-serif italic text-[#F3EBDD]/85 text-lg md:text-xl leading-relaxed max-w-[42ch]">
              {product.productSensoryIntro}
            </p>
            <div className="mt-7 flex flex-col items-start gap-4">
              <span className="text-[#F3EBDD] text-base font-sans tracking-wide">{managed ? catalogPrice(managed.amount) : 'Unavailable'}</span>
              {product.size && <span className="text-[#F3EBDD]/70 text-[10px] uppercase tracking-[0.2em] font-sans">Size: {product.size}</span>}
              <button
                type="button"
                onClick={addToCart}
                disabled={!available(managed)}
                className="text-[11px] uppercase tracking-[0.3em] text-[#F3EBDD] border border-[#F3EBDD]/60 px-8 py-3.5 hover:bg-[#F3EBDD] hover:text-primary transition-all duration-500 font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3EBDD]"
              >
                Add to Cart
              </button>
            </div>
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

      {/* TEXTURE */}
      <section className="py-28 md:py-40 px-8 md:px-16">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 font-sans block mb-4">
              Texture &amp; Feel
            </span>
            <p className="font-serif italic text-foreground/70 text-2xl md:text-3xl lg:text-4xl leading-relaxed">
              {product.feelNote}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* RITUAL */}
      <section className="py-20 md:py-28 px-8 md:px-16 bg-[#f5efe6]">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="none">
            <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 font-sans block mb-10">
              The Ritual
            </span>
          </FadeIn>
          <FadeIn direction="none" delay={0.15}>
            <p className="font-serif italic text-foreground/65 text-xl md:text-2xl leading-relaxed mb-12 max-w-[44ch]">
              {product.howToUse}
            </p>
          </FadeIn>
          <FadeIn direction="none" delay={0.25}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-foreground/10">
              {[
                { label: "Skin Feel", value: "Melts in with a soft, dry-touch finish. Skin feels supple, never coated." },
                { label: "Scent Presence", value: "Noticeable at first, then designed to rest close to the skin." },
                { label: "Made For", value: `Those drawn to ${product.pillar.replace(".", "").toLowerCase()} moments and body care with a point of view.` },
              ].map(({ label, value }) => (
                <div key={label} className="py-8 pr-8 flex flex-col gap-3 border-b sm:border-b-0 sm:border-r border-foreground/10 last:border-r-0">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 font-sans">{label}</span>
                  <p className="text-foreground/60 text-sm font-sans leading-relaxed">{value}</p>
                </div>
              ))}
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

    </main>
  );
}
