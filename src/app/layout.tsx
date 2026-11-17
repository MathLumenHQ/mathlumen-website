import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SearchDialog } from "@/components/forms/SearchDialog";
import { CookieConsentProvider } from "@/components/cookie/CookieConsentProvider";
import { CookieConsentBanner } from "@/components/cookie/CookieConsentBanner";
import { CookiePreferencesModal } from "@/components/cookie/CookiePreferencesModal";
import { ProductionTelemetry } from "@/components/analytics/ProductionTelemetry";
//import { createMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, TWITTER_HANDLE } from "@/lib/constants";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";


const playfair = localFont({
  src: "./fonts/PlayfairDisplay-Variable.ttf",
  weight: "400 900",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const crimson = localFont({
  src: "./fonts/CrimsonPro-Variable.ttf",
  weight: "200 900",
  style: "normal",
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const dmMono = localFont({
  src: [
    {
      path: "./fonts/DMMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/DMMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DMMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", creator: TWITTER_HANDLE },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldRenderTelemetry = process.env.NODE_ENV === "production";

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${crimson.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('mathlumen-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ink text-paper font-body antialiased">
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

        {shouldRenderTelemetry && <ProductionTelemetry />}
      </body>
    </html>
  );
}
