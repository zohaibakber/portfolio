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
      className="mx-1 inline-block h-1 w-1 shrink-0 animate-pulse rounded-full bg-foreground align-middle"
      aria-hidden
    />
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
