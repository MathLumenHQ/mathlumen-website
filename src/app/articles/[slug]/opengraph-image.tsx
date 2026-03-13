import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/queries/articles";
import { formatDate } from "@/lib/utils";

export const runtime = "edge";
export const alt = "Article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: OGImageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const title = article?.title ?? "Article";
  const category = article?.category ?? "";
  const authorName = article?.author?.name ?? "MathLumen";
  const date = article?.publishedAt ? formatDate(article.publishedAt) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#06080f",
          padding: "60px",
          fontFamily: "serif",
        }}
      >
        {/* Top — logo + category */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Gold circle logo placeholder */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e8d08a, #c9a84c, #8a6820)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06080f",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            L
          </div>
          <span style={{ color: "#f5f0e8", fontSize: "20px", fontWeight: 700 }}>
            Math<span style={{ color: "#c9a84c" }}>Lumen</span>
          </span>
          {category && (
            <div
              style={{
                marginLeft: "auto",
                padding: "6px 16px",
                border: "1px solid rgba(201, 168, 76, 0.3)",
                color: "#c9a84c",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {category}
            </div>
          )}
        </div>

        {/* Center — title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? "40px" : "52px",
              fontWeight: 900,
              color: "#f5f0e8",
              lineHeight: 1.15,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom — author + date + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(201, 168, 76, 0.18)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#f5f0e8", fontSize: "16px" }}>{authorName}</span>
            {date && (
              <>
                <span style={{ color: "#6b6560" }}>&middot;</span>
                <span style={{ color: "#6b6560", fontSize: "16px" }}>{date}</span>
              </>
            )}
          </div>
          <span style={{ color: "#6b6560", fontSize: "14px", letterSpacing: "0.05em" }}>
            mathlumen.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
