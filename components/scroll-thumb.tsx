"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const MIN_THUMB = 48;

/**
 * A slim scroll thumb that floats over the content. The native scrollbar reserves its own gutter,
 * so its "transparent" track still shows a strip of page colour beside the orange footer; this one
 * has no track at all. Only for fine pointers: phones keep their native overlay scrollbar.
 * Wheel, keyboard and trackpad scrolling are untouched; the thumb can also be dragged.
 */
export function ScrollThumb() {
  const { scrollYProgress } = useScroll();
  const [overFooter, setOverFooter] = useState(false);
  // Hidden until the first measurement, so it never shows a placeholder size growing into the real one.
  const [measured, setMeasured] = useState(false);
  const view = useMotionValue(0);
  const thumbHeight = useMotionValue(0);
  const track = useTransform(() => view.get() - thumbHeight.get());
  const y = useTransform(() => scrollYProgress.get() * track.get());
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);

  useEffect(() => {
    let first = true;
    const size = () => {
      const viewport = window.innerHeight;
      const page = document.documentElement.scrollHeight;
      const height = Math.max(MIN_THUMB, (viewport / page) * viewport);
      view.set(viewport);
      if (first) {
        // First measurement lands instantly (while still invisible); later page-height changes ease.
        thumbHeight.jump(height);
        first = false;
        setMeasured(true);
      } else {
        animate(thumbHeight, height, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
      }
    };
    size();
    const observer = new ResizeObserver(size);
    observer.observe(document.body);
    window.addEventListener("resize", size);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", size);
    };
  }, [thumbHeight, view]);

  // Over the orange footer the ink colour would vanish, so the thumb switches to the footer's text colour.
  useMotionValueEvent(y, "change", (offset) => {
    const footerTop = document.getElementById("main-end")?.getBoundingClientRect().top ?? Infinity;
    setOverFooter(offset + thumbHeight.get() / 2 > footerTop);
  });

  return (
    <motion.div
      aria-hidden
      className={`group fixed top-0 right-0 z-40 hidden w-3 cursor-grab touch-none transition-opacity duration-500 active:cursor-grabbing pointer-fine:block ${
        measured ? "opacity-100" : "opacity-0"
      }`}
      style={{ y, height: thumbHeight }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { startY: event.clientY, startScroll: window.scrollY };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable / Math.max(1, track.get());
        window.scrollTo(
          0,
          drag.current.startScroll + (event.clientY - drag.current.startY) * ratio,
        );
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <span
        className={`absolute inset-y-1 right-[3px] w-1 transition-[width,background-color] duration-300 group-hover:w-1.5 ${
          overFooter ? "bg-on-accent/70" : "bg-ink/70"
        }`}
      />
    </motion.div>
  );
}
