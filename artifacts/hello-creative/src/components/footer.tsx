import { Link } from "wouter";
import { motion } from "framer-motion";

const footerStyles = `
  .hc-footer { background: var(--hc-charcoal); padding: 4rem 2rem 2.5rem; }
  .hc-footer-inner { max-width: 1200px; margin: 0 auto; }
  .hc-footer-top {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 3rem;
    padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 2rem;
  }
  .hc-footer-brand {}
  .hc-footer-logo {
    font-family: 'DM Serif Display', Georgia, serif; font-size: 1.1rem; font-weight: 400;
    color: rgba(255,255,255,0.85); display: block; margin-bottom: 1rem;
    text-decoration: none;
  }
  .hc-footer-tagline {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem;
    color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 240px;
  }
  .hc-footer-col-title {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 500;
    color: rgba(255,255,255,0.35); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 1.25rem;
  }
  .hc-footer-links { display: flex; flex-direction: column; gap: 0.75rem; }
  .hc-footer-link {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem; font-weight: 300;
    color: rgba(255,255,255,0.55); text-decoration: none;
    transition: color 0.2s ease;
  }
  .hc-footer-link:hover { color: rgba(255,255,255,0.85); }
  .hc-footer-bottom {
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
  }
  .hc-footer-copy {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem;
    color: rgba(255,255,255,0.3); letter-spacing: 0.04em;
  }
  .hc-footer-sub-link {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem;
    color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s ease;
  }
  .hc-footer-sub-link:hover { color: rgba(255,255,255,0.6); }
  @media (max-width: 768px) {
    .hc-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .hc-footer { padding: 3rem 1.25rem 2rem; }
  }
  @media (max-width: 480px) {
    .hc-footer-top { grid-template-columns: 1fr; }
  }
`;

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="hc-footer">
        <div className="hc-footer-inner">
          <div className="hc-footer-top">
            <div className="hc-footer-brand">
              <Link href="/" className="hc-footer-logo">Hello Creative &amp; Co.</Link>
              <p className="hc-footer-tagline">
                A Black-owned, woman-led leadership studio shaping the conversations, systems, and structures that transform vision into lasting impact.
              </p>
            </div>
            <div>
              <p className="hc-footer-col-title">Studio</p>
              <div className="hc-footer-links">
                <Link href="/about" className="hc-footer-link">About</Link>
                <Link href="/studio" className="hc-footer-link">The Studio</Link>
                <Link href="/work-with-us" className="hc-footer-link">Work With Us</Link>
              </div>
            </div>
            <div>
              <p className="hc-footer-col-title">Connect</p>
              <div className="hc-footer-links">
                <Link href="/journal" className="hc-footer-link">Journal</Link>
                <Link href="/contact" className="hc-footer-link">Contact</Link>
                <a href="https://substack.com" target="_blank" rel="noopener noreferrer" className="hc-footer-link">Substack ↗</a>
              </div>
            </div>
            <div>
              <p className="hc-footer-col-title">Practice Areas</p>
              <div className="hc-footer-links">
                <Link href="/work-with-us" className="hc-footer-link">Leadership Development</Link>
                <Link href="/work-with-us" className="hc-footer-link">Strategic Facilitation</Link>
                <Link href="/work-with-us" className="hc-footer-link">Organizational Consulting</Link>
                <Link href="/work-with-us" className="hc-footer-link">Salon Soirées</Link>
              </div>
            </div>
          </div>
          <div className="hc-footer-bottom">
            <span className="hc-footer-copy">© 2025 Hello Creative &amp; Co. All rights reserved.</span>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <a href="#" className="hc-footer-sub-link">Privacy</a>
              <a href="#" className="hc-footer-sub-link">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
