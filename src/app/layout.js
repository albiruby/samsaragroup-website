import { SITE_URL, openGraphFor, ogImages } from "@/lib/site";
import "./globals.css";
import { headers } from "next/headers";
import { Instrument_Serif, Red_Hat_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrandsProvider } from "@/components/BrandsProvider.jsx";
import { getBrandNav } from "@/sanity/lib/brands";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import PathnamePreloader from "@/components/PathnamePreloader";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { jsonLdHtml } from "@/lib/jsonld";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Di-host sendiri saat build, jadi browser tidak lagi menunggu fonts.googleapis.com
// (yang tadinya memblokir render 390 ms) dan tidak ada permintaan ke pihak ketiga.
const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display-loaded",
});

const fontBody = Red_Hat_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body-loaded",
});


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
openGraph: openGraphFor({ path: "/" }),
    twitter: {
    card: "summary_large_image",
    title: "Samsara Group – Cultural Institution & Lifestyle House",
    description:
      "A cultural sanctuary and lifestyle institute preserving Indonesian architectural heritage, artisanal tactility, and contemporary hospitality.",
    images: ogImages(),
  },
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce");
  const brandNav = await getBrandNav();

  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: jsonLdHtml({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Samsara Group",
              url: SITE_URL,
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
          <BrandsProvider value={brandNav}>
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
          </BrandsProvider>
        </ThemeProvider>
        <BackToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
