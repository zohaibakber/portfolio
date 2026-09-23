"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { opticalMargin } from "@/lib/optical";

function Word({
  word,
  range,
  progress,
  still,
  first,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  still: boolean;
  first: boolean;
}) {
  const opacity = useTransform(progress, range, [still ? 1 : 0.14, 1]);
  return (
    <motion.span
      className="inline-block"
      style={{ opacity, ...(first ? opticalMargin(word.charAt(0), "statement") : {}) }}
    >
      {word}
      {" "}
    </motion.span>
  );
}

export function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      data-spec="Statement"
      className="max-w-[22ch] text-[clamp(2rem,5.2vw,5.5rem)] leading-[1.02] tracking-[-0.025em] [font-variation-settings:'wght'_380,'wdth'_92] md:max-w-none"
    >
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          range={[i / words.length, (i + 1) / words.length]}
          progress={scrollYProgress}
          still={Boolean(reduce)}
          first={i === 0}
        />
      ))}
    </p>
  );
}
