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

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#FFFFFF",
        borderBottom: "1px solid #BFC0C0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "1.15rem",
            fontWeight: 400,
            color: "#2D3142",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Hello Creative & Co.
        </a>

        <div
          className="hc-nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.25rem",
          }}
        >
          {["About", "Work With Us", "Events", "Writing", "Contact"].map(
            (link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  color: "#4F5D75",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#2D3142")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "#4F5D75")
                }
              >
                {link}
              </a>
            )
          )}
          <a
            href="#contact"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "#7A2E3A",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderBottom: "1.5px solid #7A2E3A",
              paddingBottom: "2px",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.opacity = "0.7")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.opacity = "1")
            }
          >
            Start a Conversation
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section
      id="about"
      style={{
        background: "#FFFFFF",
        padding: "7rem 2rem 6rem",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#7A2E3A",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
          }}
        >
          Founded by M. Louis
        </p>
        <h1
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(2.4rem, 5vw, 3.75rem)",
            fontWeight: 400,
            color: "#2D3142",
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
            marginBottom: "2rem",
            maxWidth: 820,
          }}
        >
          Identity, leadership, and collaboration architecture for women leaders
          and the institutions that support them.
        </h1>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 400,
            color: "#4F5D75",
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: "3rem",
          }}
        >
          Hello Creative & Co. helps women leaders and mission-driven
          organizations move from identity clarity to leadership architecture to
          values-aligned collaboration systems.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <HeroButton href="#work-with-us" primary>
            Work With Us
          </HeroButton>
          <HeroButton href="#writing">Read the Notes</HeroButton>
        </div>
      </div>
    </section>
  );
}

function HeroButton({
  children,
  href,
  primary,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    display: "inline-block",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "0.8125rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textDecoration: "none",
    padding: "0.875rem 2rem",
    border: "1.5px solid",
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  if (primary) {
    return (
      <a
        href={href}
        style={{
          ...base,
          background: hovered ? "#5f2430" : "#7A2E3A",
          borderColor: hovered ? "#5f2430" : "#7A2E3A",
          color: "#FFFFFF",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      style={{
        ...base,
        background: "transparent",
        borderColor: hovered ? "#2D3142" : "#BFC0C0",
        color: "#2D3142",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

function Divider() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 2rem",
      }}
    >
      <div style={{ height: 1, background: "#BFC0C0" }} />
    </div>
  );
}

function Positioning() {
  return (
    <section
      style={{
        background: "#FAFAF9",
        padding: "5rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 400,
            color: "#2D3142",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          A studio for identity, leadership, and institutional design.
        </h2>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "1rem",
            fontWeight: 400,
            color: "#4F5D75",
            lineHeight: 1.8,
          }}
        >
          Hello Creative & Co. sits at the intersection of strategic design,
          leadership development, creative intelligence, and systems thinking.
          We support women and organizations as they clarify who they are, how
          they lead, and what structures they need in order to grow with
          integrity.
        </p>
      </div>
    </section>
  );
}

function OfferPathways() {
  return (
    <section id="work-with-us" style={{ background: "#FFFFFF", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#7A2E3A",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Ways to work together
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 400,
            color: "#2D3142",
            marginBottom: "3rem",
            letterSpacing: "-0.01em",
          }}
        >
          The work takes many forms.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0",
            border: "1px solid #BFC0C0",
          }}
        >
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
      style={{
        padding: "2.5rem",
        borderRight: "1px solid #BFC0C0",
        background: hovered ? "#FAFAF9" : "#FFFFFF",
        transition: "background 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "1.25rem",
          fontWeight: 400,
          color: "#2D3142",
          letterSpacing: "-0.01em",
        }}
      >
        {pathway.title}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.9rem",
          color: "#4F5D75",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {pathway.description}
      </p>
      <a
        href="#contact"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#7A2E3A",
          textDecoration: "none",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        {pathway.cta} →
      </a>
    </div>
  );
}

function Frameworks() {
  return (
    <section
      style={{
        background: "#2D3142",
        padding: "5rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#D4AFB9",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Point of View
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 400,
            color: "#FFFFFF",
            marginBottom: "3.5rem",
            letterSpacing: "-0.01em",
            maxWidth: 560,
          }}
        >
          The work is guided by a clear point of view.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0",
            borderTop: "1px solid rgba(191,192,192,0.25)",
          }}
        >
          {frameworks.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "2rem 2rem 2rem 0",
                borderBottom: "1px solid rgba(191,192,192,0.25)",
                paddingRight: "2.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: "#D4AFB9",
                  marginBottom: "0.75rem",
                  letterSpacing: "0.01em",
                }}
              >
                {f.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.75,
                }}
              >
                {f.description}
              </p>
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
    <section id="events" style={{ background: "#FFFFFF", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#7A2E3A",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Upcoming Events
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 400,
            color: "#2D3142",
            marginBottom: "3rem",
            letterSpacing: "-0.01em",
          }}
        >
          Conversations worth having.
        </h2>

        {events.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1px",
              background: "#BFC0C0",
              border: "1px solid #BFC0C0",
              marginBottom: "3rem",
            }}
          >
            {events.map((event, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      background: "#4F5D75",
                      padding: "0.2rem 0.6rem",
                    }}
                  >
                    {event.format}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: "0.8rem",
                      color: "#BFC0C0",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {event.date}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: "#2D3142",
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "0.9rem",
                    color: "#4F5D75",
                    lineHeight: 1.7,
                    flex: 1,
                  }}
                >
                  {event.description}
                </p>
                <a
                  href={event.link}
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#7A2E3A",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {event.cta} →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "1rem",
              color: "#4F5D75",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            No upcoming events are currently open. Join the list to receive the
            next invitation.
          </p>
        )}

        <div
          style={{
            background: "#FAFAF9",
            border: "1px solid #BFC0C0",
            padding: "2.5rem",
            maxWidth: 520,
          }}
        >
          <p
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "1.1rem",
              fontWeight: 400,
              color: "#2D3142",
              marginBottom: "1.25rem",
            }}
          >
            Join the list to receive the next invitation.
          </p>
          {submitted ? (
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "0.875rem",
                color: "#7A2E3A",
              }}
            >
              Thank you — you're on the list.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  flex: 1,
                  minWidth: 200,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.875rem",
                  color: "#2D3142",
                  background: "#FFFFFF",
                  border: "1px solid #BFC0C0",
                  padding: "0.75rem 1rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "#7A2E3A",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                }}
              >
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
    <section id="writing" style={{ background: "#FAFAF9", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#7A2E3A",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Writing & Notes
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 400,
            color: "#2D3142",
            marginBottom: "3rem",
            letterSpacing: "-0.01em",
          }}
        >
          Ideas in progress.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1px",
            background: "#BFC0C0",
            border: "1px solid #BFC0C0",
          }}
        >
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
      style={{
        background: hovered ? "#FFFFFF" : "#FAFAF9",
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#7A2E3A",
          }}
        >
          {writing.category}
        </span>
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.8rem",
            color: "#BFC0C0",
          }}
        >
          {writing.date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "1.2rem",
          fontWeight: 400,
          color: "#2D3142",
          lineHeight: 1.3,
        }}
      >
        {writing.title}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.9rem",
          color: "#4F5D75",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {writing.excerpt}
      </p>
      <a
        href={writing.link}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#7A2E3A",
          textDecoration: "none",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Read More →
      </a>
    </div>
  );
}

