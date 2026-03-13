import type { Metadata } from "next";
import { Playfair_Display, Crimson_Pro, DM_Mono } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "@/styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      "application/rss+xml": "/api/rss",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@TheMathLumen",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${crimson.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-ink text-paper font-body antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
