import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { FadeUp, MagneticButton, sharedStyles } from "../components/ui-helpers";

const frameworks = [
  {
    name: "Creative Intelligence",
    tagline: "Pattern recognition, imagination, and strategic sense-making.",
    body: "Creative Intelligence is the lens through which we approach all our work. It is the capacity to see patterns others miss, to hold complexity without reducing it, and to imagine alternatives to current conditions. It is a practice of imagination in service of leadership.",
    link: "/journal",
    linkLabel: "Explore in the Journal",
  },
  {
    name: "Collective Leadership Architecture™",
    tagline: "An ecosystem for leadership — not a ladder.",
    body: "Leadership is not a solo performance. Collective Leadership Architecture™ is our way of thinking about leadership as a dynamic ecosystem shaped by trust, visibility, sponsorship, relational authority, and multi-generational investment. It reorients how institutions think about who leads and how leadership is supported.",
    link: "/journal",
    linkLabel: "Explore in the Journal",
  },
  {
    name: "PAC Framework™",
    tagline: "Purpose-aligned collaboration, by design.",
    body: "The PAC Framework™ is a collaboration design system for creating more aligned, clear, and sustainable ways of working together. It addresses the underlying structural and relational conditions that make collaboration succeed or fail — going beyond communication to the architecture of working relationships.",
    link: "/journal",
    linkLabel: "Explore in the Journal",
  },
  {
    name: "Ethics-Embedded Operations™",
    tagline: "Values that live in process, not just principle.",
    body: "Ethics-Embedded Operations™ is an approach to ensuring that stated values actually show up in decisions, systems, and day-to-day practice. It is the work of translating organizational values into governance, process design, access structures, and accountability frameworks.",
    link: "/journal",
    linkLabel: "Explore in the Journal",
  },
];

const pageStyles = `
  .hc-studio-hero { padding: 7rem 2rem 5rem; background: var(--hc-mulberry); position: relative; overflow: hidden; }
  .hc-studio-hero-rule { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--hc-dusty-rose); transform-origin: left; }
  .hc-studio-hero-deco {
    position: absolute; right: -80px; bottom: -80px; width: 480px; height: 480px; border-radius: 50%;
    border: 1px solid rgba(212,175,185,0.15); pointer-events: none;
  }
  .hc-studio-hero-inner { max-width: 1200px; margin: 0 auto; }
  .hc-studio-hero-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 400;
    color: #FFFFFF; line-height: 1.12; letter-spacing: -0.02em; max-width: 780px;
  }
  .hc-studio-hero-sub { font-family: 'Inter', system-ui, sans-serif; font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.8; max-width: 560px; margin-top: 1.5rem; }

  .hc-studio-philosophy { padding: 6rem 2rem; background: var(--hc-ivory); }
  .hc-studio-philosophy-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.4fr; gap: 5rem; align-items: start; }
  .hc-phil-pull {
    font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    font-style: italic; color: var(--hc-charcoal); line-height: 1.5;
    border-left: 3px solid var(--hc-coral); padding-left: 1.75rem; margin-top: 1.5rem;
  }

  .hc-frameworks { padding: 6rem 2rem; background: var(--hc-white); }
  .hc-frameworks-inner { max-width: 1200px; margin: 0 auto; }
  .hc-framework-header { margin-bottom: 4rem; display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: end; }
  .hc-fw-grid { display: flex; flex-direction: column; gap: 1px; background: rgba(43,43,43,0.1); }
  .hc-fw-item {
    background: var(--hc-white); padding: 3rem;
    display: grid; grid-template-columns: 1fr 1.5fr; gap: 3rem; align-items: start;
    transition: background 0.2s ease;
  }
  .hc-fw-item:hover { background: var(--hc-ivory); }
  .hc-fw-name { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.35rem; font-weight: 400; color: var(--hc-charcoal); margin-bottom: 0.5rem; }
  .hc-fw-tagline { font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem; font-weight: 500; color: var(--hc-mulberry); letter-spacing: 0.06em; text-transform: uppercase; }
  .hc-fw-body { font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; color: var(--hc-navy); line-height: 1.8; margin-bottom: 1.25rem; }

  .hc-studio-close { padding: 5rem 2rem; background: var(--hc-ivory); text-align: center; border-top: 1px solid rgba(43,43,43,0.1); }
  .hc-studio-close-inner { max-width: 540px; margin: 0 auto; }

  @media (max-width: 900px) {
    .hc-studio-philosophy-inner { grid-template-columns: 1fr; gap: 3rem; }
    .hc-framework-header { grid-template-columns: 1fr; gap: 1.5rem; }
    .hc-fw-item { grid-template-columns: 1fr; gap: 1.5rem; }
  }
`;

