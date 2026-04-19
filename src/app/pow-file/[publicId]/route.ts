import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { getPublishedPowIssueByPublicId } from "@/lib/queries/pow";

interface PdfRouteProps {
  params: Promise<{ publicId: string }>;
}

export async function GET(request: NextRequest, { params }: PdfRouteProps) {
  const { publicId } = await params;
  const issue = await getPublishedPowIssueByPublicId(publicId);

  if (!issue) {
    notFound();
  }

  const sourceResponse = await fetch(issue.pdfUrl, { cache: "no-store" });
  if (!sourceResponse.ok || !sourceResponse.body) {
    return new Response("PDF unavailable", { status: 502 });
  }

  const download = request.nextUrl.searchParams.get("download") === "1";
  const fileName = `${publicId}.pdf`;
  const headers = new Headers({
    "Content-Type": sourceResponse.headers.get("content-type") ?? "application/pdf",
    "Accept-Ranges": sourceResponse.headers.get("accept-ranges") ?? "bytes",
    "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
  });

  const contentLength = sourceResponse.headers.get("content-length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(sourceResponse.body, {
    status: 200,
    headers,
  });
}
