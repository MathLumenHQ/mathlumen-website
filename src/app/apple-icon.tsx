import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #06080f 0%, #0d1018 100%)",
          borderRadius: 36,
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: "#c9a84c",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          M
        </span>
        <div
          style={{
            width: 80,
            height: 3,
            background: "#c9a84c",
            borderRadius: 2,
            marginTop: 4,
            opacity: 0.6,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
