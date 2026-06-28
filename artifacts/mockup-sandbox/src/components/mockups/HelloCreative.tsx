import { useState } from "react";

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
    excerpt:
      "A note on being seen without becoming flattened by the gaze of others.",
    link: "#",
  },
  {
    title: "Leadership Needs Architecture",
    category: "Leadership",
    date: "Coming Soon",
    excerpt:
      "A reflection on building structures that support identity, trust, and sustainable influence.",
    link: "#",
  },
  {
    title: "Creative Intelligence at Work",
    category: "Creative Intelligence",
    date: "Coming Soon",
    excerpt:
      "On discernment, imagination, and strategic depth as leadership practices.",
    link: "#",
  },
];

const frameworks = [
  {
    name: "Creative Intelligence",
    description:
      "A lens for approaching identity, leadership, aesthetics, and growth with imagination, discernment, and strategic depth.",
  },
  {
    name: "Collective Leadership Architecture™",
    description:
      "A way of thinking about leadership as an ecosystem shaped by trust, visibility, sponsorship, and support.",
  },
  {
    name: "PAC Framework™",
    description:
      "A collaboration framework for creating more aligned, clear, and sustainable ways of working together.",
  },
  {
    name: "Ethics-Embedded Operations",
    description:
      "An approach to ensuring values show up in decisions, systems, and day-to-day practice.",
  },
];

const pathways = [
  {
    title: "Advisory",
    description:
      "Strategic support for leaders, teams, and institutions navigating identity, collaboration, and systems change.",
    cta: "Explore Advisory",
  },
  {
    title: "Programs",
    description:
      "Structured leadership development experiences for women, cohorts, and organizations.",
    cta: "Explore Programs",
  },
  {
    title: "Events",
    description:
      "Curated salons, conversations, and gatherings for women thinking deeply about leadership, identity, creativity, and change.",
    cta: "View Events",
  },
  {
    title: "Writing",
    description:
      "Essays, notes, and reflections from M. Louis on identity, leadership, visibility, collaboration, and creative intelligence.",
    cta: "Read Writing",
  },
];

const navLinks = ["About", "Work With Us", "Events", "Writing", "Contact"];

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="hc-nav">
      <div className="hc-nav-inner">
        <a href="#" className="hc-logo">
          Hello Creative &amp; Co.
        </a>

        {/* Desktop links */}
        <div className="hc-nav-links-desktop">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              className="hc-nav-link"
            >
              {link}
            </a>
          ))}
          <a href="#contact" className="hc-nav-cta">
            Start a Conversation
          </a>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="hc-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="hc-mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              className="hc-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            className="hc-mobile-cta"
            onClick={() => setMenuOpen(false)}
          >
            Start a Conversation
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="about" className="hc-section hc-hero">
      <div className="hc-container">
        <p className="hc-eyebrow">Founded by M. Louis</p>
        <h1 className="hc-hero-headline">
          Identity, leadership, and collaboration architecture for women leaders
          and the institutions that support them.
        </h1>
        <p className="hc-hero-sub">
          Hello Creative &amp; Co. helps women leaders and mission-driven
          organizations move from identity clarity to leadership architecture to
          values-aligned collaboration systems.
        </p>
        <div className="hc-hero-ctas">
          <a href="#work-with-us" className="hc-btn-primary">
            Work With Us
          </a>
          <a href="#writing" className="hc-btn-outline">
            Read the Notes
          </a>
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="hc-container">
      <div className="hc-divider" />
    </div>
  );
}

function Positioning() {
  return (
    <section className="hc-section hc-paper-soft">
      <div className="hc-container hc-grid-2">
        <h2 className="hc-section-headline">
          A studio for identity, leadership, and institutional design.
        </h2>
        <p className="hc-body-text">
          Hello Creative &amp; Co. sits at the intersection of strategic design,
          leadership development, creative intelligence, and systems thinking. We
          support women and organizations as they clarify who they are, how they
          lead, and what structures they need in order to grow with integrity.
        </p>
      </div>
    </section>
  );
}

