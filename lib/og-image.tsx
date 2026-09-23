import { ImageResponse } from "next/og";
import { portfolio } from "@/lib/portfolio";

export const ogImageAlt = `${portfolio.name}, ${portfolio.title}`;
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export default function generateOgImage() {
  const [first, last] = portfolio.name.split(" ");

  return new ImageResponse(
    <div
      style={{
        background: "#120d0a",
        color: "#f26a1b",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 28, opacity: 0.75 }}>{portfolio.intro}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 200,
          lineHeight: 0.86,
          letterSpacing: "-0.04em",
        }}
      >
        <span>{first}</span>
        <span style={{ alignSelf: "flex-end" }}>{last}</span>
      </div>
    </div>,
    { ...ogImageSize },
  );
}
