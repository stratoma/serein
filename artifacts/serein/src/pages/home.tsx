import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, Leaf, Droplets, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.BASE_URL;

const products = [
  {
    id: "supple-oud",
    name: "Supple Oud",
    price: "$22",
    desc: "Warm and enveloping. Oud, amber, and a whisper of vanilla.",
    img: `${BASE}images/product-oud.png`,
  },
  {
    id: "mint-moss",
    name: "Mint + Moss",
    price: "$22",
    desc: "Clean and grounding. Cool mint softened by green moss.",
    img: `${BASE}images/product-mint.png`,
  },
  {
    id: "lithe-bloom",
    name: "Lithe Bloom",
    price: "$22",
    desc: "Airy and floral. Rose petals, soft musk, ylang ylang.",
    img: `${BASE}images/product-bloom.png`,
  },
  {
    id: "morrow-trio",
    name: "The Morrow Trio",
    price: "$11",
    desc: "Three travel-sized butters. Your morning ritual, wherever you are.",
    img: `${BASE}images/product-trio.png`,
  },
];

const journalArticles = [
  {
    title: "Morning Mist",
    excerpt: "On the quiet ritual of waking before the house does.",
    img: `${BASE}images/journal-1.png`,
  },
  {
    title: "The Weight of Linen",
    excerpt: "Why the fabrics we choose say something about how we move through the world.",
    img: `${BASE}images/journal-2.png`,
  },
  {
    title: "Why Amber Glass",
    excerpt: "The decision to use amber glass wasn't just aesthetic.",
    img: `${BASE}images/journal-3.png`,
  },
];

