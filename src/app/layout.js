import "./globals.css";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import PathnamePreloader from "@/components/PathnamePreloader";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { jsonLdHtml } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "Samsara Group – Cultural Institution & Lifestyle House",
  description:
    "A cultural sanctuary and lifestyle institute preserving Indonesian architectural heritage, artisanal tactility, and contemporary hospitality.",
  openGraph: {
    title: "Samsara Group – Cultural Institution & Lifestyle House",
    description:
      "A cultural sanctuary and lifestyle institute preserving Indonesian architectural heritage, artisanal tactility, and contemporary hospitality.",
    url: "https://samsaragroup.co.id",
    siteName: "Samsara Group",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samsara Group – Cultural Institution & Lifestyle House",
    description:
      "A cultural sanctuary and lifestyle institute preserving Indonesian architectural heritage, artisanal tactility, and contemporary hospitality.",
  },
  metadataBase: new URL("https://samsaragroup.co.id"),
};

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Condensed:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: jsonLdHtml({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Samsara Group",
              url: "https://samsaragroup.co.id",
              description:
                "A cultural sanctuary and lifestyle institute preserving Indonesian architectural heritage, artisanal tactility, and contemporary hospitality.",
              sameAs: [
                "https://www.instagram.com/samsara.bogor",
                "https://www.instagram.com/svarga.samsara",
                "https://www.instagram.com/acasa.samsara",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased overflow-x-hidden">
        <PathnamePreloader />
        <CustomCursor />
        <ScrollProgressBar />
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:text-sm"
          >
            Skip to content
          </a>
          <PageTransition>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </PageTransition>
        </ThemeProvider>
        <BackToTop />
      </body>
    </html>
  );
}
