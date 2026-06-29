import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "wouter";
import { FadeUp, AnimatedHeadline, MagneticButton, sharedStyles } from "../components/ui-helpers";

const capabilities = [
  {
    title: "Creative Intelligence",
    body: "Pattern recognition, imagination, and strategic sense-making applied to leadership, identity, and organizational life.",
  },
  {
    title: "Strategic Facilitation",
    body: "Designed conversations that build alignment, trust, sound decisions, and shared ownership across teams and institutions.",
  },
  {
    title: "Leadership Architecture",
    body: "Systems for sponsorship, relational authority, visibility, and cross-generational leadership development.",
  },
  {
    title: "Collaboration Design",
    body: "Purpose-aligned collaboration structures through the PAC Framework™, creating clarity, accountability, and sustained momentum.",
  },
  {
    title: "Ethics-Embedded Operations",
    body: "Values translated into governance, process, access, and accountability — not aspirations, but architecture.",
  },
];

const volumes = [
  {
    vol: "Volume 03",
    theme: "Visibility & Identity",
    excerpt:
      "A conversation about how we become seen, on our own terms, without losing ourselves in the performance of it.",
    status: "Next",
  },
  {
    vol: "Volume 02",
    theme: "The Architecture of Trust",
    excerpt:
      "Women executives and institutional leaders explored how trust is built, broken, and rebuilt inside complex organizations.",
    status: "Past",
  },
  {
    vol: "Volume 01",
    theme: "Leadership as Relationship",
    excerpt:
      "The inaugural gathering that brought together women leaders to re-examine what leadership actually requires of us.",
    status: "Past",
  },
];

const journalPreviews = [
  {
    category: "Identity",
    title: "Visibility Is Not Performance",
    excerpt: "A note on being seen without becoming flattened by the gaze of others.",
  },
  {
    category: "Leadership",
    title: "Leadership Needs Architecture",
    excerpt: "On building structures that hold identity, trust, and sustainable influence.",
  },
  {
    category: "Creative Intelligence",
    title: "The Strategic Value of Imagination",
    excerpt: "Why discernment and imaginative capacity are not soft skills — they are leadership infrastructure.",
  },
];