export default function Studio() {
  return (
    <>
      <style>{sharedStyles + pageStyles}</style>

      {/* Hero */}
      <section className="hc-studio-hero">
        <motion.div className="hc-studio-hero-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hc-studio-hero-deco" />
        <div className="hc-studio-hero-inner">
          <motion.span className="hc-eyebrow hc-eyebrow-light" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            The Studio
          </motion.span>
          <motion.h1 className="hc-studio-hero-headline" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
            A distinct philosophy. A consistent approach. A body of work still being built.
          </motion.h1>
          <motion.p className="hc-studio-hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            The Studio is where our thinking lives. It is the source of our frameworks, the foundation of our practice, and the intellectual architecture behind everything we design.
          </motion.p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="hc-studio-philosophy">
        <div className="hc-studio-philosophy-inner">
          <div>
            <FadeUp><span className="hc-eyebrow">Our Philosophy</span></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="hc-h2" style={{ marginBottom: 0 }}>Design shapes behavior before strategy can take hold.</h2>
            </FadeUp>
            <FadeUp delay={0.18}>
              <blockquote className="hc-phil-pull">
                We are not simply facilitators or consultants. We are architects of the conditions under which people do their best leadership work.
              </blockquote>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <div>
              <p className="hc-body" style={{ marginBottom: "1.5rem" }}>
                At Hello Creative &amp; Co., we believe that the way a conversation is designed determines what can be said in it. That the structure of a leadership program determines what kind of leader it produces. That the architecture of collaboration determines whether it creates lasting change or momentary alignment.
              </p>
              <p className="hc-body" style={{ marginBottom: "1.5rem" }}>
                This is why we invest so heavily in the design of the work — not just its execution. We are not simply facilitators or consultants. We are architects of the conditions under which people do their best leadership work.
              </p>
              <p className="hc-body">
                Our four core frameworks — Creative Intelligence, Collective Leadership Architecture™, the PAC Framework™, and Ethics-Embedded Operations™ — are not tools. They are lenses. They shape how we see, how we listen, and how we design.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="hc-container"><div className="hc-divider" /></div>

      {/* Frameworks */}
      <section className="hc-frameworks">
        <div className="hc-frameworks-inner">
          <div className="hc-framework-header">
            <div>
              <FadeUp><span className="hc-eyebrow">Core Frameworks</span></FadeUp>
              <FadeUp delay={0.1}><h2 className="hc-h2">Four lenses. One philosophy.</h2></FadeUp>
            </div>
            <FadeUp delay={0.15}>
              <p className="hc-body">
                Each framework is an entry point, not a destination. We introduce them here at the level of orientation. Deeper exploration lives in the Journal.
              </p>
            </FadeUp>
          </div>
          <div className="hc-fw-grid">
            {frameworks.map((f, i) => (
              <FrameworkItem key={i} f={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="hc-studio-close">
        <div className="hc-studio-close-inner">
          <FadeUp>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.7rem, 2.8vw, 2.25rem)", fontWeight: 400, color: "var(--hc-charcoal)", lineHeight: 1.25, marginBottom: "1.25rem" }}>
              The frameworks are always in conversation with practice.
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="hc-body" style={{ marginBottom: "2.5rem" }}>
              We do not teach these frameworks from a distance. We bring them into the room — into facilitated conversations, leadership programs, and organizational engagements.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <MagneticButton href="/work-with-us" variant="primary">Work With Us</MagneticButton>
              <MagneticButton href="/journal" variant="outline">Enter the Journal</MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function FrameworkItem({ f, index }: { f: typeof frameworks[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      ref={ref}
      className="hc-fw-item"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <p className="hc-fw-tagline">{f.tagline}</p>
        <h3 className="hc-fw-name" style={{ marginTop: "0.75rem" }}>{f.name}</h3>
      </div>
      <div>
        <p className="hc-fw-body">{f.body}</p>
        <motion.a href={f.link} className="hc-link-arrow" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
          {f.linkLabel} →
        </motion.a>
      </div>
    </motion.div>
  );
}
