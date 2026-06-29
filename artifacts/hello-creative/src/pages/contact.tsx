import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FadeUp, MagneticButton, sharedStyles } from "../components/ui-helpers";

const pathways = [
  { label: "Leadership Development", href: "/work-with-us" },
  { label: "Organizational Consulting", href: "/work-with-us" },
  { label: "Strategic Facilitation", href: "/work-with-us" },
  { label: "Salon Soirées", href: "/work-with-us" },
  { label: "Not sure yet — let's talk", href: null },
];

const quickLinks = [
  { label: "Read the Journal", href: "/journal", desc: "Essays, field notes, and frameworks." },
  { label: "Explore The Studio", href: "/studio", desc: "Our philosophy, frameworks, and approach." },
  { label: "Reserve Your Seat", href: "/work-with-us", desc: "Join the next Salon Soirée." },
  { label: "Partner With HC&C", href: "/work-with-us", desc: "Institutional and organizational partnerships." },
];

const pageStyles = `
  .hc-contact-hero { padding: 6rem 2rem 5rem; background: var(--hc-mulberry); position: relative; }
  .hc-contact-hero-rule { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--hc-dusty-rose); transform-origin: left; }
  .hc-contact-hero-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; }
  .hc-contact-hero-headline { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(2.4rem, 5vw, 3.75rem); font-weight: 400; color: #FFFFFF; line-height: 1.12; letter-spacing: -0.02em; }
  .hc-contact-hero-sub { font-family: 'Inter', system-ui, sans-serif; font-size: 1rem; color: rgba(255,255,255,0.68); line-height: 1.8; }

  .hc-contact-body { padding: 6rem 2rem; background: var(--hc-ivory); }
  .hc-contact-body-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; }

  .hc-form-section {}
  .hc-form-field { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
  .hc-form-label { font-family: 'Inter', system-ui, sans-serif; font-size: 0.72rem; font-weight: 500; color: var(--hc-navy); letter-spacing: 0.1em; text-transform: uppercase; }
  .hc-form-input {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; color: var(--hc-charcoal);
    background: var(--hc-white); border: 1px solid rgba(43,43,43,0.2);
    padding: 0.9rem 1rem; outline: none; transition: border-color 0.2s ease; width: 100%;
  }
  .hc-form-input:focus { border-color: var(--hc-mulberry); }
  .hc-form-textarea { min-height: 140px; resize: vertical; }
  .hc-form-select { font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem; color: var(--hc-charcoal); background: var(--hc-white); border: 1px solid rgba(43,43,43,0.2); padding: 0.9rem 1rem; outline: none; appearance: none; width: 100%; cursor: pointer; }
  .hc-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .hc-form-success { background: var(--hc-dusty-rose); padding: 2rem; text-align: center; }
  .hc-form-success-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.4rem; color: var(--hc-charcoal); margin-bottom: 0.75rem; }
  .hc-form-success-body { font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; color: var(--hc-navy); line-height: 1.7; }

  .hc-contact-aside {}
  .hc-aside-note { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.25rem; font-style: italic; color: var(--hc-charcoal); line-height: 1.5; border-left: 3px solid var(--hc-coral); padding-left: 1.5rem; margin-bottom: 2.5rem; }
  .hc-quick-links { display: flex; flex-direction: column; gap: 0; }
  .hc-quick-link-item { padding: 1.25rem 0; border-bottom: 1px solid rgba(43,43,43,0.1); display: flex; justify-content: space-between; align-items: center; text-decoration: none; transition: all 0.2s ease; }
  .hc-quick-link-item:first-child { border-top: 1px solid rgba(43,43,43,0.1); }
  .hc-quick-link-item:hover .hc-quick-link-title { color: var(--hc-mulberry); }
  .hc-quick-link-title { font-family: 'Inter', system-ui, sans-serif; font-size: 0.875rem; font-weight: 500; color: var(--hc-charcoal); }
  .hc-quick-link-desc { font-family: 'Inter', system-ui, sans-serif; font-size: 0.775rem; color: rgba(43,43,43,0.45); margin-top: 0.15rem; }
  .hc-quick-link-arrow { font-size: 0.8rem; color: var(--hc-coral); }
  .hc-contact-email { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid rgba(43,43,43,0.1); }
  .hc-contact-email-label { font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500; color: rgba(43,43,43,0.4); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .hc-contact-email-link { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.1rem; color: var(--hc-mulberry); text-decoration: none; font-style: italic; border-bottom: 1.5px solid var(--hc-mulberry); padding-bottom: 2px; }

  @media (max-width: 900px) {
    .hc-contact-hero-inner { grid-template-columns: 1fr; gap: 2rem; }
    .hc-contact-body-inner { grid-template-columns: 1fr; gap: 4rem; }
    .hc-form-row { grid-template-columns: 1fr; }
  }
`;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", org: "", email: "", pathway: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) setSubmitted(true);
  };

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>

      {/* Hero */}
      <section className="hc-contact-hero">
        <motion.div className="hc-contact-hero-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hc-contact-hero-inner">
          <div>
            <motion.span className="hc-eyebrow hc-eyebrow-light" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              Contact
            </motion.span>
            <motion.h1 className="hc-contact-hero-headline" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
              Begin a Conversation
            </motion.h1>
          </div>
          <motion.p className="hc-contact-hero-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}>
            Every engagement begins with a conversation. Whether you are ready to begin or simply curious about what is possible, we'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <section className="hc-contact-body">
        <div className="hc-contact-body-inner">

          {/* Form */}
          <div className="hc-form-section">
            <FadeUp><span className="hc-eyebrow">Send a Note</span></FadeUp>
            <FadeUp delay={0.1}><h2 className="hc-h2" style={{ marginBottom: "2rem" }}>Tell us about your work.</h2></FadeUp>

            {submitted ? (
              <motion.div className="hc-form-success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <p className="hc-form-success-title">Thank you for reaching out.</p>
                <p className="hc-form-success-body">
                  We've received your message and will be in touch within 3–5 business days. In the meantime, we invite you to explore the Journal.
                </p>
              </motion.div>
            ) : (
              <FadeUp delay={0.15}>
                <form onSubmit={handleSubmit}>
                  <div className="hc-form-row">
                    <div className="hc-form-field">
                      <label className="hc-form-label">Your Name *</label>
                      <input className="hc-form-input" type="text" required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="hc-form-field">
                      <label className="hc-form-label">Organization</label>
                      <input className="hc-form-input" type="text" placeholder="Organization or title" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
                    </div>
                  </div>
                  <div className="hc-form-field">
                    <label className="hc-form-label">Email Address *</label>
                    <input className="hc-form-input" type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="hc-form-field">
                    <label className="hc-form-label">Area of Interest</label>
                    <select className="hc-form-select" value={form.pathway} onChange={(e) => setForm({ ...form, pathway: e.target.value })}>
                      <option value="">Select a practice area</option>
                      {pathways.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
                    </select>
                  </div>
                  <div className="hc-form-field">
                    <label className="hc-form-label">Tell us about your work</label>
                    <textarea className="hc-form-input hc-form-textarea" placeholder="Share what's on your mind — there's no wrong answer." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <motion.button type="submit" className="hc-btn-primary" whileTap={{ scale: 0.97 }}>
                    Send a Note
                  </motion.button>
                </form>
              </FadeUp>
            )}
          </div>

          {/* Aside */}
          <div className="hc-contact-aside">
            <FadeUp delay={0.1}>
              <blockquote className="hc-aside-note">
                "Every engagement begins with a conversation worth having."
              </blockquote>
            </FadeUp>
            <FadeUp delay={0.18}><span className="hc-eyebrow hc-eyebrow-navy" style={{ marginBottom: "1.25rem" }}>Explore From Here</span></FadeUp>
            <FadeUp delay={0.22}>
              <div className="hc-quick-links">
                {quickLinks.map((l) => (
                  <Link key={l.label} href={l.href} className="hc-quick-link-item">
                    <div>
                      <div className="hc-quick-link-title">{l.label}</div>
                      <div className="hc-quick-link-desc">{l.desc}</div>
                    </div>
                    <span className="hc-quick-link-arrow">→</span>
                  </Link>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.28}>
              <div className="hc-contact-email">
                <p className="hc-contact-email-label">Or write directly</p>
                <a href="mailto:hello@hellocreativeandco.com" className="hc-contact-email-link">
                  hello@hellocreativeandco.com
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
