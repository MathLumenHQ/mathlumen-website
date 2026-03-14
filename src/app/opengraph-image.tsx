import { ImageResponse } from "next/og";

export const alt = "MathLumen — Illuminating Mathematics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #06080f 0%, #0d1018 50%, #06080f 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: 3,
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          }}
        />

        {/* Eyebrow */}
        <span
          style={{
            fontSize: 16,
            color: "#c9a84c",
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          A Mathematics Publication
        </span>

        {/* Logo text */}
        <span
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#f5f0e8",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          Math
          <span style={{ color: "#c9a84c" }}>Lumen</span>
        </span>

        {/* Formula */}
        <span
          style={{
            fontSize: 28,
            color: "#c9a84c",
            opacity: 0.7,
            marginTop: 16,
            fontStyle: "italic",
          }}
        >
          e^(i&pi;) + 1 = 0
        </span>

        {/* Tagline */}
        <span
          style={{
            fontSize: 22,
            color: "#6b6560",
            marginTop: 32,
          }}
        >
          Illuminating Mathematics
        </span>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: 3,
            background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
