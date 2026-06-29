import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";

const links = [
  { label: "About", href: "/about" },
  { label: "The Studio", href: "/studio" },
  { label: "Work With Us", href: "/work-with-us" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const navStyles = `
  .hc-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(248,245,242,0.95);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(43,43,43,0.1);
    transition: box-shadow 0.3s ease;
  }
  .hc-nav-scrolled { box-shadow: 0 2px 32px rgba(43,43,43,0.06); }
  .hc-nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between; height: 76px;
  }
  .hc-logo {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.05rem; font-weight: 400;
    color: var(--hc-charcoal); text-decoration: none;
    letter-spacing: 0.01em; white-space: nowrap;
  }
  .hc-logo:hover { color: var(--hc-mulberry); transition: color 0.2s ease; }
  .hc-nav-links { display: flex; align-items: center; gap: 2.5rem; }
  .hc-nav-link {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.8rem; font-weight: 400;
    color: var(--hc-navy); text-decoration: none;
    letter-spacing: 0.07em; text-transform: uppercase; transition: color 0.2s ease;
    position: relative; padding-bottom: 2px;
  }
  .hc-nav-link::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 1.5px; background: var(--hc-mulberry);
    transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease;
  }
  .hc-nav-link:hover { color: var(--hc-mulberry); }
  .hc-nav-link:hover::after, .hc-nav-link-active::after { transform: scaleX(1); }
  .hc-nav-link-active { color: var(--hc-mulberry); }
  .hc-nav-cta {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.775rem; font-weight: 500;
    color: var(--hc-white); text-decoration: none;
    letter-spacing: 0.07em; text-transform: uppercase;
    background: var(--hc-mulberry); padding: 0.7rem 1.4rem;
    transition: background 0.2s ease;
  }
  .hc-nav-cta:hover { background: #5f2430; }
  .hc-hamburger {
    display: none; background: none; border: none; cursor: pointer;
    color: var(--hc-charcoal); padding: 4px; line-height: 1;
  }
  .hc-mobile-menu { background: var(--hc-ivory); border-top: 1px solid rgba(43,43,43,0.1); }
  .hc-mobile-menu-inner { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .hc-mobile-link {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.9rem; font-weight: 400;
    color: var(--hc-navy); text-decoration: none;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .hc-mobile-cta {
    display: inline-block; font-family: 'Inter', system-ui, sans-serif; font-size: 0.8rem; font-weight: 500;
    color: var(--hc-white); background: var(--hc-mulberry); text-decoration: none;
    letter-spacing: 0.07em; text-transform: uppercase; padding: 0.85rem 1.75rem;
    width: fit-content;
  }
  @media (max-width: 900px) {
    .hc-nav-links { display: none; }
    .hc-hamburger { display: flex; align-items: center; }
  }
`;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <>
      <style>{navStyles}</style>
      <nav className={`hc-nav${scrolled ? " hc-nav-scrolled" : ""}`}>
        <motion.div
          className="hc-nav-inner"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="hc-logo">Hello Creative &amp; Co.</Link>

          <div className="hc-nav-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hc-nav-link${location === l.href ? " hc-nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="hc-nav-cta">Begin a Conversation</Link>
          </div>

          <button
            className="hc-hamburger"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {open ? (
                <>
                  <line x1="5" y1="5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="17" y1="5" x2="5" y2="17" stroke="currentColor" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.5" />
                </>
              )}
            </svg>
          </button>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="hc-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="hc-mobile-menu-inner">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="hc-mobile-link">
                    {l.label}
                  </Link>
                ))}
                <Link href="/contact" className="hc-mobile-cta">Begin a Conversation</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
