"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef } from "react";
import { BlueprintButton } from "@/components/blueprint-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { opticalMargin } from "@/lib/optical";

const REST = { wght: 250, wdth: 78 };
const PEAK = { wght: 900, wdth: 125 };
const FAR = -1e5;
// Seconds the splash holds the stage; matches --intro-delay in globals.css.
const splashDelay = () => (document.documentElement.dataset.splash === "seen" ? 0 : 1.9);

// After this long without input the name starts to breathe through its weights.
const IDLE_MS = 12_000;

type Pointer = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** 0 while the visitor is active, eases to 1 when idle. */
  idle: MotionValue<number>;
  /** Seconds of accumulated idle time, drives the breathing wave. */
  clock: MotionValue<number>;
};

function Letter({
  char,
  index,
  pointer,
  first = false,
}: {
  char: string;
  index: number;
  pointer: Pointer;
  /** First letter of a line: pulled left by its side bearing so the ink sits on the grid line. */
  first?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const center = useRef({ x: 0, y: 0, radius: 0 });
  const reduce = useReducedMotion();

  // Proximity to the cursor, eased with a smoothstep so letters swell gently.
  const near = useTransform(() => {
    const { x, y, radius } = center.current;
    const px = pointer.x.get();
    if (!radius || px === FAR) return 0;
    const distance = Math.hypot(px - x, (pointer.y.get() - y) * 1.5);
    const t = Math.min(1, Math.max(0, 1 - distance / radius));
    return t * t * (3 - 2 * t);
  });
  const hover = useSpring(near, { stiffness: 140, damping: 20, mass: 0.6 });
  const fontVariationSettings = useTransform(() => {
    const breath =
      pointer.idle.get() * 0.5 * (0.5 + 0.5 * Math.sin(pointer.clock.get() * 1.8 - index * 0.6));
    const t = Math.max(hover.get(), breath);
    return `"wght" ${REST.wght + (PEAK.wght - REST.wght) * t}, "wdth" ${REST.wdth + (PEAK.wdth - REST.wdth) * t}`;
  });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      center.current = {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
        radius: rect.height * 1.1,
      };
    };

    // Measure once the letters have finished rising into place.
    const timer = setTimeout(measure, reduce ? 0 : (splashDelay() + 1.8) * 1000);
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  return (
    <span
      className="inline-block overflow-hidden pt-[0.06em]"
      style={first ? opticalMargin(char) : undefined}
      aria-hidden
    >
      <motion.span
        ref={ref}
        className="letter-rise inline-block"
        style={{
          fontVariationSettings,
          animationDelay: `calc(var(--intro-delay) + ${0.35 + index * 0.06}s)`,
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

function Word({
  text,
  offset,
  pointer,
  align = "start",
}: {
  text: string;
  offset: number;
  pointer: Pointer;
  align?: "start" | "end";
}) {
  return (
    <span className={`block whitespace-nowrap ${align === "end" ? "md:text-right" : ""}`}>
      {Array.from(text).map((char, i) => (
        <Letter key={i} char={char} index={offset + i} pointer={pointer} first={i === 0} />
      ))}
    </span>
  );
}

export function Hero({ first, last, intro }: { first: string; last: string; intro: string }) {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const idle = useMotionValue(0);
  const clock = useMotionValue(0);
  const pointer: Pointer = {
    x: useMotionValue(FAR),
    y: useMotionValue(FAR),
    idle,
    clock,
  };

  // The breathing clock only ticks while the page is idle; no frame loop runs otherwise.
  useEffect(() => {
    let frame = 0;
    let previous = 0;
    const tick = (time: number) => {
      if (previous) clock.set(clock.get() + (time - previous) / 1000);
      previous = time;
      frame = idle.get() > 0 ? requestAnimationFrame(tick) : 0;
    };
    const unsubscribe = idle.on("change", (value) => {
      if (value > 0 && !frame) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, [idle, clock]);

  useEffect(() => {
    if (reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      if (idle.get() > 0) animate(idle, 0, { duration: 0.6 });
      clearTimeout(timer);
      timer = setTimeout(() => animate(idle, 1, { duration: 2.4, ease: "easeInOut" }), IDLE_MS);
    };
    const events = [
      "pointermove",
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ] as const;
    events.forEach((name) => window.addEventListener(name, wake, { passive: true }));
    wake();
    return () => {
      clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, wake));
    };
  }, [reduce, idle]);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      pointer.x.set(event.pageX);
      pointer.y.set(event.pageY);
    };
    const leave = () => {
      pointer.x.set(FAR);
      pointer.y.set(FAR);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduce, pointer.x, pointer.y]);

  // svh, not dvh: the small viewport height stays fixed while the mobile address bar slides
  // in and out, so the hero and the name's size don't jump as you scroll.
  return (
    <section
      ref={section}
      id="about"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-24 pb-6 md:px-8 md:pb-8"
    >
      <ThemeToggle className="intro-fade absolute top-6 left-5 text-sm md:top-8 md:left-8" />
      <p className="intro-fade absolute top-6 right-5 max-w-[15rem] text-right text-sm leading-relaxed md:top-8 md:right-8 md:max-w-none md:whitespace-nowrap">
        Open to new projects. <BlueprintButton label="See how it’s built" />
      </p>
      <motion.div style={{ y: drift, opacity: fade }} className="relative">
        <h1
          aria-label={`${first} ${last}`}
          data-spec="Display"
          className="display text-[min(34vw,calc((100svh-15rem)/1.95))] text-ink md:text-[min(27vw,30rem,calc((100svh-9rem)/1.95))]"
        >
          <Word text={first} offset={0} pointer={pointer} />
          <Word text={last} offset={first.length} pointer={pointer} align="end" />
        </h1>
        <p
          data-spec="Intro"
          className="intro-fade mt-8 max-w-[20ch] text-base leading-snug text-muted md:absolute md:bottom-[0.4em] md:left-0 md:mt-0 md:w-[calc(25%-1.125rem)] md:max-w-none md:text-lg"
        >
          {intro}
        </p>
      </motion.div>
    </section>
  );
}
