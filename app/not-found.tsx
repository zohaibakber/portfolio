import type { Metadata } from "next";
import Link from "next/link";
import { RollText } from "@/components/roll-text";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-end px-5 pb-6 md:px-8 md:pb-8">
      <h1 className="display text-[clamp(8rem,40vw,36rem)]">404</h1>
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
        <p className="text-muted">This page does not exist or has moved.</p>
        <Link href="/" className="group w-fit">
          <RollText text="Back to the homepage" />
        </Link>
      </div>
    </main>
  );
}
