import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06080f",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#c9a84c",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
          }}
        >
          M
        </span>
      </div>
    ),
    { ...size },
  );
}
