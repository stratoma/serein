import { useRef } from "react";
import { motion, useInView, useSpring } from "framer-motion";

export function FadeUp({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeadline({
  text,
  tag: Tag = "h1",
  className = "",
  style = {},
}: {
  text: string;
  tag?: "h1" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
  };
  const word = {
    hidden: { opacity: 0, y: "100%", rotateX: -12 },
    visible: {
      opacity: 1, y: "0%", rotateX: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  return (
    <Tag className={className} style={{ perspective: "900px", ...style }}>
      <motion.span
        style={{ display: "block" }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {words.map((w, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.28em" }}
          >
            <motion.span style={{ display: "inline-block" }} variants={word}>{w}</motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

export function MagneticButton({
  children,
  href,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  onClick?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const variantClass =
    variant === "primary" ? "hc-btn-primary" :
    variant === "outline" ? "hc-btn-outline" : "hc-btn-ghost";

  return (
    <motion.div
      ref={wrapRef}
      style={{ x, y, display: "inline-block" }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {href ? (
        <a href={href} className={variantClass}>{children}</a>
      ) : (
        <button onClick={onClick} className={variantClass}>{children}</button>
      )}
    </motion.div>
  );
}

export const sharedStyles = `
  /* ── Shared Layout ── */
  .hc-container   { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
  .hc-section     { padding: 6rem 2rem; }
  .hc-section-sm  { padding: 4rem 2rem; }
  .hc-bg-ivory    { background: var(--hc-ivory); }
  .hc-bg-white    { background: var(--hc-white); }
  .hc-bg-navy     { background: var(--hc-navy); }
  .hc-bg-charcoal { background: var(--hc-charcoal); }
  .hc-bg-rose     { background: var(--hc-dusty-rose); }
  .hc-text-center { text-align: center; }

  /* ── Typography ── */
  .hc-eyebrow {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.72rem; font-weight: 500;
    color: var(--hc-mulberry); letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 1rem; display: block;
  }
  .hc-eyebrow-light { color: var(--hc-dusty-rose); }
  .hc-eyebrow-navy  { color: rgba(46,64,87,0.55); }
  .hc-display {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(2.5rem, 5.5vw, 4.25rem); font-weight: 400;
    color: var(--hc-charcoal); line-height: 1.12; letter-spacing: -0.02em;
  }
  .hc-h2 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: clamp(1.8rem, 3.2vw, 2.5rem); font-weight: 400;
    color: var(--hc-charcoal); line-height: 1.2; letter-spacing: -0.01em;
  }
  .hc-h2-light { color: #FFFFFF; }
  .hc-h3 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.2rem; font-weight: 400; color: var(--hc-charcoal); line-height: 1.3;
  }
  .hc-lead {
    font-family: 'Inter', system-ui, sans-serif; font-size: 1.1rem;
    color: var(--hc-navy); line-height: 1.8; max-width: 620px;
  }
  .hc-body {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.95rem;
    color: var(--hc-navy); line-height: 1.8;
  }
  .hc-body-light { color: rgba(255,255,255,0.7); }
  .hc-body-muted { color: rgba(43,43,43,0.55); }
  .hc-divider { height: 1px; background: rgba(43,43,43,0.1); }

  /* ── Buttons ── */
  .hc-btn-primary {
    display: inline-block; font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none; padding: 1rem 2.25rem;
    background: var(--hc-mulberry); color: #FFFFFF; border: 1.5px solid var(--hc-mulberry);
    transition: background 0.22s ease, border-color 0.22s ease; cursor: pointer;
  }
  .hc-btn-primary:hover { background: #5f2430; border-color: #5f2430; }
  .hc-btn-coral {
    display: inline-block; font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none; padding: 1rem 2.25rem;
    background: var(--hc-coral); color: #FFFFFF; border: 1.5px solid var(--hc-coral);
    transition: background 0.22s ease; cursor: pointer;
  }
  .hc-btn-coral:hover { background: #c35038; border-color: #c35038; }
  .hc-btn-outline {
    display: inline-block; font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none; padding: 1rem 2.25rem;
    background: transparent; color: var(--hc-charcoal);
    border: 1.5px solid rgba(43,43,43,0.25); transition: border-color 0.22s ease;
  }
  .hc-btn-outline:hover { border-color: var(--hc-charcoal); }
  .hc-btn-outline-light {
    display: inline-block; font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none; padding: 1rem 2.25rem;
    background: transparent; color: #FFFFFF; border: 1.5px solid rgba(255,255,255,0.4);
    transition: border-color 0.22s ease;
  }
  .hc-btn-outline-light:hover { border-color: #FFFFFF; }
  .hc-btn-ghost {
    display: inline-block; font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    text-decoration: none; padding: 0; background: none; border: none;
    color: var(--hc-mulberry); cursor: pointer;
    border-bottom: 1.5px solid var(--hc-mulberry); transition: opacity 0.2s ease;
  }
  .hc-btn-ghost:hover { opacity: 0.7; }
  .hc-link-arrow {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500;
    color: var(--hc-coral); text-decoration: none;
    letter-spacing: 0.08em; text-transform: uppercase; display: inline-block;
  }
  .hc-link-arrow-dark {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500;
    color: var(--hc-mulberry); text-decoration: none;
    letter-spacing: 0.08em; text-transform: uppercase; display: inline-block;
  }

  /* ── Image Placeholder ── */
  .hc-img-placeholder {
    width: 100%; background: var(--hc-ivory-deep);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .hc-img-label {
    font-family: 'Inter', system-ui, sans-serif; font-size: 0.72rem;
    color: rgba(43,43,43,0.3); letter-spacing: 0.08em; text-transform: uppercase;
    text-align: center; padding: 1rem; position: relative; z-index: 1;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hc-section { padding: 4rem 1.25rem; }
    .hc-section-sm { padding: 2.5rem 1.25rem; }
    .hc-container { padding: 0 1.25rem; }
  }
`;
