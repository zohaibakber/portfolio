import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[42rem] flex-col justify-center px-6 py-16 sm:px-8">
      <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted">
        404
      </p>
      <h1 className="mt-4 text-[1.125rem] font-normal tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 max-w-prose text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 w-fit font-mono text-[0.625rem] uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
      >
        Back home
      </Link>
    </div>
  );
}
