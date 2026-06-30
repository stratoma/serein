import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CarouselImage {
  src: string;
  alt: string;
  variant?: "product" | "card";
}

interface ProductCarouselProps {
  images: CarouselImage[];
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const arrowBase =
  "absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3EBDD]/50";

const arrowStyle =
  "w-11 h-11 md:w-11 md:h-11 bg-[rgba(43,30,24,0.72)] hover:bg-[rgba(43,30,24,0.92)] border border-[rgba(243,235,221,0.45)] text-[#F3EBDD] backdrop-blur-sm";

export function ProductCarousel({ images }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current]
  );

  const prev = useCallback(
    () => go((current - 1 + images.length) % images.length),
    [current, go, images.length]
  );
  const next = useCallback(
    () => go((current + 1) % images.length),
    [current, go, images.length]
  );

  if (!images.length) return null;

  const img = images[current];
  const isCard = img.variant === "card";
  const bg = isCard ? "bg-[#F3EBDD]" : "bg-[#160f0a]";

  return (
    <section className={`w-full ${bg} transition-colors duration-500`}>
      <div className="relative overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              className={`absolute inset-0 ${bg} transition-colors duration-300`}
            >
              <motion.img
                src={img.src}
                alt={img.alt}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className={`${arrowBase} ${arrowStyle} left-4 md:left-5`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className={`${arrowBase} ${arrowStyle} right-4 md:right-5`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={`flex justify-center gap-2 py-4 ${bg}`}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? isCard
                    ? "bg-[#2B1E18]/50 w-4"
                    : "bg-white/70 w-4"
                  : isCard
                  ? "bg-[#2B1E18]/20 w-1"
                  : "bg-white/20 w-1"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
