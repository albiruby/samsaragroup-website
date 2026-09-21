import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getArticleBySlug, getArticles } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} — Samsara Group Journal`,
    description: article.excerpt,
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug?.current })).filter(Boolean);
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <Header />
      <section className="bg-surface pt-28 pb-16 max-w-[1520px] mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Link href="/journal" className="mb-8 inline-flex items-center gap-2 text-label-caps-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-terracotta transition-colors">← ALL ARTICLES</Link>
          {article.tag && <span className="mt-4 mb-4 block text-label-caps-sm uppercase tracking-[0.2em] text-terracotta">{article.tag}</span>}
          <h1 className="text-display-md-mobile md:text-display-md font-display uppercase leading-[0.95] text-on-surface">{article.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-body-sm text-on-surface-variant">
            {article.author && <span>{article.author}</span>}
            {article.date && <span>{article.date}</span>}
          </div>
        </ScrollReveal>
      </section>

      {article.image && (
        <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-16">
          <ScrollReveal>
            <div className="img-hover w-full aspect-[21/9]">
              <img src={urlFor(article.image).url()} alt={article.title} className="h-full w-full object-cover" />
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="bg-surface max-w-[1520px] mx-auto px-6 lg:px-10 pb-28">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            {article.body && (
              <div className="prose prose-lg text-on-surface-variant">
                {article.body.map((block, i) => {
                  if (block._type === "block") {
                    return (
                      <p key={i} className="text-body-md leading-relaxed mb-6">
                        {block.children?.map((child) => child.text).join("")}
                      </p>
                    );
                  }
                  if (block._type === "image" && block.asset) {
                    return (
                      <div key={i} className="my-8 overflow-hidden">
                        <img src={urlFor(block).url()} alt={block.alt || article.title} className="w-full object-cover" />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
