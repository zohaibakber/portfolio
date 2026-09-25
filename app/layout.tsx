import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ScrollThumb } from "@/components/scroll-thumb";
import { SmoothScroll } from "@/components/smooth-scroll";
import { portfolio } from "@/lib/portfolio";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
});

const themeScript = `(function(){var d=document.documentElement,q=matchMedia("(prefers-color-scheme: light)"),s=function(){try{return localStorage.getItem("za-theme")}catch(e){}},a=function(){var t=s();d.dataset.theme=t==="light"||t==="dark"?t:q.matches?"light":"dark"};a();q.addEventListener("change",a)})()`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070605" },
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
  ],
};

const title = `${portfolio.name}, ${portfolio.title}`;
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
    <html lang="en" className={`${monaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <SmoothScroll />
        <ScrollThumb />
        {children}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60]" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
