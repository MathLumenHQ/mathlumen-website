import type { Metadata } from "next";
import { Playfair_Display, Crimson_Pro, DM_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SearchDialog } from "@/components/forms/SearchDialog";
import { CookieConsentProvider } from "@/components/cookie/CookieConsentProvider";
import { CookieConsentBanner } from "@/components/cookie/CookieConsentBanner";
import { CookiePreferencesModal } from "@/components/cookie/CookiePreferencesModal";
import { createMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  ...createMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  metadataBase: new URL("https://mathlumen.com"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
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
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Preconnect to CDN origins to reduce connection latency */}
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {/* Prevent flash of wrong theme — runs synchronously before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mathlumen-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ink text-paper font-body antialiased">
        {/* Skip to main content — sr-only, visible on focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-gold focus:text-ink focus:font-semibold focus:rounded-none focus:outline-none"
        >
          Skip to main content
        </a>

        <CookieConsentProvider>
          <Navigation />
          <SearchDialog />

          <main id="main-content" className="flex-1 pt-16">
            {children}
          </main>

          <Footer />
          <CookieConsentBanner />
          <CookiePreferencesModal />
        </CookieConsentProvider>

        {/* Vercel Analytics — cookieless baseline, no consent required */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
