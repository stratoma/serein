import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface FragranceCard {
  src: string;
  alt: string;
  label: string;
}

interface FragranceCarouselProps {
  cards: FragranceCard[];
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const CircleButton = forwardRef<
  HTMLButtonElement,
  {
    onClick: () => void;
    ariaLabel: string;
    children: React.ReactNode;
    className?: string;
  }
>(function CircleButton({ onClick, ariaLabel, children, className = "" }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-foreground/60 focus:ring-offset-2 focus:ring-offset-transparent ${className}`}
    >
      {children}
    </button>
  );
});

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function FragranceCarousel({ cards }: FragranceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const carouselRegionRef = useRef<HTMLDivElement | null>(null);

  const count = cards.length;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  const openLightbox = (index: number, el: HTMLButtonElement | null) => {
    setActiveIndex(index);
    setZoom(1);
    triggerRef.current = el;
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    // The trigger button that originally opened the lightbox may have been
    // unmounted/remounted since (e.g. arrow-key navigation swaps the active
    // card, which remounts the featured-card button with a new key). Falling
    // back to the stable carousel region keeps focus from being lost to body.
    if (triggerRef.current && document.contains(triggerRef.current)) {
      triggerRef.current.focus();
    } else {
      carouselRegionRef.current?.focus();
    }
  }, []);

  // Carousel-level arrow key navigation (works when the carousel region has focus,
  // independent of whether the lightbox is open).
  const handleCarouselKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (lightboxOpen) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  // Lightbox: keyboard nav (arrows/escape), focus trap, and scroll lock.
  useEffect(() => {
    if (!lightboxOpen) return;
    closeButtonRef.current?.focus();

    function getFocusable(): HTMLElement[] {
      if (!modalRef.current) return [];
      return Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        setZoom(1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        setZoom(1);
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement;

        if (e.shiftKey) {
          if (activeEl === first || !modalRef.current?.contains(activeEl)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (activeEl === last || !modalRef.current?.contains(activeEl)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  const active = cards[activeIndex];

  return (
    <div
      className="w-full focus:outline-none"
      ref={carouselRegionRef}
      role="region"
      aria-label="Fragrance scent card carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleCarouselKeyDown}
    >
      {/* FEATURED CARD */}
      <div className="relative w-full">
        <div className="relative overflow-hidden bg-[#F3EBDD] w-full">
          <AnimatePresence mode="wait">
            <motion.button
              key={active.label}
              type="button"
              onClick={(e) => openLightbox(activeIndex, e.currentTarget)}
              aria-label={`Open ${active.label} scent card`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full block focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
            >
              <img
                src={active.src}
                alt={active.alt}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
              />
            </motion.button>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <>
            <div className="absolute inset-y-0 left-3 md:left-5 flex items-center">
              <CircleButton onClick={goPrev} ariaLabel="Previous fragrance card">
                <ChevronLeft />
              </CircleButton>
            </div>
            <div className="absolute inset-y-0 right-3 md:right-5 flex items-center">
              <CircleButton onClick={goNext} ariaLabel="Next fragrance card">
                <ChevronRight />
              </CircleButton>
            </div>
          </>
        )}
      </div>

      {/* THUMBNAILS — clicking a thumbnail both selects it as the featured
          card and opens the lightbox for a closer look. */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {cards.map((card, i) => (
            <button
              key={card.label}
              type="button"
              onClick={(e) => openLightbox(i, e.currentTarget)}
              aria-label={`Open ${card.label} scent card`}
              aria-current={i === activeIndex}
              className={`relative overflow-hidden bg-[#F3EBDD] w-16 h-16 md:w-20 md:h-20 shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ${
                i === activeIndex ? "ring-2 ring-primary opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              <img src={card.src} alt="" aria-hidden="true" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.label} scent card, enlarged view`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#19140f]/95 flex flex-col items-center justify-center px-4 py-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
              <CircleButton ref={closeButtonRef} onClick={closeLightbox} ariaLabel="Close scent card viewer">
                <CloseIcon />
              </CircleButton>
            </div>

            <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center overflow-hidden">
              <motion.img
                key={active.label}
                src={active.src}
                alt={active.alt}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: zoom }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="max-h-[75vh] max-w-full object-contain select-none"
                draggable={false}
              />

              {count > 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <CircleButton
                      onClick={() => {
                        goPrev();
                        setZoom(1);
                      }}
                      ariaLabel="Previous fragrance card"
                    >
                      <ChevronLeft />
                    </CircleButton>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <CircleButton
                      onClick={() => {
                        goNext();
                        setZoom(1);
                      }}
                      ariaLabel="Next fragrance card"
                    >
                      <ChevronRight />
                    </CircleButton>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <CircleButton
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(2)))}
                ariaLabel="Zoom out"
              >
                <ZoomOutIcon />
              </CircleButton>
              <span className="text-primary-foreground/60 text-xs uppercase tracking-[0.2em] font-sans min-w-[3ch] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <CircleButton
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(2)))}
                ariaLabel="Zoom in"
              >
                <ZoomInIcon />
              </CircleButton>
            </div>

            <p className="mt-4 text-primary-foreground/50 text-[10px] uppercase tracking-[0.25em] font-sans text-center">
              {active.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
