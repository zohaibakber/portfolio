"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { isReservedKeypress } from "@/lib/keys";

type Spec = {
  id: number;
  label: string;
  font: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const COLUMNS = 12;
/** Window event that toggles blueprint mode, fired by the header button. */
export const BLUEPRINT_TOGGLE = "za:blueprint-toggle";

function describe(el: HTMLElement) {
  const style = getComputedStyle(el);
  const size = Math.round(parseFloat(style.fontSize));
  const leading = (parseFloat(style.lineHeight) / parseFloat(style.fontSize)).toFixed(2);
  const axes = style.fontVariationSettings.replace(/"/g, "").replace(/(\d+\.\d)\d+/g, "$1");
  return `${size}px / ${Number.isNaN(Number(leading)) ? "normal" : leading}${axes !== "normal" ? `, ${axes}` : ""}`;
}

/**
 * Press G: the page shows its working. Column grid, baseline, and live type specs for every
 * element marked `data-spec`, the way a designer hands it over and a developer builds it.
 */
export function Blueprint() {
  const [open, setOpen] = useState(false);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [viewport, setViewport] = useState("");
  const frame = useRef(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isReservedKeypress(event)) return;
      if (event.key.toLowerCase() === "g") setOpen((value) => !value);
      if (event.key === "Escape") setOpen(false);
    };
    const onToggle = () => setOpen((value) => !value);
    window.addEventListener("keydown", onKey);
    window.addEventListener(BLUEPRINT_TOGGLE, onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(BLUEPRINT_TOGGLE, onToggle);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      delete root.dataset.blueprint;
      return;
    }
    root.dataset.blueprint = "";

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-spec]"));
    const fonts = targets.map(describe);
    let previous = "";

    // Specs follow their elements while the page scrolls; only re-render when something moved.
    const track = () => {
      const next: Spec[] = [];
      targets.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0) return;
        next.push({
          id,
          label: el.dataset.spec ?? "",
          font: fonts[id],
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      });
      const key = next
        .map((s) => `${s.id}:${Math.round(s.x)}:${Math.round(s.y)}:${Math.round(s.width)}`)
        .join("|");
      if (key !== previous) {
        previous = key;
        setSpecs(next);
        setViewport(`${window.innerWidth} × ${window.innerHeight}`);
      }
      frame.current = requestAnimationFrame(track);
    };
    frame.current = requestAnimationFrame(track);

    return () => {
      cancelAnimationFrame(frame.current);
      delete root.dataset.blueprint;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[45] text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 8px baseline grid */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_7px,color-mix(in_srgb,var(--ink)_9%,transparent)_7px_8px)]"
          />

          {/* Column grid, dropping in one column at a time */}
          <div
            aria-hidden
            className="absolute inset-0 grid grid-cols-4 gap-4 px-5 md:grid-cols-12 md:gap-6 md:px-8"
          >
            {Array.from({ length: COLUMNS }, (_, i) => (
              <motion.div
                key={i}
                className={`origin-top border-x border-ink/25 bg-ink/[0.07] ${i >= 4 ? "hidden md:block" : ""}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          {/* Live type specs */}
          {specs.map((spec) => (
            <div
              aria-hidden
              key={spec.id}
              className="absolute border border-dashed border-ink"
              style={{ left: spec.x, top: spec.y, width: spec.width, height: spec.height }}
            >
              <span className="absolute -top-px left-0 -translate-y-full bg-ink px-2 py-1 text-[11px] leading-none whitespace-nowrap text-paper">
                {spec.label}: Mona Sans {spec.font}
              </span>
              <span className="absolute right-0 -bottom-px translate-y-full bg-ink px-2 py-1 text-[11px] leading-none whitespace-nowrap text-paper">
                {Math.round(spec.width)} × {Math.round(spec.height)}
              </span>
            </div>
          ))}

          {/* Top centre: the one strip of the viewport no spec label ever lands on. */}
          {/* The overlay ignores the pointer so the page stays usable; only this panel takes clicks. */}
          <div className="pointer-events-auto absolute top-3 left-1/2 flex -translate-x-1/2 items-center gap-4 bg-ink py-2 pr-2 pl-3 text-xs leading-relaxed whitespace-nowrap text-paper">
            <div>
              <p>Blueprint mode</p>
              <p className="opacity-70">{viewport}, 12 columns, 8px baseline</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer border border-current px-3 py-1.5 transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              Turn off grid <kbd className="ml-1">G</kbd>
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
