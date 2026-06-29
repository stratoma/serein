import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { FadeUp, MagneticButton, sharedStyles } from "../components/ui-helpers";

const values = [
  { title: "Warmth & Rigor", body: "We believe that care and precision are not opposites. The most effective leadership work is both deeply human and rigorously designed." },
  { title: "Hospitality & Strategy", body: "We create space before we create strategy. Belonging is not a byproduct of our work — it is the foundation of it." },
  { title: "Beauty & Systems", body: "We believe in the discipline of elegant design — in work that is as beautiful to experience as it is effective in outcome." },
  { title: "Conversation & Implementation", body: "We do not stop at insight. Every conversation is designed to lead somewhere — toward a decision, a commitment, or a next step." },
];

const pageStyles = `
  .hc-about-hero { padding: 7rem 2rem 5rem; background: var(--hc-charcoal); position: relative; overflow: hidden; }
  .hc-about-hero::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--hc-mulberry), var(--hc-dusty-rose), transparent);
  }
  .hc-about-hero-rule {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--hc-mulberry); transform-origin: left;
  }
  .hc-about-hero-inner { max-width: 1200px; margin: 0 auto; }
  .hc-about-hero-label {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500;
    color: var(--hc-dusty-rose); letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 2rem; display: block;
  }
  .hc-about-hero-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 400;
    color: #FFFFFF; line-height: 1.12; letter-spacing: -0.02em;
    max-width: 820px;
  }

  .hc-story { padding: 6rem 2rem; background: var(--hc-ivory); }
  .hc-story-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.3fr; gap: 6rem; align-items: start; }
  .hc-story-img { background: var(--hc-dusty-rose); aspect-ratio: 3/4; width: 100%; position: relative; overflow: hidden; display: flex; align-items: flex-end; }
  .hc-story-img-label { padding: 1.5rem; font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; color: rgba(255,255,255,0.6); letter-spacing: 0.08em; text-transform: uppercase; }
  .hc-story-text {}
  .hc-story-pull {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 1.5rem; font-style: italic;
    color: var(--hc-charcoal); line-height: 1.5; border-left: 3px solid var(--hc-mulberry);
    padding-left: 1.5rem; margin: 2rem 0;
  }

  .hc-values { padding: 6rem 2rem; background: var(--hc-white); }
  .hc-values-inner { max-width: 1200px; margin: 0 auto; }
  .hc-values-header { margin-bottom: 3.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; }
  .hc-values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(43,43,43,0.1); }
  .hc-value-card { background: var(--hc-white); padding: 2.75rem; display: flex; flex-direction: column; gap: 0.9rem; transition: background 0.2s ease; }
  .hc-value-card:hover { background: var(--hc-ivory); }
  .hc-value-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.15rem; font-weight: 400; color: var(--hc-charcoal); }
  .hc-value-body { font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; color: var(--hc-navy); line-height: 1.75; }

  .hc-founder-section { padding: 6rem 2rem; background: var(--hc-ivory); }
  .hc-founder-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 6rem; align-items: center; }
  .hc-founder-photo {
    aspect-ratio: 4/5; background: var(--hc-navy);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .hc-founder-monogram {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 6rem; font-weight: 400;
    color: rgba(255,255,255,0.12); letter-spacing: 0.05em;
  }
  .hc-founder-shimmer {
    position: absolute; inset: 0; width: 60%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    pointer-events: none;
  }
  .hc-founder-img-note {
    position: absolute; bottom: 1.5rem; left: 1.5rem;
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.68rem;
    color: rgba(255,255,255,0.3); letter-spacing: 0.08em; text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .hc-story-inner { grid-template-columns: 1fr; gap: 3rem; }
    .hc-values-header { grid-template-columns: 1fr; gap: 1.5rem; }
    .hc-founder-inner { grid-template-columns: 1fr; gap: 3rem; }
    .hc-values-grid { grid-template-columns: 1fr; }
  }
`;

