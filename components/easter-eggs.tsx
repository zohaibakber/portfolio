"use client";

import { useEffect } from "react";
import { Blueprint } from "@/components/blueprint";

declare global {
  interface Window {
    zaConsoleNoteShown?: boolean;
  }
}

function consoleNote(email: string) {
  if (window.zaConsoleNoteShown) return;
  window.zaConsoleNoteShown = true;

  const family = getComputedStyle(document.body).fontFamily;
  const paper = "#f26a1b";
  const ink = "#120d0a";
  console.log(
    "%cZohaib Akber",
    `font: 250 56px/1 ${family}; font-stretch: 78%; letter-spacing: -0.02em; color: ${ink}; background: ${paper}; padding: 18px 28px 14px;`,
  );
  console.log(
    `%cHi there. Try pressing G, or say hello at ${email}`,
    `font: 400 13px/1.6 ${family}; color: ${paper}; background: ${ink}; padding: 10px 28px;`,
  );
}

/** Hidden extras. Nothing here is announced on the page. */
export function EasterEggs({ email }: { email: string }) {
  useEffect(() => consoleNote(email), [email]);

  // Switch tabs and the page asks you back; return and it says hello.
  useEffect(() => {
    const original = document.title;
    let timer: ReturnType<typeof setTimeout>;
    const onVisibility = () => {
      clearTimeout(timer);
      if (document.hidden) {
        document.title = "Come back soon";
      } else {
        document.title = "Welcome back";
        timer = setTimeout(() => (document.title = original), 1600);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, []);

  return (
    <>
      <Blueprint />
    </>
  );
}
