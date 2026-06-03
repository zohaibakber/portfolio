import { ImageResponse } from "next/og";
import { portfolio } from "@/lib/portfolio";

export const ogImageAlt = `${portfolio.name} — ${portfolio.title}`;
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export default function generateOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fafaf9",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#1c1c1c",
            marginBottom: 56,
          }}
        />
        <div
          style={{
            fontSize: 52,
            fontWeight: 400,
            color: "#1c1c1c",
            letterSpacing: "-0.02em",
          }}
        >
          {portfolio.name}
        </div>
        <div style={{ fontSize: 28, color: "#737373", marginTop: 12 }}>
          {portfolio.title}
        </div>
        <div style={{ fontSize: 22, color: "#a3a3a3", marginTop: 8 }}>
          {portfolio.location}
        </div>
      </div>
    ),
    { ...ogImageSize },
  );
}
