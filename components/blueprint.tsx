"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { isReservedKeypress } from "@/lib/keys";

const COLUMNS = 12;
export const BLUEPRINT_TOGGLE = "za:blueprint-toggle";

function describe(el: HTMLElement) {
  const style = getComputedStyle(el);
  const size = Math.round(parseFloat(style.fontSize));
  const leading = (parseFloat(style.lineHeight) / parseFloat(style.fontSize)).toFixed(2);
  const axes = style.fontVariationSettings.replace(/"/g, "").replace(/(\d+\.\d)\d+/g, "$1");
  return `${size}px / ${Number.isNaN(Number(leading)) ? "normal" : leading}${axes !== "normal" ? `, ${axes}` : ""}`;
}

export function Blueprint() {
  const [open, setOpen] = useState(false);
  const [viewport, setViewport] = useState("");

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
    if (!open) return;
    root.dataset.blueprint = "";

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-spec]"));
    const madeRelative = targets.filter((el) => getComputedStyle(el).position === "static");
    madeRelative.forEach((el) => (el.style.position = "relative"));
    targets.forEach(
      (el) => (el.dataset.specFont = `${el.dataset.spec}: Mona Sans ${describe(el)}`),
    );

    const measure = () => {
      targets.forEach((el) => {
        el.dataset.specSize = `${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}`;
      });
      setViewport(`${window.innerWidth} × ${window.innerHeight}`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    targets.forEach((el) => observer.observe(el));
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      madeRelative.forEach((el) => (el.style.position = ""));
      targets.forEach((el) => {
        delete el.dataset.specFont;
        delete el.dataset.specSize;
      });
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
