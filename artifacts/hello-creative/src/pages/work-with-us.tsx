import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp, MagneticButton, sharedStyles } from "../components/ui-helpers";

const practices = [
  {
    area: "Leadership Development",
    tagline: "For women leaders ready to lead with full authority.",
    what: "Structured development experiences for individual women leaders and cohorts at inflection points — building identity clarity, relational authority, and sustainable leadership capacity.",
    how: "Through one-on-one advisory engagement, cohort-based programs, and institutional partnerships, we design experiences that address the whole leader — identity, visibility, strategy, and sustainability.",
    engagements: ["Executive leadership advisory", "Women's leadership cohorts", "Emerging leader programs", "Intergenerational leadership design"],
    outcomes: ["Greater identity clarity and leadership confidence", "Stronger relational authority and executive presence", "Sustainable leadership practices and boundaries", "Networks of mutual sponsorship and support"],
    color: "var(--hc-mulberry)",
    bg: "var(--hc-ivory)",
  },
  {
    area: "Organizational Consulting",
    tagline: "For institutions ready to build more equitable, aligned systems.",
    what: "Strategic consulting for foundations, nonprofits, and institutions navigating complexity, transition, and cultural change — with a focus on values alignment, governance, and collaboration design.",
    how: "We work alongside leadership teams and boards to examine current structures, identify design gaps, and build systems and processes that reflect stated values. We bring both analysis and aesthetics to organizational design.",
    engagements: ["Organizational culture assessment", "Governance and process redesign", "Values-to-operations translation", "Team collaboration architecture"],
    outcomes: ["Clearer decision-making structures", "Stronger alignment between values and practice", "More equitable and sustainable collaboration", "Increased organizational trust and accountability"],
    color: "var(--hc-navy)",
    bg: "var(--hc-white)",
  },
  {
    area: "Strategic Facilitation",
    tagline: "Designed conversations that go somewhere.",
    what: "HC&C designs and facilitates the conversations that help leaders build alignment, navigate complexity, strengthen relationships, clarify decisions, create shared ownership, and move from ideas to implementation.",
    how: "Strategic facilitation is woven into everything we do — from single convenings to multi-year engagements. We design each conversation as carefully as we design any other artifact: with purpose, structure, aesthetic attention, and a clear outcome in mind.",
    engagements: ["Leadership team retreats", "Strategic planning convenings", "Cross-sector convenings and summits", "Board and stakeholder facilitation"],
    outcomes: ["Aligned leadership teams with shared direction", "Sound decisions with broad ownership", "Transformed relationships and working dynamics", "Clear implementation commitments and accountabilities"],
    color: "var(--hc-coral)",
    bg: "var(--hc-ivory)",
  },
  {
    area: "Salon Soirées",
    tagline: "A recurring conversation series by Hello Creative & Co.",
    what: "Salon Soirées explores leadership, identity, design, technology, culture, and the future we are building together. Each gathering is carefully facilitated to surface insight, deepen reflection, and build community around complex questions.",
    how: "Each volume of Salon Soirées brings together a carefully curated group of women leaders for an intimate, facilitated evening. We use volume language — Volume 01, Volume 02 — to signal that this is a living archive of gathered thought, not a one-time event.",
    engagements: ["Volume 01: Leadership as Relationship", "Volume 02: The Architecture of Trust", "Volume 03: Visibility & Identity (Coming Soon)"],
    outcomes: ["Community and connection across sectors", "Deepened reflection on leadership and identity", "New relationships and networks of mutual support", "Ideas that travel beyond the room"],
    color: "var(--hc-dusty-rose)",
    bg: "var(--hc-white)",
  },
];