export default function About() {
  return (
    <>
      <style>{sharedStyles + pageStyles}</style>

      {/* Hero */}
      <section className="hc-about-hero">
        <motion.div
          className="hc-about-hero-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="hc-about-hero-inner">
          <motion.span
            className="hc-about-hero-label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            About Hello Creative &amp; Co.
          </motion.span>
          <motion.h1
            className="hc-about-hero-headline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            A Black-owned, woman-led leadership studio shaped by global perspective, cultural fluency, and a belief that thoughtful leadership begins with identity, relationship, and intentional design.
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="hc-story">
        <div className="hc-story-inner">
          <FadeUp>
            <div className="hc-story-img">
              <span className="hc-story-img-label">Portrait / Studio Photography</span>
            </div>
          </FadeUp>
          <div>
            <FadeUp><span className="hc-eyebrow">Our Story</span></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="hc-h2" style={{ marginBottom: "1.5rem" }}>Built for the work that matters most.</h2>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="hc-body" style={{ marginBottom: "1.5rem" }}>
                Hello Creative &amp; Co. was founded on a simple belief: that the best leadership work is both deeply human and rigorously designed. That clarity, trust, and collaboration are not accidents — they are the results of intentional design.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <blockquote className="hc-story-pull">
                We partner with women leaders and organizations to cultivate thoughtful leadership through strategic facilitation, leadership development, organizational consulting, and intentional design.
              </blockquote>
            </FadeUp>
            <FadeUp delay={0.28}>
              <p className="hc-body" style={{ marginBottom: "2rem" }}>
                Our work sits at the intersection of editorial strategy, leadership development, collaboration design, and cultural systems thinking. We serve women executives, institutional leaders, nonprofit organizations, and foundations navigating complexity, identity, and growth.
              </p>
            </FadeUp>
            <FadeUp delay={0.34}>
              <MagneticButton href="/studio" variant="primary">Explore The Studio</MagneticButton>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="hc-container"><div className="hc-divider" /></div>

      {/* Values */}
      <section className="hc-values">
        <div className="hc-values-inner">
          <div className="hc-values-header">
            <div>
              <FadeUp><span className="hc-eyebrow">What Guides Us</span></FadeUp>
              <FadeUp delay={0.1}><h2 className="hc-h2">The principles that shape everything we do.</h2></FadeUp>
            </div>
            <FadeUp delay={0.15}>
              <p className="hc-body">These are not stated values — they are operating principles visible in how we show up, what we prioritize, and what we decline.</p>
            </FadeUp>
          </div>
          <div className="hc-values-grid">
            {values.map((v, i) => (
              <ValueCard key={i} v={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="hc-container"><div className="hc-divider" /></div>

      {/* Founder */}
      <section className="hc-founder-section">
        <div className="hc-founder-inner">
          <div>
            <FadeUp><span className="hc-eyebrow">M. Louis — Founder &amp; Principal</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="hc-h2" style={{ marginBottom: "1.5rem" }}>Shaped by a global perspective on leadership, design, and change.</h2></FadeUp>
            <FadeUp delay={0.18}>
              <p className="hc-body" style={{ marginBottom: "1.25rem" }}>
                M. Louis is the founder and principal of Hello Creative &amp; Co. Her career has spanned leadership development, editorial strategy, organizational design, and facilitation — working with women leaders, nonprofits, foundations, and institutions across sectors.
              </p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <p className="hc-body" style={{ marginBottom: "2rem" }}>
                Her work is grounded in cultural fluency, systems thinking, and a deep belief that thoughtful leadership begins with identity. She brings warmth, precision, and a commitment to beauty in all that she designs.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <Link href="/journal" className="hc-link-arrow-dark">Read M. Louis in the Journal →</Link>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <div className="hc-founder-photo">
              <motion.div
                className="hc-founder-shimmer"
                animate={{ opacity: [0.3, 0.7, 0.3], x: ["-100%", "150%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
              />
              <span className="hc-founder-monogram">ML</span>
              <span className="hc-founder-img-note">Portrait Photography</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", background: "var(--hc-charcoal)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.25, marginBottom: "1.5rem" }}>
              Ready to begin?
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              Every engagement begins with a conversation. We'd love to hear about your work.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <MagneticButton href="/contact" variant="primary">Begin a Conversation</MagneticButton>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function ValueCard({ v, index }: { v: typeof values[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="hc-value-card"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <h3 className="hc-value-title">{v.title}</h3>
      <p className="hc-value-body">{v.body}</p>
    </motion.div>
  );
}
