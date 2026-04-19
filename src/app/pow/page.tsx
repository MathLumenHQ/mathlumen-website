import { createMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = createMetadata({
  title: "Problem of the Week",
  description:
    "Access the latest MathLumen Problem of the Week publication and the full published archive.",
  path: "/pow",
});

export default async function PowLandingPage() {
  redirect("/pow/latest");
}