const pageStyles = `
  .hc-wwu-hero { padding: 6rem 2rem 4rem; background: var(--hc-charcoal); position: relative; }
  .hc-wwu-hero-rule { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--hc-coral); transform-origin: left; }
  .hc-wwu-hero-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; }
  .hc-wwu-hero-headline {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 3.75rem); font-weight: 400;
    color: #FFFFFF; line-height: 1.12; letter-spacing: -0.02em;
  }
  .hc-wwu-hero-sub { font-family: 'Inter', system-ui, sans-serif; font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.8; }

  .hc-practice { padding: 5.5rem 2rem; }
  .hc-practice-inner { max-width: 1200px; margin: 0 auto; }
  .hc-practice-header { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(43,43,43,0.12); }
  .hc-practice-area {
    font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 400; color: var(--hc-charcoal); line-height: 1.2; margin-top: 0.5rem;
  }
  .hc-practice-tagline { font-family: 'Inter', system-ui, sans-serif; font-size: 1rem; color: var(--hc-navy); line-height: 1.7; margin-top: 0.75rem; }
  .hc-practice-body { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .hc-practice-main-col {}
  .hc-practice-side-col {}
  .hc-detail-label { font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500; color: var(--hc-mulberry); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.75rem; display: block; }
  .hc-detail-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem; }
  .hc-detail-list li { font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem; color: var(--hc-navy); line-height: 1.6; padding-left: 1rem; position: relative; }
  .hc-detail-list li::before { content: '—'; position: absolute; left: 0; color: var(--hc-dusty-rose); }

  @media (max-width: 900px) {
    .hc-wwu-hero-inner { grid-template-columns: 1fr; gap: 2rem; }
    .hc-practice-body { grid-template-columns: 1fr; gap: 2.5rem; }
  }
`;

export default function WorkWithUs() {
  return (
    <>
      <style>{sharedStyles + pageStyles}</style>

      {/* Hero */}
      <section className="hc-wwu-hero">
        <motion.div className="hc-wwu-hero-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hc-wwu-hero-inner">
          <div>
            <motion.span className="hc-eyebrow hc-eyebrow-light" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              Practice Areas
            </motion.span>
            <motion.h1 className="hc-wwu-hero-headline" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
              Work With Us
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}>
            <p className="hc-wwu-hero-sub">
              HC&C works with women leaders, leadership teams, and mission-driven institutions through four practice areas. Each engagement is designed with care, intentionality, and a consistent commitment to the work that matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Practice Areas */}
      {practices.map((p, i) => (
        <PracticeSection key={i} practice={p} index={i} />
      ))}

      {/* CTA */}
      <section style={{ padding: "5.5rem 2rem", background: "var(--hc-ivory)", textAlign: "center", borderTop: "1px solid rgba(43,43,43,0.1)" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "var(--hc-charcoal)", lineHeight: 1.25, marginBottom: "1.25rem" }}>
              Every engagement begins with a conversation.
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="hc-body" style={{ marginBottom: "2.5rem" }}>
              Whether you're exploring a specific practice area or not yet sure where to start, we'd love to hear about your work.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <MagneticButton href="/contact" variant="primary">Begin a Conversation</MagneticButton>
              <MagneticButton href="/studio" variant="outline">Explore The Studio</MagneticButton>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function PracticeSection({ practice: p, index }: { practice: typeof practices[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="hc-practice" style={{ background: p.bg }}>
      <motion.div
        ref={ref}
        className="hc-practice-inner"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="hc-practice-header">
          <FadeUp>
            <span className="hc-eyebrow" style={{ color: p.color }}>Practice Area 0{index + 1}</span>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="hc-practice-area">{p.area}</h2>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className="hc-practice-tagline">{p.tagline}</p>
          </FadeUp>
        </div>
        <div className="hc-practice-body">
          <div className="hc-practice-main-col">
            <FadeUp delay={0.1}>
              <div style={{ marginBottom: "2rem" }}>
                <span className="hc-detail-label">What It Is</span>
                <p className="hc-body">{p.what}</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.16}>
              <div>
                <span className="hc-detail-label">How We Work</span>
                <p className="hc-body">{p.how}</p>
              </div>
            </FadeUp>
          </div>
          <div className="hc-practice-side-col">
            <FadeUp delay={0.2}>
              <div style={{ marginBottom: "2rem" }}>
                <span className="hc-detail-label">Typical Engagements</span>
                <ul className="hc-detail-list">
                  {p.engagements.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.26}>
              <div style={{ marginBottom: "2rem" }}>
                <span className="hc-detail-label">Outcomes</span>
                <ul className="hc-detail-list">
                  {p.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.32}>
              <MagneticButton href="/contact" variant="primary">Begin a Conversation</MagneticButton>
            </FadeUp>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
