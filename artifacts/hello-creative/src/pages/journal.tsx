import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp, sharedStyles } from "../components/ui-helpers";

const categories = ["All", "Identity", "Leadership", "Facilitation", "Culture", "Design", "Creative Intelligence"];

const articles = [
  { category: "Identity", title: "Visibility Is Not Performance", excerpt: "A note on being seen without becoming flattened by the gaze of others. What it means to occupy space on your own terms.", featured: true, status: "coming-soon" },
  { category: "Leadership", title: "Leadership Needs Architecture", excerpt: "On building structures that hold identity, trust, and sustainable influence — not just frameworks, but foundations.", featured: true, status: "coming-soon" },
  { category: "Creative Intelligence", title: "The Strategic Value of Imagination", excerpt: "Why discernment and imaginative capacity are not soft skills. They are leadership infrastructure.", featured: false, status: "coming-soon" },
  { category: "Facilitation", title: "Designing for What Cannot Be Said", excerpt: "The structure of a conversation determines what can emerge from it. On the craft of facilitation as leadership design.", featured: false, status: "coming-soon" },
  { category: "Culture", title: "Belonging Is Not a Byproduct", excerpt: "Organizations that treat belonging as an outcome of good management miss the point. It must be designed for.", featured: false, status: "coming-soon" },
  { category: "Design", title: "Beauty Is a Leadership Practice", excerpt: "A reflection on why aesthetic attention — to environments, communications, and experiences — is a form of care for the people you lead.", featured: false, status: "coming-soon" },
];

const pageStyles = `
  .hc-journal-hero { padding: 6rem 2rem 4.5rem; background: var(--hc-ivory); position: relative; }
  .hc-journal-hero-rule { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--hc-mulberry); transform-origin: left; }
  .hc-journal-hero-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; }
  .hc-journal-page-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 400;
    color: var(--hc-charcoal); line-height: 1.1; letter-spacing: -0.02em;
  }
  .hc-journal-subtitle { font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; color: var(--hc-navy); line-height: 1.8; max-width: 420px; }
  .hc-journal-substack { display: flex; align-items: center; gap: 0.75rem; margin-top: 1.25rem; }
  .hc-journal-substack-label { font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem; font-weight: 500; color: var(--hc-navy); letter-spacing: 0.06em; text-transform: uppercase; }
  .hc-journal-substack-link { font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem; font-weight: 500; color: var(--hc-coral); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1.5px solid var(--hc-coral); padding-bottom: 1px; }

  .hc-cats { padding: 2rem 2rem 0; background: var(--hc-ivory); }
  .hc-cats-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 0.75rem; flex-wrap: wrap; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(43,43,43,0.1); }
  .hc-cat-btn { font-family: 'Inter', system-ui, sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.45rem 1rem; border: 1px solid rgba(43,43,43,0.2); background: none; cursor: pointer; color: var(--hc-navy); transition: all 0.2s ease; }
  .hc-cat-btn:hover, .hc-cat-btn-active { background: var(--hc-charcoal); color: #FFFFFF; border-color: var(--hc-charcoal); }

  .hc-articles { padding: 3rem 2rem 6rem; background: var(--hc-ivory); }
  .hc-articles-inner { max-width: 1200px; margin: 0 auto; }
  .hc-featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(43,43,43,0.1); margin-bottom: 1px; }
  .hc-regular-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(43,43,43,0.1); }
  .hc-article-card { background: var(--hc-white); padding: 2.75rem; display: flex; flex-direction: column; gap: 1rem; transition: background 0.2s ease; }
  .hc-article-card:hover { background: var(--hc-ivory); }
  .hc-article-cat { font-family: 'Inter', system-ui, sans-serif; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--hc-mulberry); }
  .hc-article-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.3rem; font-weight: 400; color: var(--hc-charcoal); line-height: 1.28; }
  .hc-article-title-lg { font-size: 1.65rem; }
  .hc-article-excerpt { font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem; color: var(--hc-navy); line-height: 1.75; flex: 1; }
  .hc-article-status { font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; color: rgba(43,43,43,0.35); letter-spacing: 0.06em; text-transform: uppercase; }
  .hc-article-featured-tag { font-family: 'Inter', system-ui, sans-serif; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; background: var(--hc-dusty-rose); color: var(--hc-charcoal); padding: 0.2rem 0.6rem; width: fit-content; }

  .hc-substack-banner { background: var(--hc-charcoal); padding: 4rem 2rem; }
  .hc-substack-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .hc-substack-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.8rem; font-weight: 400; color: #FFFFFF; line-height: 1.3; }
  .hc-substack-body { font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.55); line-height: 1.8; margin-top: 0.75rem; }

  @media (max-width: 900px) {
    .hc-journal-hero-inner { grid-template-columns: 1fr; gap: 2rem; }
    .hc-featured-grid { grid-template-columns: 1fr; }
    .hc-regular-grid { grid-template-columns: 1fr 1fr; }
    .hc-substack-inner { grid-template-columns: 1fr; gap: 2rem; }
  }
  @media (max-width: 600px) {
    .hc-regular-grid { grid-template-columns: 1fr; }
  }
`;

const featured = articles.filter((a) => a.featured);
const regular = articles.filter((a) => !a.featured);

export default function Journal() {
  return (
    <>
      <style>{sharedStyles + pageStyles}</style>

      {/* Hero */}
      <section className="hc-journal-hero">
        <motion.div className="hc-journal-hero-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hc-journal-hero-inner">
          <div>
            <motion.span className="hc-eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              The Hello Creative Journal
            </motion.span>
            <motion.h1 className="hc-journal-page-headline" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
              Ideas, essays, and frameworks in progress.
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}>
            <p className="hc-journal-subtitle">
              Essays, field notes, salon reflections, and frameworks on leadership, identity, design, culture, and change. The Journal is both the editorial platform and living archive of Hello Creative &amp; Co. thinking.
            </p>
            <div className="hc-journal-substack">
              <span className="hc-journal-substack-label">Also on</span>
              <a href="https://substack.com" target="_blank" rel="noopener noreferrer" className="hc-journal-substack-link">Substack ↗</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <div className="hc-cats">
        <div className="hc-cats-inner">
          {categories.map((c, i) => (
            <button key={i} className={`hc-cat-btn${i === 0 ? " hc-cat-btn-active" : ""}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <section className="hc-articles">
        <div className="hc-articles-inner">
          <div className="hc-featured-grid">
            {featured.map((a, i) => (
              <ArticleCard key={i} article={a} index={i} large />
            ))}
          </div>
          <div className="hc-regular-grid">
            {regular.map((a, i) => (
              <ArticleCard key={i} article={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Substack Banner */}
      <section className="hc-substack-banner">
        <div className="hc-substack-inner">
          <div>
            <FadeUp>
              <h2 className="hc-substack-title">Read the Journal on Substack.</h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="hc-substack-body">
                Subscribe to receive new essays, salon notes, and field reflections directly. The Journal is free, thoughtful, and worth your time.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <a href="https://substack.com" target="_blank" rel="noopener noreferrer" className="hc-btn-coral">Subscribe on Substack ↗</a>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function ArticleCard({ article: a, index, large = false }: { article: typeof articles[0]; index: number; large?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="hc-article-card"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <span className="hc-article-cat">{a.category}</span>
        {a.featured && <span className="hc-article-featured-tag">Featured</span>}
      </div>
      <h3 className={`hc-article-title${large ? " hc-article-title-lg" : ""}`}>{a.title}</h3>
      <p className="hc-article-excerpt">{a.excerpt}</p>
      <span className="hc-article-status">Coming Soon</span>
    </motion.div>
  );
}
