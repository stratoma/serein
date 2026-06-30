import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ProductCarouselProps {
  images: CarouselImage[];
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

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

  const prev = useCallback(() => go((current - 1 + images.length) % images.length), [current, go, images.length]);
  const next = useCallback(() => go((current + 1) % images.length), [current, go, images.length]);

  if (!images.length) return null;

  return (
    <section className="w-full bg-[#160f0a]">
      <div className="relative overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={current}
              src={images[current].src}
              alt={images[current].alt}
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
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-300 font-sans text-lg select-none"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-300 font-sans text-lg select-none"
            >
              →
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`View image ${i + 1}`}
              className={`w-1 h-1 rounded-full transition-all duration-400 ${
                i === current ? "bg-white/70 w-4" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
