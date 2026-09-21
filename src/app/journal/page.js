import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getArticles } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata = {
  title: "Journal — Samsara Group",
  description: "Stories, dispatches, and reflections from the Samsara Group world.",
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <>
      <Header />

      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">JOURNAL</h1>
        </ScrollReveal>
      </section>

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        {articles.length === 0 ? (
          <ScrollReveal>
            <p className="text-body-md text-on-surface-variant">No articles yet.</p>
          </ScrollReveal>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ScrollReveal key={article._id}>
                <Link href={`/journal/${article.slug?.current}`} className="block group">
                  <article className="relative overflow-hidden bg-surface-container-low border border-outline-variant transition-colors hover:border-outline">
                    <div className="img-hover aspect-[4/5]">
                      {article.image && (
                        <img src={urlFor(article.image).url()} alt={article.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="p-6">
                      {article.tag && <span className="mb-3 block text-label-caps-sm uppercase tracking-[0.2em] text-terracotta">{article.tag}</span>}
                      <h2 className="text-title-lg font-display uppercase leading-tight text-on-surface">{article.title}</h2>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