const pageStyles = `
  /* Hero */
  .hc-hero {
    position: relative; min-height: 92vh; padding: 7rem 2rem 6rem;
    background: var(--hc-ivory); display: flex; align-items: center; overflow: hidden;
  }
  .hc-hero-rule {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--hc-mulberry); transform-origin: left;
  }
  .hc-hero-container { max-width: 1200px; margin: 0 auto; width: 100%; }
  .hc-hero-sub {
    font-family: 'Inter', system-ui, sans-serif; font-size: 1.05rem;
    color: var(--hc-navy); line-height: 1.82; max-width: 580px;
    margin-top: 1.75rem; margin-bottom: 2.75rem;
  }
  .hc-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
  .hc-scroll-cue {
    margin-top: 4rem; font-size: 0.85rem; color: rgba(43,43,43,0.35);
    font-family: 'Inter', system-ui, sans-serif; letter-spacing: 0.06em; user-select: none;
  }
  .hc-hero-deco {
    position: absolute; right: -120px; top: 50%; transform: translateY(-50%);
    width: 560px; height: 560px; border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,185,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  /* POV */
  .hc-pov { padding: 6rem 2rem; background: var(--hc-white); }
  .hc-pov-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1.4fr; gap: 5rem; align-items: start;
  }
  .hc-pov-quote {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.4rem, 2.8vw, 1.9rem); font-weight: 400; font-style: italic;
    color: var(--hc-charcoal); line-height: 1.5; letter-spacing: -0.01em;
    border-left: 3px solid var(--hc-mulberry); padding-left: 1.75rem;
    margin-top: 1.5rem;
  }
  .hc-pov-body {
    font-family: 'Inter', system-ui, sans-serif; font-size: 1rem;
    color: var(--hc-navy); line-height: 1.85;
  }

  /* Capabilities */
  .hc-caps { padding: 6rem 2rem; background: var(--hc-ivory); }
  .hc-caps-header {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1.4fr; gap: 4rem; align-items: end;
    margin-bottom: 3.5rem;
  }
  .hc-caps-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(3, 1fr);
    border: 1px solid rgba(43,43,43,0.1);
  }
  .hc-cap-card {
    padding: 2.5rem; border-right: 1px solid rgba(43,43,43,0.1);
    display: flex; flex-direction: column; gap: 0.9rem;
    background: var(--hc-white); transition: background 0.25s ease;
  }
  .hc-cap-card:last-child { border-right: none; }
  .hc-cap-card:nth-child(3) { border-right: none; }
  .hc-cap-card:nth-child(4) {
    border-top: 1px solid rgba(43,43,43,0.1); border-right: 1px solid rgba(43,43,43,0.1);
  }
  .hc-cap-card:nth-child(5) { border-top: 1px solid rgba(43,43,43,0.1); border-right: none; }
  .hc-cap-card:hover { background: var(--hc-ivory); }
  .hc-cap-num {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 0.8rem;
    color: var(--hc-mulberry); letter-spacing: 0.06em; opacity: 0.55;
  }
  .hc-cap-title {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 1.15rem; font-weight: 400;
    color: var(--hc-charcoal); line-height: 1.3;
  }
  .hc-cap-body {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem;
    color: var(--hc-navy); line-height: 1.75; flex: 1;
  }

  /* Salons */
  .hc-salons { padding: 6rem 2rem; background: var(--hc-navy); }
  .hc-salons-inner { max-width: 1200px; margin: 0 auto; }
  .hc-salons-header { margin-bottom: 3.5rem; max-width: 560px; }
  .hc-salon-desc {
    font-family: 'Inter', system-ui, sans-serif; font-size: 1rem;
    color: rgba(255,255,255,0.65); line-height: 1.8; max-width: 480px; margin-top: 1.25rem;
  }
  .hc-vol-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,0.1); margin-bottom: 3rem; }
  .hc-vol-card { background: var(--hc-navy); padding: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .hc-vol-badge {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .hc-vol-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--hc-coral); display: inline-block;
  }
  .hc-vol-badge-dot-past { background: rgba(255,255,255,0.25); }
  .hc-vol-theme {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 1.15rem; font-weight: 400;
    color: rgba(255,255,255,0.9); line-height: 1.3;
  }
  .hc-vol-excerpt {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem;
    color: rgba(255,255,255,0.5); line-height: 1.7; flex: 1;
  }

  /* Journal */
  .hc-journal { padding: 6rem 2rem; background: var(--hc-white); }
  .hc-journal-inner { max-width: 1200px; margin: 0 auto; }
  .hc-journal-header { margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
  .hc-journal-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(43,43,43,0.1); margin-bottom: 3rem; }
  .hc-journal-card { background: var(--hc-white); padding: 2.5rem; display: flex; flex-direction: column; gap: 0.9rem; transition: background 0.2s ease; }
  .hc-journal-card:hover { background: var(--hc-ivory); }
  .hc-journal-cat {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--hc-mulberry);
  }
  .hc-journal-title {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 1.15rem; font-weight: 400;
    color: var(--hc-charcoal); line-height: 1.3;
  }
  .hc-journal-excerpt {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem;
    color: var(--hc-navy); line-height: 1.7; flex: 1;
  }
  .hc-journal-status {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem;
    color: rgba(43,43,43,0.35); letter-spacing: 0.06em;
  }

  /* Final CTA */
  .hc-final { padding: 7rem 2rem; background: var(--hc-ivory); text-align: center; border-top: 1px solid rgba(43,43,43,0.1); }
  .hc-final-inner { max-width: 680px; margin: 0 auto; }
  .hc-final-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 400;
    color: var(--hc-charcoal); line-height: 1.2; letter-spacing: -0.01em;
    margin-bottom: 1.5rem;
  }
  .hc-final-body {
    font-family: 'Inter', system-ui, sans-serif; font-size: 1rem;
    color: var(--hc-navy); line-height: 1.8; margin-bottom: 2.75rem;
  }
  .hc-final-ctas { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

  /* Responsive */
  @media (max-width: 900px) {
    .hc-pov-inner { grid-template-columns: 1fr; gap: 3rem; }
    .hc-caps-header { grid-template-columns: 1fr; gap: 1.5rem; }
    .hc-caps-grid { grid-template-columns: 1fr 1fr; }
    .hc-cap-card:nth-child(2) { border-right: none; }
    .hc-cap-card:nth-child(3) { border-top: 1px solid rgba(43,43,43,0.1); border-right: 1px solid rgba(43,43,43,0.1); }
    .hc-cap-card:nth-child(4) { border-right: none; }
    .hc-cap-card:nth-child(5) { border-top: 1px solid rgba(43,43,43,0.1); border-right: none; }
    .hc-vol-grid { grid-template-columns: 1fr; }
    .hc-journal-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .hc-hero { min-height: auto; padding: 5rem 1.25rem 4rem; }
    .hc-caps-grid { grid-template-columns: 1fr; }
    .hc-cap-card { border-right: none !important; border-top: 1px solid rgba(43,43,43,0.1) !important; }
    .hc-cap-card:first-child { border-top: none !important; }
    .hc-hero-deco { display: none; }
    .hc-journal-header { flex-direction: column; align-items: flex-start; }
  }
`;

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const mouseX = useSpring(0, { stiffness: 55, damping: 22 });
  const mouseY = useSpring(0, { stiffness: 55, damping: 22 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12);
      mouseY.set(((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 7);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>

      {/* ── Hero ── */}
      <section ref={heroRef} className="hc-hero">
        <motion.div
          className="hc-hero-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="hc-hero-deco" />

        <motion.div className="hc-hero-container" style={{ y: yParallax, opacity: opacityOut }}>
          <motion.span
            className="hc-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Founded by M. Louis — Leadership Studio
          </motion.span>

          <motion.div style={{ x: mouseX, y: mouseY }}>
            <AnimatedHeadline
              tag="h1"
              className="hc-display"
              style={{ maxWidth: 920, marginTop: "0.5rem" }}
              text="Partnering with women leaders to design the conversations, leadership systems, and collaborative structures that transform vision into lasting impact."
            />
          </motion.div>

          <motion.p
            className="hc-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          >
            Through strategic facilitation, leadership architecture, and editorial thought leadership, we help people move from complexity to clarity — and from clarity to sustained action.
          </motion.p>

          <motion.div
            className="hc-hero-ctas"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
          >
            <MagneticButton href="/contact" variant="primary">Begin a Conversation</MagneticButton>
            <MagneticButton href="/journal" variant="outline">Enter the Journal</MagneticButton>
          </motion.div>

          <motion.div
            className="hc-scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              ↓
            </motion.span>
          </motion.div>
        </motion.div>
      </section>

      <div className="hc-container"><div className="hc-divider" /></div>

      {/* ── Point of View ── */}
      <section className="hc-pov">
        <div className="hc-pov-inner">
          <div>
            <FadeUp>
              <span className="hc-eyebrow">Our Point of View</span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <blockquote className="hc-pov-quote">
                Leadership is not simply personal advancement. It is relational architecture.
              </blockquote>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <p className="hc-pov-body">
              We believe trust is infrastructure, not assumption. Design shapes behavior before strategy can take hold. Visibility requires identity — you cannot be truly seen until you know who you are. And collaboration must be intentionally facilitated if it is to become meaningful, sustained action.
              <br /><br />
              These are not aspirations. They are the operating principles that shape every engagement, every program, and every conversation we design.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="hc-container"><div className="hc-divider" /></div>

      {/* ── Signature Capabilities ── */}
      <section className="hc-caps">
        <div className="hc-caps-header">
          <div>
            <FadeUp><span className="hc-eyebrow">Signature Capabilities</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="hc-h2">The work takes many forms.<br />The approach never changes.</h2></FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <p className="hc-body" style={{ maxWidth: 460 }}>
              Every engagement is shaped by a consistent set of capabilities — each one a distinct practice area, each one informed by the same philosophy of design, relationship, and trust.
            </p>
          </FadeUp>
        </div>
        <div className="hc-caps-grid">
          {capabilities.map((cap, i) => (
            <CapCard key={i} cap={cap} index={i} />
          ))}
        </div>
      </section>

      {/* ── Salon Soirées ── */}
      <section className="hc-salons">
        <div className="hc-salons-inner">
          <div className="hc-salons-header">
            <FadeUp><span className="hc-eyebrow hc-eyebrow-light">Salon Soirées</span></FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="hc-h2 hc-h2-light">A recurring conversation series.</h2>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="hc-salon-desc">
                Each gathering is carefully facilitated to surface insight, deepen reflection, and build community around complex questions of leadership, identity, design, and the future we are building together.
              </p>
            </FadeUp>
          </div>
          <div className="hc-vol-grid">
            {volumes.map((v, i) => (
              <VolCard key={i} v={v} index={i} />
            ))}
          </div>
          <FadeUp delay={0.2}>
            <MagneticButton href="/work-with-us" variant="outline">
              <span style={{ color: "#FFFFFF" }}>Reserve Your Seat</span>
            </MagneticButton>
          </FadeUp>
        </div>
      </section>

      {/* ── Journal ── */}
      <section className="hc-journal">
        <div className="hc-journal-inner">
          <div className="hc-journal-header">
            <div>
              <FadeUp><span className="hc-eyebrow">The Hello Creative Journal</span></FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="hc-h2" style={{ maxWidth: 480 }}>Essays, field notes, and frameworks on leadership and change.</h2>
              </FadeUp>
            </div>
            <FadeUp delay={0.15}>
              <Link href="/journal" className="hc-link-arrow-dark">View All Writing →</Link>
            </FadeUp>
          </div>
          <div className="hc-journal-grid">
            {journalPreviews.map((j, i) => (
              <JournalCard key={i} j={j} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="hc-final">
        <div className="hc-final-inner">
          <FadeUp>
            <h2 className="hc-final-headline">
              If you're building what comes next, begin with a conversation.
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="hc-final-body">
              Whether you are clarifying your own leadership identity, designing a program, convening a room, or strengthening collaboration inside an institution — Hello Creative &amp; Co. helps bring the work into form.
            </p>
          </FadeUp>
          <FadeUp delay={0.22}>
            <div className="hc-final-ctas">
              <MagneticButton href="/contact" variant="primary">Begin a Conversation</MagneticButton>
              <MagneticButton href="/work-with-us" variant="outline">Explore the Work</MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function CapCard({ cap, index }: { cap: typeof capabilities[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="hc-cap-card"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <span className="hc-cap-num">0{index + 1}</span>
      <h3 className="hc-cap-title">{cap.title}</h3>
      <p className="hc-cap-body">{cap.body}</p>
      <motion.a href="/work-with-us" className="hc-link-arrow" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
        Learn More →
      </motion.a>
    </motion.div>
  );
}

function VolCard({ v, index }: { v: typeof volumes[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="hc-vol-card"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <div className="hc-vol-badge">
        <span className={`hc-vol-badge-dot${v.status === "Past" ? " hc-vol-badge-dot-past" : ""}`} />
        {v.vol} · {v.status}
      </div>
      <h3 className="hc-vol-theme">{v.theme}</h3>
      <p className="hc-vol-excerpt">{v.excerpt}</p>
      {v.status === "Next" && (
        <motion.a href="/work-with-us" className="hc-link-arrow" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
          Reserve Your Seat →
        </motion.a>
      )}
    </motion.div>
  );
}

function JournalCard({ j, index }: { j: typeof journalPreviews[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="hc-journal-card"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <span className="hc-journal-cat">{j.category}</span>
      <h3 className="hc-journal-title">{j.title}</h3>
      <p className="hc-journal-excerpt">{j.excerpt}</p>
      <span className="hc-journal-status">Coming Soon</span>
    </motion.div>
  );
}
