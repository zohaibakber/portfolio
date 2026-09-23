"use client";

import { BLUEPRINT_TOGGLE } from "@/components/blueprint";

/** Clickable twin of the G shortcut, so blueprint mode also works by mouse and touch. */
export function BlueprintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(BLUEPRINT_TOGGLE))}
      className="group inline-flex cursor-pointer items-baseline gap-2"
    >
      <kbd className="transition-colors duration-300 group-hover:bg-current">
        <span className="group-hover:text-paper">G</span>
      </kbd>
      <span className="underline decoration-current/30 underline-offset-4 transition-[text-decoration-color] duration-300 group-hover:decoration-current">
        {label}
      </span>
    </button>
  );
}
