import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
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

const bootScript = `try{var d=document.documentElement,s=sessionStorage,t=localStorage.getItem("za-theme")||"dark";d.dataset.theme=t;if(t==="light"){var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#f4efe6")}if(s.getItem("za-splash")){d.dataset.splash="seen"}else{s.setItem("za-splash","1")}}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#070605",
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
        {/* Runs before first paint: restores the chosen theme, and only the first visit in a session sees the splash. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full">
        <SmoothScroll />
        <ScrollThumb />
        {children}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[60]" />
      </body>
    </html>
  );
}
