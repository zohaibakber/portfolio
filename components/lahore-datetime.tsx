"use client";

import { useEffect, useState } from "react";

const timeZone = "Asia/Karachi";

type LahoreTimeParts = {
  datePart: string;
  timePart: string;
};

function getLahoreTimeParts(date: Date): LahoreTimeParts {
  const datePart = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return { datePart, timePart };
}

function PulsingDot() {
  return (
    <span
      className="relative mx-1 inline-flex h-1 w-1 shrink-0 align-middle"
      aria-hidden
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
      <span className="relative inline-flex h-1 w-1 rounded-full bg-foreground" />
    </span>
  );
}

export function LahoreDateTime() {
  const [parts, setParts] = useState<LahoreTimeParts | null>(null);

  useEffect(() => {
    const update = () => setParts(getLahoreTimeParts(new Date()));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  const ariaLabel = parts
    ? `Local time in Lahore: ${parts.datePart}, ${parts.timePart} PKT`
    : "Local time in Lahore";

  return (
    <p
      className="mt-12 flex flex-wrap items-center text-[0.625rem] text-muted"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      {parts ? (
        <>
          <PulsingDot />
          Lahore · {parts.datePart} · {parts.timePart} PKT
        </>
      ) : (
        "—"
      )}
    </p>
  );
}
