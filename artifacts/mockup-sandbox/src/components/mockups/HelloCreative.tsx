import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";

/* ── Data ─────────────────────────────────────────────── */

const events = [
  {
    title: "Salon Soirée: Visibility Without Performance",
    date: "Coming Soon",
    format: "Virtual",
    description:
      "A guided conversation for women navigating leadership, identity, and the pressure to be seen.",
    cta: "Reserve a Seat",
    link: "#",
  },
];

const writings = [
  {
    title: "Visibility Is Not Performance",
    category: "Identity",
    date: "Coming Soon",
    excerpt: "A note on being seen without becoming flattened by the gaze of others.",
    link: "#",
  },
  {
    title: "Leadership Needs Architecture",
    category: "Leadership",
    date: "Coming Soon",
    excerpt: "A reflection on building structures that support identity, trust, and sustainable influence.",
    link: "#",
  },
  {
    title: "Creative Intelligence at Work",
    category: "Creative Intelligence",
    date: "Coming Soon",
    excerpt: "On discernment, imagination, and strategic depth as leadership practices.",
    link: "#",
  },
];

const frameworks = [
  {
    name: "Creative Intelligence",
    description: "A lens for approaching identity, leadership, aesthetics, and growth with imagination, discernment, and strategic depth.",
  },
  {
    name: "Collective Leadership Architecture™",
    description: "A way of thinking about leadership as an ecosystem shaped by trust, visibility, sponsorship, and support.",
  },
  {
    name: "PAC Framework™",
    description: "A collaboration framework for creating more aligned, clear, and sustainable ways of working together.",
  },
  {
    name: "Ethics-Embedded Operations",
    description: "An approach to ensuring values show up in decisions, systems, and day-to-day practice.",
  },
];

const pathways = [
  { title: "Advisory", description: "Strategic support for leaders, teams, and institutions navigating identity, collaboration, and systems change.", cta: "Explore Advisory" },
  { title: "Programs", description: "Structured leadership development experiences for women, cohorts, and organizations.", cta: "Explore Programs" },
  { title: "Events", description: "Curated salons, conversations, and gatherings for women thinking deeply about leadership, identity, creativity, and change.", cta: "View Events" },
  { title: "Writing", description: "Essays, notes, and reflections from M. Louis on identity, leadership, visibility, collaboration, and creative intelligence.", cta: "Read Writing" },
];

const navLinks = ["About", "Work With Us", "Events", "Writing", "Contact"];

/* ── Animation helpers ────────────────────────────────── */

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* Split headline into words for staggered reveal */
function AnimatedHeadline({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.25 } },
  };
  const word = {
    hidden: { opacity: 0, y: "110%", rotateX: -15 },
    visible: { opacity: 1, y: "0%", rotateX: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ perspective: "800px" }}
    >
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.28em" }}>
          <motion.span style={{ display: "inline-block" }} variants={word}>{w}</motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

/* ── Nav ──────────────────────────────────────────────── */

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="hc-nav" style={{ boxShadow: scrolled ? "0 1px 24px rgba(45,49,66,0.08)" : "none" }}>
      <motion.div
        className="hc-nav-inner"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#" className="hc-logo">Hello Creative &amp; Co.</a>

        <div className="hc-nav-links-desktop">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="hc-nav-link">{link}</a>
          ))}
          <a href="#contact" className="hc-nav-cta">Start a Conversation</a>
        </div>

        <button className="hc-hamburger" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
                <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="hc-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="hc-mobile-link" onClick={() => setMenuOpen(false)}>{link}</a>
              ))}
              <a href="#contact" className="hc-mobile-cta" onClick={() => setMenuOpen(false)}>Start a Conversation</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────── */

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const springConfig = { stiffness: 60, damping: 20 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / cx) * 14);
      mouseY.set(((e.clientY - cy) / cy) * 8);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <section id="about" ref={heroRef} className="hc-hero">
      {/* Decorative background rule */}
      <motion.div
        className="hc-hero-rule"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />

      <motion.div className="hc-container" style={{ y: yParallax, opacity: opacityOut }}>
        {/* Eyebrow */}
        <motion.p
          className="hc-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Founded by M. Louis
        </motion.p>

        {/* Headline with parallax */}
        <motion.div style={{ x: mouseX, y: mouseY }}>
          <AnimatedHeadline
            className="hc-hero-headline"
            text="Identity, leadership, and collaboration architecture for women leaders and the institutions that support them."
          />
        </motion.div>

        {/* Subhead */}
        <motion.p
          className="hc-hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
        >
          Hello Creative &amp; Co. helps women leaders and mission-driven organizations move from identity clarity to leadership architecture to values-aligned collaboration systems.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="hc-hero-ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
        >
          <MagneticButton href="#work-with-us" primary>Work With Us</MagneticButton>
          <MagneticButton href="#writing">Read the Notes</MagneticButton>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hc-scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >↓</motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* Magnetic button */
