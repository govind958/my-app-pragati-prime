"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { getArticles } from "@/lib/articles";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load articles from localStorage
    const loadedArticles = getArticles();
    setArticles(loadedArticles);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.png"
            alt="Articles & Updates"
            fill
            sizes="100vw"
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">Articles & Updates</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-800 dark:text-zinc-400">
            Stay informed about our latest initiatives, impact stories, and community updates.
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                All Articles
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 rounded-full bg-primary/70" />
            </h2>
            <Link href="/articles/admin">
              <Button variant="outline" size="sm" className="rounded-full">
                Admin Panel
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">No articles found.</p>
              <Link href="/articles/admin">
                <Button className="rounded-full">Create Your First Article</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {article.image && (
                    <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary font-medium">{article.category || "General"}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {article.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <Link href={`/articles/${article.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:underline p-0">
                        Read more →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