function OfferPathways() {
  return (
    <section id="work-with-us" className="hc-section hc-paper">
      <div className="hc-container">
        <p className="hc-eyebrow">Ways to work together</p>
        <h2 className="hc-section-headline" style={{ marginBottom: "3rem" }}>
          The work takes many forms.
        </h2>
        <div className="hc-pathway-grid">
          {pathways.map((p, i) => (
            <PathwayCard key={i} pathway={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PathwayCard({
  pathway,
}: {
  pathway: { title: string; description: string; cta: string };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hc-pathway-card"
      style={{ background: hovered ? "var(--hc-paper-soft)" : "var(--hc-paper)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="hc-card-title">{pathway.title}</h3>
      <p className="hc-card-body">{pathway.description}</p>
      <a href="#contact" className="hc-link-arrow">
        {pathway.cta} →
      </a>
    </div>
  );
}

function Frameworks() {
  return (
    <section className="hc-section hc-dark">
      <div className="hc-container">
        <p className="hc-eyebrow hc-eyebrow-light">Point of View</p>
        <h2 className="hc-section-headline hc-headline-light" style={{ maxWidth: 560, marginBottom: "3.5rem" }}>
          The work is guided by a clear point of view.
        </h2>
        <div className="hc-framework-grid">
          {frameworks.map((f, i) => (
            <div key={i} className="hc-framework-item">
              <h3 className="hc-framework-title">{f.name}</h3>
              <p className="hc-framework-body">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Events() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="events" className="hc-section hc-paper">
      <div className="hc-container">
        <p className="hc-eyebrow">Upcoming Events</p>
        <h2 className="hc-section-headline" style={{ marginBottom: "3rem" }}>
          Conversations worth having.
        </h2>

        {events.length > 0 && (
          <div className="hc-events-grid">
            {events.map((event, i) => (
              <div key={i} className="hc-event-card">
                <div className="hc-event-meta">
                  <span className="hc-event-format">{event.format}</span>
                  <span className="hc-event-date">{event.date}</span>
                </div>
                <h3 className="hc-card-title">{event.title}</h3>
                <p className="hc-card-body">{event.description}</p>
                <a href={event.link} className="hc-link-arrow">
                  {event.cta} →
                </a>
              </div>
            ))}
          </div>
        )}

        {events.length === 0 && (
          <p className="hc-body-text" style={{ marginBottom: "2rem" }}>
            No upcoming events are currently open. Join the list to receive the
            next invitation.
          </p>
        )}

        <div className="hc-email-capture">
          <p className="hc-email-heading">
            Join the list to receive the next invitation.
          </p>
          {submitted ? (
            <p className="hc-email-confirm">Thank you — you're on the list.</p>
          ) : (
            <form
              className="hc-email-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="hc-email-input"
              />
              <button type="submit" className="hc-btn-primary">
                Join the List
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="hc-section hc-paper-soft">
      <div className="hc-container">
        <p className="hc-eyebrow">Writing &amp; Notes</p>
        <h2 className="hc-section-headline" style={{ marginBottom: "3rem" }}>
          Ideas in progress.
        </h2>
        <div className="hc-writing-grid">
          {writings.map((w, i) => (
            <WritingCard key={i} writing={w} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingCard({
  writing,
}: {
  writing: {
    title: string;
    category: string;
    date: string;
    excerpt: string;
    link: string;
  };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hc-writing-card"
      style={{ background: hovered ? "var(--hc-paper)" : "var(--hc-paper-soft)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hc-writing-meta">
        <span className="hc-writing-category">{writing.category}</span>
        <span className="hc-event-date">{writing.date}</span>
      </div>
      <h3 className="hc-card-title">{writing.title}</h3>
      <p className="hc-card-body">{writing.excerpt}</p>
      <a href={writing.link} className="hc-link-arrow">
        Read More →
      </a>
    </div>
  );
}

function Founder() {
  return (
    <section className="hc-section hc-paper">
      <div className="hc-container hc-grid-2 hc-founder-grid">
        <div>
          <div className="hc-founder-photo">
            <span className="hc-founder-monogram">ML</span>
          </div>
        </div>
        <div>
          <p className="hc-eyebrow">About M. Louis</p>
          <h2 className="hc-section-headline">Founder &amp; Principal</h2>
          <p className="hc-body-text" style={{ marginBottom: "2rem" }}>
            M. Louis is the founder of Hello Creative &amp; Co., an identity,
            leadership, and institutional design studio serving women leaders and
            mission-driven organizations. Her work sits at the intersection of
            editorial strategy, leadership development, collaboration design, and
            cultural systems thinking.
          </p>
          <a href="#contact" className="hc-link-underline">
            Learn More →
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" className="hc-section hc-paper-soft hc-final-cta">
      <div className="hc-container hc-text-center">
        <h2 className="hc-cta-headline">
          If you're building what comes next, begin with a conversation.
        </h2>
        <p className="hc-cta-body">
          Whether you are clarifying your own leadership identity, designing a
          program, convening a room, or strengthening collaboration inside an
          institution, Hello Creative &amp; Co. helps bring the work into form.
        </p>
        <a href="mailto:hello@hellocreativeandco.com" className="hc-btn-primary">
          Start a Conversation
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="hc-footer">
      <div className="hc-container hc-footer-inner">
        <span className="hc-footer-logo">Hello Creative &amp; Co.</span>
        <span className="hc-footer-copy">
          © 2025 Hello Creative &amp; Co. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default function HelloCreative() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        /* ── Brand tokens (consumed via var()) ── */
        .hc-root {
          --hc-ink: var(--hc-ink-primary, #2D3142);
          --hc-accent: var(--hc-accent-premium, #7A2E3A);
          --hc-warm: var(--hc-neutral-warm, #D4AFB9);
          --hc-cool: var(--hc-support-cool, #4F5D75);
          --hc-soft: var(--hc-neutral-soft, #BFC0C0);
          --hc-signal: var(--hc-accent-signal, #DE6449);
          --hc-white: var(--hc-paper, #FFFFFF);
          --hc-offwhite: var(--hc-paper-soft, #FAFAF9);
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--hc-ink);
        }

        /* ── Layout ── */
        .hc-container  { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .hc-section    { padding: 5rem 2rem; }
        .hc-paper      { background: var(--hc-white); }
        .hc-paper-soft { background: var(--hc-offwhite); }
        .hc-dark       { background: var(--hc-ink); }
        .hc-hero       { padding: 7rem 2rem 6rem; }
        .hc-final-cta  { border-top: 1px solid var(--hc-soft); padding: 6rem 2rem; }
        .hc-text-center { text-align: center; }

        /* ── Nav ── */
        .hc-nav {
          position: sticky; top: 0; z-index: 100;
          background: var(--hc-white);
          border-bottom: 1px solid var(--hc-soft);
        }
        .hc-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between;
          height: 72px;
        }
        .hc-logo {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.1rem; font-weight: 400;
          color: var(--hc-ink); text-decoration: none; letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .hc-nav-links-desktop {
          display: flex; align-items: center; gap: 2.25rem;
        }
        .hc-nav-link {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8125rem; font-weight: 400;
          color: var(--hc-cool); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: color 0.2s ease;
        }
        .hc-nav-link:hover { color: var(--hc-ink); }
        .hc-nav-cta {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8125rem; font-weight: 500;
          color: var(--hc-accent); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-bottom: 1.5px solid var(--hc-accent); padding-bottom: 2px;
          transition: opacity 0.2s ease;
        }
        .hc-nav-cta:hover { opacity: 0.7; }
        .hc-hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          color: var(--hc-ink); padding: 4px;
        }
        .hc-mobile-menu {
          background: var(--hc-white);
          border-top: 1px solid var(--hc-soft);
          padding: 1.5rem 2rem;
          display: flex; flex-direction: column; gap: 1.25rem;
        }
        .hc-mobile-link {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.9rem; font-weight: 400;
          color: var(--hc-cool); text-decoration: none;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .hc-mobile-cta {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.9rem; font-weight: 500;
          color: var(--hc-accent); text-decoration: none;
          letter-spacing: 0.05em; text-transform: uppercase;
          border-bottom: 1.5px solid var(--hc-accent); width: fit-content;
          padding-bottom: 2px;
        }

        /* ── Divider ── */
        .hc-divider { height: 1px; background: var(--hc-soft); }

        /* ── Typography ── */
        .hc-eyebrow {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.75rem; font-weight: 500;
          color: var(--hc-accent); letter-spacing: 0.14em;
          text-transform: uppercase; margin-bottom: 1rem; display: block;
        }
        .hc-eyebrow-light { color: var(--hc-warm); }
        .hc-section-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 400; color: var(--hc-ink);
          letter-spacing: -0.01em; line-height: 1.25;
          margin-bottom: 1.25rem;
        }
        .hc-headline-light { color: #FFFFFF; }
        .hc-hero-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 3.75rem);
          font-weight: 400; color: var(--hc-ink);
          line-height: 1.18; letter-spacing: -0.01em;
          margin-bottom: 2rem; max-width: 820px;
        }
        .hc-hero-sub {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1.125rem; color: var(--hc-cool); line-height: 1.7;
          max-width: 640px; margin-bottom: 3rem;
        }
        .hc-body-text {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1rem; color: var(--hc-cool); line-height: 1.8;
        }
        .hc-cta-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3rem); font-weight: 400;
          color: var(--hc-ink); line-height: 1.2; letter-spacing: -0.01em;
          margin-bottom: 1.5rem; max-width: 680px; margin-left: auto; margin-right: auto;
        }
        .hc-cta-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1rem; color: var(--hc-cool); line-height: 1.8;
          max-width: 560px; margin: 0 auto 3rem;
        }

        /* ── Buttons ── */
        .hc-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
        .hc-btn-primary {
          display: inline-block;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8125rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; padding: 0.875rem 2rem;
          background: var(--hc-accent); color: #FFFFFF; border: 1.5px solid var(--hc-accent);
          transition: background 0.2s ease, border-color 0.2s ease; cursor: pointer;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .hc-btn-primary:hover { background: #5f2430; border-color: #5f2430; }
        .hc-btn-outline {
          display: inline-block;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8125rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; padding: 0.875rem 2rem;
          background: transparent; color: var(--hc-ink); border: 1.5px solid var(--hc-soft);
          transition: border-color 0.2s ease;
        }
        .hc-btn-outline:hover { border-color: var(--hc-ink); }
        .hc-link-arrow {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.75rem; font-weight: 500;
          color: var(--hc-accent); text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .hc-link-underline {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.75rem; font-weight: 500;
          color: var(--hc-accent); text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-bottom: 1.5px solid var(--hc-accent); padding-bottom: 2px;
        }

        /* ── Cards ── */
        .hc-card-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.2rem; font-weight: 400;
          color: var(--hc-ink); line-height: 1.3; letter-spacing: -0.01em;
        }
        .hc-card-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.9rem; color: var(--hc-cool); line-height: 1.7; flex: 1;
        }

        /* ── Grid layouts ── */
        .hc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center;
        }
        .hc-founder-grid { gap: 5rem; }
        .hc-pathway-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          border: 1px solid var(--hc-soft);
        }
        .hc-pathway-card {
          padding: 2.5rem; border-right: 1px solid var(--hc-soft);
          display: flex; flex-direction: column; gap: 1rem;
          transition: background 0.2s ease;
        }
        .hc-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px; background: var(--hc-soft);
          border: 1px solid var(--hc-soft); margin-bottom: 3rem;
        }
        .hc-event-card {
          background: var(--hc-white); padding: 2.5rem;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .hc-event-meta { display: flex; gap: 0.75rem; align-items: center; }
        .hc-event-format {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #FFFFFF; background: var(--hc-cool); padding: 0.2rem 0.6rem;
        }
        .hc-event-date {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8rem; color: var(--hc-soft); letter-spacing: 0.04em;
        }
        .hc-writing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1px; background: var(--hc-soft); border: 1px solid var(--hc-soft);
        }
        .hc-writing-card {
          padding: 2.5rem; display: flex; flex-direction: column; gap: 1rem;
          transition: background 0.2s ease;
        }
        .hc-writing-meta { display: flex; justify-content: space-between; align-items: center; }
        .hc-writing-category {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--hc-accent);
        }
        .hc-framework-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          border-top: 1px solid rgba(191,192,192,0.25);
        }
        .hc-framework-item {
          padding: 2rem 2.5rem 2rem 0;
          border-bottom: 1px solid rgba(191,192,192,0.25);
        }
        .hc-framework-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.05rem; font-weight: 400;
          color: var(--hc-warm); margin-bottom: 0.75rem;
        }
        .hc-framework-body {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.875rem; color: rgba(255,255,255,0.7); line-height: 1.75;
        }

        /* ── Founder photo ── */
        .hc-founder-photo {
          width: 100%; max-width: 360px; aspect-ratio: 4/5;
          background: var(--hc-warm);
          display: flex; align-items: center; justify-content: center;
        }
        .hc-founder-monogram {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 5rem; font-weight: 400;
          color: rgba(45,49,66,0.25); letter-spacing: 0.05em;
        }

        /* ── Email capture ── */
        .hc-email-capture {
          background: var(--hc-offwhite); border: 1px solid var(--hc-soft);
          padding: 2.5rem; max-width: 520px;
        }
        .hc-email-heading {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.1rem; font-weight: 400;
          color: var(--hc-ink); margin-bottom: 1.25rem;
        }
        .hc-email-confirm {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.875rem; color: var(--hc-accent);
        }
        .hc-email-form { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .hc-email-input {
          flex: 1; min-width: 200px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.875rem; color: var(--hc-ink);
          background: var(--hc-white); border: 1px solid var(--hc-soft);
          padding: 0.75rem 1rem; outline: none;
        }
        .hc-email-input:focus { border-color: var(--hc-cool); }

        /* ── Footer ── */
        .hc-footer { background: var(--hc-ink); padding: 2.5rem 2rem; }
        .hc-footer-inner {
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .hc-footer-logo {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1rem; font-weight: 400; color: rgba(255,255,255,0.7);
        }
        .hc-footer-copy {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8rem; color: rgba(255,255,255,0.4); letter-spacing: 0.04em;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hc-nav-links-desktop { display: none; }
          .hc-hamburger { display: flex; align-items: center; }
          .hc-section { padding: 3.5rem 1.25rem; }
          .hc-container { padding: 0 1.25rem; }
          .hc-hero { padding: 4rem 1.25rem 3.5rem; }
          .hc-grid-2 {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .hc-hero-headline { font-size: 2.2rem; }
          .hc-hero-sub { font-size: 1rem; }
          .hc-pathway-grid { grid-template-columns: 1fr; }
          .hc-pathway-card { border-right: none; border-bottom: 1px solid var(--hc-soft); }
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
