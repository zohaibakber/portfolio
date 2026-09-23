"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { opticalOffset } from "@/lib/optical";
import type { Project } from "@/lib/portfolio";

const ease = [0.16, 1, 0.3, 1] as const;

export function WorkList({ projects }: { projects: readonly Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 170, damping: 22, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  // The preview leans into the direction it is dragged, like paper on a string.
  const velocity = useVelocity(sx);
  const rotate = useTransform(velocity, [-2400, 2400], reduce ? [0, 0] : [-9, 9], {
    clamp: true,
  });

  const visible = active !== null;

  // Pointing at the work flips the page to the opposite theme, as if the lights were switched.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.invert = "";
    else delete root.dataset.invert;
  }, [visible]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.invert;
    },
    [],
  );

  return (
    <div
      onPointerMove={(event) => {
        x.set(event.clientX);
        y.set(event.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="group/list">
        {projects.map((project, i) => (
          <motion.li
            key={project.name}
            className="relative"
            initial={reduce ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08 }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left bg-line"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
              transition={{ duration: 1.4, ease, delay: i * 0.08 }}
            />
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={(event) => {
                // Start from the cursor rather than flying in from wherever it last was.
                if (!visible) {
                  x.jump(event.clientX);
                  y.jump(event.clientY);
                  sx.jump(event.clientX);
                  sy.jump(event.clientY);
                }
                setActive(i);
              }}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid gap-4 py-6 transition-opacity duration-500 group-hover/list:opacity-35 hover:opacity-100! md:grid-cols-12 md:items-end md:gap-x-6 md:py-9"
            >
              <span className="relative aspect-[16/10] overflow-hidden md:hidden">
                <Image src={project.image} alt="" fill sizes="100vw" className="object-cover" />
              </span>
              <span className="block overflow-y-clip md:col-span-9">
                <motion.span
                  data-spec="Project"
                  // Plain text inside, so text-indent is safe here: ink of the first letter on the grid line.
                  style={{ textIndent: opticalOffset(project.name.charAt(0)) }}
                  className="swell display block pt-[0.08em] text-[clamp(2.75rem,8.5vw,9rem)] whitespace-nowrap"
                  variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
                  transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.08 }}
                >
                  {project.name}
                </motion.span>
              </span>
              <span className="flex justify-between text-sm text-muted md:col-span-3 md:block md:pb-[0.9em] md:text-right md:text-base">
                {project.note}
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block"
        style={{ x: sx, y: sy, rotate }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={{ width: "min(32vw, 30rem)", aspectRatio: "16 / 10" }}
          initial={false}
          animate={{
            scale: visible ? 1 : 0.4,
            opacity: visible ? 1 : 0,
            clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(50% 50% 50% 50%)",
          }}
          transition={{ duration: 0.7, ease }}
        >
          {projects.map((project, i) => {
            const offset = active === null ? 1 : i - active;
            return (
              <motion.div
                key={project.name}
                className="absolute inset-0 overflow-hidden"
                initial={false}
                animate={{ y: `${Math.sign(offset) * 100}%` }}
                transition={{ duration: 0.8, ease }}
              >
                <motion.div
                  className="relative h-full w-full"
                  initial={false}
                  animate={{ scale: offset === 0 ? 1 : 1.25 }}
                  transition={{ duration: 1.1, ease }}
                >
                  <Image src={project.image} alt="" fill sizes="32vw" className="object-cover" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
