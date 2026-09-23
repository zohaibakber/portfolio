"use client";

import type { MouseEvent } from "react";
import { RollText } from "@/components/roll-text";

const THEME_COLORS = { dark: "#070605", light: "#f4efe6" } as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", THEME_COLORS[next]);
      try {
        localStorage.setItem("za-theme", next);
      } catch {}
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 1000,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      // A skipped transition rejects `ready`; the theme is still applied.
      .catch(() => {});
    void transition.finished.finally(() => delete root.dataset.themeSwitching);
  };

  return (
    <button type="button" onClick={toggle} className={`group cursor-pointer ${className}`}>
      <span className="theme-label-dark">
        <RollText text="Lights on" />
      </span>
      <span className="theme-label-light">
        <RollText text="Lights off" />
      </span>
    </button>
  );
}
