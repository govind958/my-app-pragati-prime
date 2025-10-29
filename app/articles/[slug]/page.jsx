"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/lib/articles";
import { useParams } from "next/navigation";

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      const foundArticle = getArticleBySlug(params.slug);
      setArticle(foundArticle);
      setLoading(false);
    }
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Article Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/articles">
            <Button className="rounded-full">Back to Articles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:py-32 sm:px-6 md:px-16">
        {article.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="100vw"
              className="object-cover opacity-20 dark:opacity-10"
            />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm text-primary bg-primary/10">
              {article.category || "General"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {article.title}
            </span>
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-4 sm:px-6 md:px-16 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto prose prose-zinc dark:prose-invert">
          {article.image && (
            <div className="relative w-full h-64 sm:h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {article.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('# ')) {
                return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">{paragraph.substring(2)}</h2>;
              } else if (paragraph.startsWith('## ')) {
                return <h3 key={i} className="text-xl font-semibold mt-6 mb-3 text-zinc-900 dark:text-zinc-100">{paragraph.substring(3)}</h3>;
              } else if (paragraph.startsWith('- ')) {
                return <li key={i} className="ml-6 mb-2">{paragraph.substring(2)}</li>;
              } else if (paragraph.trim() === '') {
                return <br key={i} />;
              } else {
                return <p key={i} className="mb-4">{paragraph}</p>;
              }
            })}
          </div>
        </div>
      </article>

      {/* Navigation */}
      <section className="py-8 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/articles">
            <Button variant="outline" className="rounded-full">
              ← Back to Articles
            </Button>
          </Link>
          <Link href="/articles/admin">
            <Button variant="ghost" className="rounded-full text-sm">
              Admin Panel
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