function Founder() {
  return (
    <section style={{ background: "#FFFFFF", padding: "5rem 2rem" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              width: "100%",
              aspectRatio: "4/5",
              background: "#D4AFB9",
              maxWidth: 360,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "5rem",
                  fontWeight: 400,
                  color: "rgba(45,49,66,0.25)",
                  letterSpacing: "0.05em",
                }}
              >
                ML
              </span>
            </div>
          </div>
        </div>
        <div>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#7A2E3A",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            About M. Louis
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 400,
              color: "#2D3142",
              marginBottom: "1.5rem",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            Founder & Principal
          </h2>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "1rem",
              color: "#4F5D75",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            M. Louis is the founder of Hello Creative & Co., an identity,
            leadership, and institutional design studio serving women leaders
            and mission-driven organizations. Her work sits at the intersection
            of editorial strategy, leadership development, collaboration design,
            and cultural systems thinking.
          </p>
          <a
            href="#contact"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#7A2E3A",
              textDecoration: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderBottom: "1.5px solid #7A2E3A",
              paddingBottom: "2px",
            }}
          >
            Learn More →
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      id="contact"
      style={{
        background: "#FAFAF9",
        borderTop: "1px solid #BFC0C0",
        padding: "6rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "#2D3142",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            marginBottom: "1.5rem",
          }}
        >
          If you're building what comes next, begin with a conversation.
        </h2>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "1rem",
            color: "#4F5D75",
            lineHeight: 1.8,
            marginBottom: "3rem",
          }}
        >
          Whether you are clarifying your own leadership identity, designing a
          program, convening a room, or strengthening collaboration inside an
          institution, Hello Creative & Co. helps bring the work into form.
        </p>
        <a
          href="mailto:hello@hellocreativeandco.com"
          style={{
            display: "inline-block",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "1rem 2.5rem",
            background: "#7A2E3A",
            color: "#FFFFFF",
            border: "none",
            transition: "background 0.2s ease",
          }}
        >
          Start a Conversation
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "#2D3142",
        padding: "2.5rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "1rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Hello Creative & Co.
        </span>
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.04em",
          }}
        >
          © 2025 Hello Creative & Co. All rights reserved.
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

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .hc-nav-links {
          display: flex;
        }

        @media (max-width: 768px) {
          .hc-nav-links {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hc-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
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