function MagneticButton({ children, href, primary }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={wrapRef}
      style={{ x, y, display: "inline-block" }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <a href={href} className={primary ? "hc-btn-primary" : "hc-btn-outline"}>
        {children}
      </a>
    </motion.div>
  );
}

/* ── Divider ──────────────────────────────────────────── */
function Divider() {
  return (
    <div className="hc-container">
      <div className="hc-divider" />
    </div>
  );
}

/* ── Positioning ──────────────────────────────────────── */
function Positioning() {
  return (
    <section className="hc-section hc-paper-soft">
      <div className="hc-container hc-grid-2">
        <FadeUp>
          <h2 className="hc-section-headline">
            A studio for identity, leadership, and institutional design.
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="hc-body-text">
            Hello Creative &amp; Co. sits at the intersection of strategic design, leadership development, creative intelligence, and systems thinking. We support women and organizations as they clarify who they are, how they lead, and what structures they need in order to grow with integrity.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Offer Pathways ───────────────────────────────────── */
function OfferPathways() {
  return (
    <section id="work-with-us" className="hc-section hc-paper">
      <div className="hc-container">
        <FadeUp><p className="hc-eyebrow">Ways to work together</p></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="hc-section-headline" style={{ marginBottom: "3rem" }}>The work takes many forms.</h2>
        </FadeUp>
        <div className="hc-pathway-grid">
          {pathways.map((p, i) => <PathwayCard key={i} pathway={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function PathwayCard({ pathway, index }: { pathway: typeof pathways[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="hc-pathway-card"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      whileHover={{ backgroundColor: "var(--hc-paper-soft)", transition: { duration: 0.2 } }}
    >
      <span className="hc-pathway-num">0{index + 1}</span>
      <h3 className="hc-card-title">{pathway.title}</h3>
      <p className="hc-card-body">{pathway.description}</p>
      <motion.a
        href="#contact"
        className="hc-link-arrow"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {pathway.cta} →
      </motion.a>
    </motion.div>
  );
}

/* ── Frameworks ───────────────────────────────────────── */
function Frameworks() {
  return (
    <section className="hc-section hc-dark">
      <div className="hc-container">
        <FadeUp><p className="hc-eyebrow hc-eyebrow-light">Point of View</p></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="hc-section-headline hc-headline-light" style={{ maxWidth: 560, marginBottom: "3.5rem" }}>
            The work is guided by a clear point of view.
          </h2>
        </FadeUp>
        <div className="hc-framework-grid">
          {frameworks.map((f, i) => <FrameworkItem key={i} f={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function FrameworkItem({ f, index }: { f: typeof frameworks[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="hc-framework-item"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="hc-framework-accent"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <h3 className="hc-framework-title" style={{ color: hovered ? "#D4AFB9" : "rgba(212,175,185,0.75)" }}>
        {f.name}
      </h3>
      <p className="hc-framework-body">{f.description}</p>
    </motion.div>
  );
}

/* ── Events ───────────────────────────────────────────── */
function Events() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="events" className="hc-section hc-paper">
      <div className="hc-container">
        <FadeUp><p className="hc-eyebrow">Upcoming Events</p></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="hc-section-headline" style={{ marginBottom: "3rem" }}>Conversations worth having.</h2>
        </FadeUp>

        {events.length > 0 && (
          <div className="hc-events-grid">
            {events.map((event, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="hc-event-card">
                  <div className="hc-event-meta">
                    <span className="hc-event-format">{event.format}</span>
                    <span className="hc-event-date">{event.date}</span>
                  </div>
                  <h3 className="hc-card-title">{event.title}</h3>
                  <p className="hc-card-body">{event.description}</p>
                  <motion.a href={event.link} className="hc-link-arrow" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    {event.cta} →
                  </motion.a>
                </div>
              </FadeUp>
            ))}
          </div>
        )}

        <FadeUp delay={0.2}>
          <div className="hc-email-capture">
            <p className="hc-email-heading">Join the list to receive the next invitation.</p>
            {submitted ? (
              <motion.p className="hc-email-confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                Thank you — you're on the list.
              </motion.p>
            ) : (
              <form className="hc-email-form" onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required className="hc-email-input" />
                <motion.button type="submit" className="hc-btn-primary" whileTap={{ scale: 0.97 }}>Join the List</motion.button>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Writing ──────────────────────────────────────────── */
function Writing() {
  return (
    <section id="writing" className="hc-section hc-paper-soft">
      <div className="hc-container">
        <FadeUp><p className="hc-eyebrow">Writing &amp; Notes</p></FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="hc-section-headline" style={{ marginBottom: "3rem" }}>Ideas in progress.</h2>
        </FadeUp>
        <div className="hc-writing-grid">
          {writings.map((w, i) => <WritingCard key={i} writing={w} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function WritingCard({ writing, index }: { writing: typeof writings[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="hc-writing-card"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      whileHover={{ backgroundColor: "var(--hc-paper)", transition: { duration: 0.2 } }}
    >
      <div className="hc-writing-meta">
        <span className="hc-writing-category">{writing.category}</span>
        <span className="hc-event-date">{writing.date}</span>
      </div>
      <h3 className="hc-card-title">{writing.title}</h3>
      <p className="hc-card-body">{writing.excerpt}</p>
      <motion.a href={writing.link} className="hc-link-arrow" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
        Read More →
      </motion.a>
    </motion.div>
  );
}

/* ── Founder ──────────────────────────────────────────── */
function Founder() {
  const photoRef = useRef(null);
  const inView = useInView(photoRef, { once: true, margin: "-80px" });

  return (
    <section className="hc-section hc-paper">
      <div className="hc-container hc-grid-2 hc-founder-grid">
        <div>
          <motion.div
            ref={photoRef}
            className="hc-founder-photo"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Subtle shimmer overlay */}
            <motion.div
              className="hc-founder-shimmer"
              animate={{ opacity: [0.3, 0.6, 0.3], x: ["-100%", "100%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
            <span className="hc-founder-monogram">ML</span>
          </motion.div>
        </div>
        <div>
          <FadeUp delay={0.1}><p className="hc-eyebrow">About M. Louis</p></FadeUp>
          <FadeUp delay={0.2}><h2 className="hc-section-headline">Founder &amp; Principal</h2></FadeUp>
          <FadeUp delay={0.3}>
            <p className="hc-body-text" style={{ marginBottom: "2rem" }}>
              M. Louis is the founder of Hello Creative &amp; Co., an identity, leadership, and institutional design studio serving women leaders and mission-driven organizations. Her work sits at the intersection of editorial strategy, leadership development, collaboration design, and cultural systems thinking.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <motion.a href="#contact" className="hc-link-underline" whileHover={{ x: 4 }} style={{ display: "inline-block" }}>
              Learn More →
            </motion.a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section id="contact" className="hc-section hc-paper-soft hc-final-cta">
      <div className="hc-container hc-text-center">
        <FadeUp>
          <h2 className="hc-cta-headline">
            If you're building what comes next, begin with a conversation.
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="hc-cta-body">
            Whether you are clarifying your own leadership identity, designing a program, convening a room, or strengthening collaboration inside an institution, Hello Creative &amp; Co. helps bring the work into form.
          </p>
        </FadeUp>
        <FadeUp delay={0.25}>
          <MagneticButton href="mailto:hello@hellocreativeandco.com" primary>Start a Conversation</MagneticButton>
        </FadeUp>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="hc-footer">
      <div className="hc-container hc-footer-inner">
        <span className="hc-footer-logo">Hello Creative &amp; Co.</span>
        <span className="hc-footer-copy">© 2025 Hello Creative &amp; Co. All rights reserved.</span>
      </div>
    </footer>
  );
}

/* ── Root ─────────────────────────────────────────────── */
export default function HelloCreative() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .hc-root {
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--hc-ink-primary, #2D3142);
          background: var(--hc-paper, #FFFFFF);
        }

        /* ── Layout ── */
        .hc-container  { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .hc-section    { padding: 5.5rem 2rem; }
        .hc-paper      { background: var(--hc-paper, #FFFFFF); }
        .hc-paper-soft { background: var(--hc-paper-soft, #FAFAF9); }
        .hc-dark       { background: var(--hc-ink-primary, #2D3142); }
        .hc-final-cta  { border-top: 1px solid var(--hc-neutral-soft, #BFC0C0); padding: 6rem 2rem; }
        .hc-text-center { text-align: center; display: flex; flex-direction: column; align-items: center; }

        /* ── Hero ── */
        .hc-hero {
          position: relative; padding: 8rem 2rem 7rem; overflow: hidden;
          background: var(--hc-paper, #FFFFFF);
        }
        .hc-hero-rule {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--hc-accent-premium, #7A2E3A);
          transform-origin: left; z-index: 10;
        }
        .hc-scroll-cue {
          margin-top: 3.5rem; font-size: 0.9rem; opacity: 0.35;
          color: var(--hc-support-cool, #4F5D75); user-select: none;
        }

        /* ── Nav ── */
        .hc-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--hc-neutral-soft, #BFC0C0);
          transition: box-shadow 0.3s ease;
        }
        .hc-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between; height: 72px;
        }
        .hc-logo {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.1rem; font-weight: 400;
          color: var(--hc-ink-primary, #2D3142); text-decoration: none; letter-spacing: 0.02em; white-space: nowrap;
        }
        .hc-nav-links-desktop { display: flex; align-items: center; gap: 2.25rem; }
        .hc-nav-link {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.8125rem; font-weight: 400;
          color: var(--hc-support-cool, #4F5D75); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s ease;
        }
        .hc-nav-link:hover { color: var(--hc-ink-primary, #2D3142); }
        .hc-nav-cta {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.8125rem; font-weight: 500;
          color: var(--hc-accent-premium, #7A2E3A); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-bottom: 1.5px solid var(--hc-accent-premium, #7A2E3A); padding-bottom: 2px;
          transition: opacity 0.2s ease;
        }
        .hc-nav-cta:hover { opacity: 0.7; }
        .hc-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          color: var(--hc-ink-primary, #2D3142); padding: 4px;
        }
        .hc-mobile-link {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; font-weight: 400;
          color: var(--hc-support-cool, #4F5D75); text-decoration: none;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .hc-mobile-cta {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; font-weight: 500;
          color: var(--hc-accent-premium, #7A2E3A); text-decoration: none;
          letter-spacing: 0.05em; text-transform: uppercase;
          border-bottom: 1.5px solid var(--hc-accent-premium, #7A2E3A); width: fit-content; padding-bottom: 2px;
        }

        /* ── Divider ── */
        .hc-divider { height: 1px; background: var(--hc-neutral-soft, #BFC0C0); }

        /* ── Typography ── */
        .hc-eyebrow {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500;
          color: var(--hc-accent-premium, #7A2E3A); letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 1rem; display: block;
        }
        .hc-eyebrow-light { color: var(--hc-neutral-warm, #D4AFB9); }
        .hc-section-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 400;
          color: var(--hc-ink-primary, #2D3142); letter-spacing: -0.01em; line-height: 1.25; margin-bottom: 1.25rem;
        }
        .hc-headline-light { color: #FFFFFF; }
        .hc-hero-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2.6rem, 5.5vw, 4.2rem); font-weight: 400;
          color: var(--hc-ink-primary, #2D3142); line-height: 1.15; letter-spacing: -0.02em;
          margin-bottom: 2rem; max-width: 880px; will-change: transform;
        }
        .hc-hero-sub {
          font-family: 'Inter', system-ui, sans-serif; font-size: 1.125rem;
          color: var(--hc-support-cool, #4F5D75); line-height: 1.75; max-width: 600px; margin-bottom: 2.75rem;
        }
        .hc-body-text {
          font-family: 'Inter', system-ui, sans-serif; font-size: 1rem;
          color: var(--hc-support-cool, #4F5D75); line-height: 1.8;
        }
        .hc-cta-headline {
          font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400; color: var(--hc-ink-primary, #2D3142); line-height: 1.2;
          letter-spacing: -0.01em; margin-bottom: 1.5rem; max-width: 680px;
        }
        .hc-cta-body {
          font-family: 'Inter', system-ui, sans-serif; font-size: 1rem;
          color: var(--hc-support-cool, #4F5D75); line-height: 1.8; max-width: 540px; margin-bottom: 2.75rem;
        }

        /* ── Buttons ── */
        .hc-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
        .hc-btn-primary {
          display: inline-block; font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; padding: 1rem 2.25rem;
          background: var(--hc-accent-premium, #7A2E3A); color: #FFFFFF;
          border: 1.5px solid var(--hc-accent-premium, #7A2E3A);
          transition: background 0.22s ease, border-color 0.22s ease; cursor: pointer;
        }
        .hc-btn-primary:hover { background: #5f2430; border-color: #5f2430; }
        .hc-btn-outline {
          display: inline-block; font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; padding: 1rem 2.25rem;
          background: transparent; color: var(--hc-ink-primary, #2D3142);
          border: 1.5px solid var(--hc-neutral-soft, #BFC0C0); transition: border-color 0.22s ease;
        }
        .hc-btn-outline:hover { border-color: var(--hc-ink-primary, #2D3142); }
        .hc-link-arrow {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500;
          color: var(--hc-accent-premium, #7A2E3A); text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase; display: inline-block;
        }
        .hc-link-underline {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500;
          color: var(--hc-accent-premium, #7A2E3A); text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-bottom: 1.5px solid var(--hc-accent-premium, #7A2E3A); padding-bottom: 2px;
        }

        /* ── Cards / Grids ── */
        .hc-card-title {
          font-family: 'DM Serif Display', Georgia, serif; font-size: 1.2rem; font-weight: 400;
          color: var(--hc-ink-primary, #2D3142); line-height: 1.3; letter-spacing: -0.01em;
        }
        .hc-card-body {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem;
          color: var(--hc-support-cool, #4F5D75); line-height: 1.7; flex: 1;
        }
        .hc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .hc-founder-grid { gap: 5rem; }

        /* Pathway */
        .hc-pathway-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          border: 1px solid var(--hc-neutral-soft, #BFC0C0);
        }
        .hc-pathway-card {
          padding: 2.5rem; border-right: 1px solid var(--hc-neutral-soft, #BFC0C0);
          display: flex; flex-direction: column; gap: 1.1rem; background: var(--hc-paper, #FFFFFF);
          cursor: default; transition: background 0.2s ease;
        }
        .hc-pathway-num {
          font-family: 'DM Serif Display', Georgia, serif; font-size: 0.85rem;
          color: var(--hc-neutral-warm, #D4AFB9); letter-spacing: 0.06em;
        }

        /* Events */
        .hc-events-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px; background: var(--hc-neutral-soft, #BFC0C0);
          border: 1px solid var(--hc-neutral-soft, #BFC0C0); margin-bottom: 3rem;
        }
        .hc-event-card {
          background: var(--hc-paper, #FFFFFF); padding: 2.5rem;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .hc-event-meta { display: flex; gap: 0.75rem; align-items: center; }
        .hc-event-format {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #FFFFFF; background: var(--hc-support-cool, #4F5D75); padding: 0.2rem 0.6rem;
        }
        .hc-event-date {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.8rem;
          color: var(--hc-neutral-soft, #BFC0C0); letter-spacing: 0.04em;
        }

        /* Writing */
        .hc-writing-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1px; background: var(--hc-neutral-soft, #BFC0C0); border: 1px solid var(--hc-neutral-soft, #BFC0C0);
        }
        .hc-writing-card {
          padding: 2.5rem; display: flex; flex-direction: column; gap: 1rem;
          background: var(--hc-paper-soft, #FAFAF9);
        }
        .hc-writing-meta { display: flex; justify-content: space-between; align-items: center; }
        .hc-writing-category {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--hc-accent-premium, #7A2E3A);
        }

        /* Frameworks */
        .hc-framework-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          border-top: 1px solid rgba(191,192,192,0.2);
        }
        .hc-framework-item {
          padding: 2.25rem 2.5rem 2.25rem 0;
          border-bottom: 1px solid rgba(191,192,192,0.2);
          position: relative; overflow: hidden; cursor: default;
        }
        .hc-framework-accent {
          position: absolute; top: 0; left: 0; width: 100%; height: 2px;
          background: var(--hc-neutral-warm, #D4AFB9); transform-origin: left;
        }
        .hc-framework-title {
          font-family: 'DM Serif Display', Georgia, serif; font-size: 1.05rem; font-weight: 400;
          margin-bottom: 0.75rem; transition: color 0.2s ease;
        }
        .hc-framework-body {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem;
          color: rgba(255,255,255,0.65); line-height: 1.75;
        }

        /* Founder */
        .hc-founder-photo {
          width: 100%; max-width: 380px; aspect-ratio: 4/5;
          background: var(--hc-neutral-warm, #D4AFB9);
          display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
        }
        .hc-founder-shimmer {
          position: absolute; inset: 0; width: 60%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          pointer-events: none;
        }
        .hc-founder-monogram {
          font-family: 'DM Serif Display', Georgia, serif; font-size: 5rem; font-weight: 400;
          color: rgba(45,49,66,0.2); letter-spacing: 0.05em; position: relative; z-index: 1;
        }

        /* Email */
        .hc-email-capture {
          background: var(--hc-paper-soft, #FAFAF9); border: 1px solid var(--hc-neutral-soft, #BFC0C0);
          padding: 2.5rem; max-width: 520px;
        }
        .hc-email-heading {
          font-family: 'DM Serif Display', Georgia, serif; font-size: 1.1rem; font-weight: 400;
          color: var(--hc-ink-primary, #2D3142); margin-bottom: 1.25rem;
        }
        .hc-email-confirm {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem;
          color: var(--hc-accent-premium, #7A2E3A);
        }
        .hc-email-form { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .hc-email-input {
          flex: 1; min-width: 200px; font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.875rem; color: var(--hc-ink-primary, #2D3142);
          background: var(--hc-paper, #FFFFFF); border: 1px solid var(--hc-neutral-soft, #BFC0C0);
          padding: 0.875rem 1rem; outline: none; transition: border-color 0.2s ease;
        }
        .hc-email-input:focus { border-color: var(--hc-support-cool, #4F5D75); }

        /* Footer */
        .hc-footer { background: var(--hc-ink-primary, #2D3142); padding: 2.5rem 2rem; }
        .hc-footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .hc-footer-logo {
          font-family: 'DM Serif Display', Georgia, serif; font-size: 1rem; font-weight: 400;
          color: rgba(255,255,255,0.65);
        }
        .hc-footer-copy {
          font-family: 'Inter', system-ui, sans-serif; font-size: 0.8rem;
          color: rgba(255,255,255,0.35); letter-spacing: 0.04em;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hc-nav-links-desktop { display: none; }
          .hc-hamburger { display: flex; align-items: center; }
          .hc-section { padding: 3.5rem 1.25rem; }
          .hc-container { padding: 0 1.25rem; }
          .hc-hero { padding: 5rem 1.25rem 4rem; }
          .hc-grid-2 { grid-template-columns: 1fr; gap: 2.5rem; }
          .hc-hero-headline { font-size: 2.4rem; }
          .hc-hero-sub { font-size: 1rem; }
          .hc-pathway-grid { grid-template-columns: 1fr; }
          .hc-pathway-card { border-right: none; border-bottom: 1px solid var(--hc-neutral-soft, #BFC0C0); }
          .hc-framework-grid { grid-template-columns: 1fr; }
          .hc-writing-grid { grid-template-columns: 1fr; }
          .hc-events-grid { grid-template-columns: 1fr; }
          .hc-founder-photo { max-width: 100%; }
          .hc-final-cta { padding: 4rem 1.25rem; }
          .hc-cta-headline { font-size: 2rem; }
        }
      `}</style>

      <div className="hc-root">
        <NavBar />
        <Hero />
        <Divider />
        <Positioning />
        <Divider />
        <OfferPathways />
        <Frameworks />
        <Events />
        <Divider />
        <Writing />
        <Divider />
        <Founder />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
