import { siteUrl, ogImages } from "@/lib/site";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TextClipReveal from "@/components/TextClipReveal";
import { urlFor } from "@/sanity/lib/image";
import { getBrandCards } from "@/sanity/lib/brands";
import { jsonLdHtml } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brands — Samsara Group",
  description: "Explore the worlds of Samsara Group — Samsara, Svarga, Acasa, Outpace, and Grove.",
  alternates: {
    canonical: "/brands",
  },
  openGraph: {
    url: siteUrl("/brands"),
    images: ogImages(),
  },
};

/**
 * Card art for the established brands stays in `brands.ts` — the CMS `logo` is the
 * mark shown on the brand page header, not the one these cards use, so the local
 * paths remain authoritative until white-on-transparent assets are uploaded.
 */
export default async function BrandsPage() {
  const brands = await getBrandCards();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Brands — Samsara Group",
            url: siteUrl("/brands"),
    images: ogImages(),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: brands.map((b, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: { "@type": "Brand", name: b.name, url: siteUrl(`${b.href}`) },
              })),
            },
          }),
        }}
      />
      <Header />

      <section id="brands" className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pt-28 pb-16 lg:pt-36 lg:pb-24 scroll-mt-24">
        <ScrollReveal>
          <span className="mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant">BRANDS</span>
          <TextClipReveal>
            <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface mb-12">OUR WORLDS</h1>
          </TextClipReveal>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link key={brand.name} href={brand.href} className="group block border border-outline-variant overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/5] overflow-hidden">
                {brand.image ? (
                  <img src={urlFor(brand.image).url()} alt={brand.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <img src={brand.fallback} alt={brand.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-6">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-[75%] max-w-[280px] max-h-[45%] object-contain brightness-0 invert" />
                  ) : (
                    <h3 className="font-display text-headline-md lg:text-headline-lg uppercase text-white tracking-wide">{brand.name}</h3>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-title-lg uppercase text-on-surface mb-1">{brand.name}</h3>
                <p className="font-body text-body-sm text-on-surface-variant italic">{brand.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
