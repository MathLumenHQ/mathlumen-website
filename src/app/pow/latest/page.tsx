import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/metadata";
import { getLatestPublishedIssue, getPowIssueHref } from "@/lib/queries/pow";

export const metadata = createMetadata({
  title: "Latest Problem of the Week Solution",
  description:
    "Read the latest published MathLumen Problem of the Week solution and access its final PDF.",
  path: "/pow/latest",
});

export default async function PowLatestPage() {
  const latestIssue = await getLatestPublishedIssue();

  if (latestIssue) {
    redirect(getPowIssueHref(latestIssue.publicId));
  }

  redirect("/pow/archive");
}
