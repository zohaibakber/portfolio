import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { portfolio } from "@/lib/portfolio";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${portfolio.name} — ${portfolio.title}`;
const description =
  "Full-stack web developer based in Lahore, Pakistan. Building responsive, production-ready web projects with Next.js, React, and modern tooling.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: portfolio.name,
    title,
    description:
      "Full-stack web developer specializing in e-commerce, CMS-driven sites, and clean front-end implementation.",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Full-stack web developer specializing in e-commerce, CMS-driven sites, and clean front-end implementation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