export default function Home() {
  return (
    <main className="w-full bg-background overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex flex-col md:flex-row items-center pt-24 md:pt-0">
        <div className="w-full md:w-1/2 px-6 md:px-16 lg:px-24 flex flex-col justify-center z-10 order-2 md:order-1 py-12 md:py-0">
          <FadeIn delay={0.2}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-primary mb-6 tracking-tight">
              SEREIN
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl font-serif text-foreground/90 italic mb-6">
              For skin that remembers touch.
            </p>
            <p className="text-base text-foreground/70 max-w-md mb-10 leading-relaxed">
              Small-batch body butters crafted for everyday ritual. Skin-kind ingredients, thoughtfully sourced.
            </p>
          </FadeIn>
          <FadeIn delay={0.6} className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 px-8 tracking-widest uppercase text-xs">
              Shop Collection
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 rounded-none h-14 px-8 tracking-widest uppercase text-xs">
              Find Us at a Market
            </Button>
          </FadeIn>
        </div>
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative order-1 md:order-2">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 pointer-events-none"></div>
          <img 
            src={`${BASE}images/hero.png`}
            alt="Warm architectural earthy tones with linen" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* QUICK SHOP */}
      <section id="collection" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">The Collection</h2>
            <a href="#collection" className="text-sm uppercase tracking-widest text-primary hover:opacity-70 transition-opacity hidden md:block">
              View All
            </a>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.1} direction="up" className="group cursor-pointer flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-muted mb-6">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg text-primary">{product.name}</h3>
                <span className="text-sm font-sans text-foreground/80">{product.price}</span>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed mb-5">
                {product.desc}
              </p>
              <Button
                size="sm"
                className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 tracking-widest uppercase text-xs"
              >
                Add to Cart
              </Button>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* WHY SEREIN */}
      <section className="py-24 bg-primary text-primary-foreground px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <FadeIn delay={0.1} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-primary-foreground/20 flex items-center justify-center mb-8">
                <Sparkles className="w-6 h-6 text-primary-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Transform</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                "We believe your skin is a ritual, not a routine."
              </p>
            </FadeIn>
            <FadeIn delay={0.3} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-primary-foreground/20 flex items-center justify-center mb-8">
                <Leaf className="w-6 h-6 text-primary-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Root</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                "Every formula is grounded in butters and oils with generations of use behind them."
              </p>
            </FadeIn>
            <FadeIn delay={0.5} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-primary-foreground/20 flex items-center justify-center mb-8">
                <Droplets className="w-6 h-6 text-primary-foreground/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif mb-4">Become</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                "SEREIN is the daily practice of choosing care over convenience."
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <FadeIn direction="right" className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-[3/4] relative overflow-hidden">
             <img 
               src={`${BASE}images/ingredients.png`}
               alt="Raw shea butter and seeds" 
               className="w-full h-full object-cover object-center"
             />
          </FadeIn>
          <FadeIn direction="left" className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8 tracking-tight">
              Sourced with intention.
            </h2>
            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed font-serif italic mb-10">
              <p>Shea Butter</p>
              <p>Mango Butter</p>
              <p>Jojoba Oil</p>
              <p>Vitamin E</p>
              <p>Arrowroot</p>
              <p>Thoughtfully blended fragrance</p>
            </div>
            <button className="flex items-center space-x-2 text-sm uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-primary/70 hover:border-primary/70 transition-all">
              <span>View Full Ingredients</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="py-24 md:py-32 bg-[#e9dfd0] px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <FadeIn className="w-full md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-8">Our Story</h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              SEREIN came from a quiet insistence that beauty should be slower. That the jar you reach for each morning should be something you chose, not something you grabbed. 
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              We blend every batch by hand, in small quantities, because we think the act of care matters as much as the ingredients inside it. 
            </p>
            <p className="text-lg font-serif italic text-primary leading-relaxed">
              Skin that remembers touch is skin that has been tended to — every day, without exception.
            </p>
          </FadeIn>
          <FadeIn direction="left" className="w-full md:w-1/2 order-1 md:order-2">
            <div className="aspect-square relative overflow-hidden bg-muted">
               <img 
                 src={`${BASE}images/story.png`}
                 alt="Hands holding an amber jar in natural light" 
                 className="w-full h-full object-cover"
               />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MARKETS */}
      <section id="markets" className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-16">Visit Us</h2>
          <div className="space-y-12 text-left mb-16">
            
            <div className="border-b border-foreground/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-block bg-[#C48C1E] text-white text-[10px] uppercase tracking-widest px-2 py-1 mb-3">Next Up</span>
                <h3 className="text-xl font-serif text-primary mb-1">Lagos Handcraft Fair</h3>
                <p className="text-foreground/60 text-sm">Victoria Island Community Centre</p>
              </div>
              <div className="text-primary font-serif italic text-lg">
                July 12, 2026
              </div>
            </div>

            <div className="border-b border-foreground/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
              <div>
                <h3 className="text-xl font-serif text-primary mb-1">The Makers Market</h3>
                <p className="text-foreground/60 text-sm">Lekki Phase 1</p>
              </div>
              <div className="text-primary font-serif italic text-lg">
                August 2, 2026
              </div>
            </div>

            <div className="border-b border-foreground/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
              <div>
                <h3 className="text-xl font-serif text-primary mb-1">Craft & Co. Pop-Up</h3>
                <p className="text-foreground/60 text-sm">Ikoyi Arts Quarter</p>
              </div>
              <div className="text-primary font-serif italic text-lg">
                August 23, 2026
              </div>
            </div>

          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none h-14 px-8 tracking-widest uppercase text-xs transition-colors duration-300">
            See Full Market Calendar
          </Button>
        </FadeIn>
      </section>

      {/* JOURNAL */}
      <section id="journal" className="py-24 md:py-32 bg-[#e9dfd0] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-primary">Journal</h2>
              <a href="#journal" className="text-sm uppercase tracking-widest text-primary hover:opacity-70 transition-opacity hidden md:block border-b border-primary pb-1">
                Read All
              </a>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {journalArticles.map((article, i) => (
              <FadeIn key={article.title} delay={i * 0.2} direction="up" className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h3 className="text-xl font-serif text-primary mb-3">{article.title}</h3>
                <p className="text-foreground/70 leading-relaxed text-sm">
                  {article.excerpt}
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                  <span>Read Story</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
