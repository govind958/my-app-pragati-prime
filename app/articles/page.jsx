"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Assuming these exist
import { Button } from "@/components/ui/button1"; // Assuming this exists
import Footer from "@/components/Footer"; // Assuming this exists
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

// Initialize Supabase Client
const supabase = createClient();

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading=true

  useEffect(() => {
    // Define an async function to fetch articles
    const fetchArticles = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, content, is_paid, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error.message);
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    };

    // Call the function
    fetchArticles();
    
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
            onError={(e) => e.currentTarget.style.display = 'none'} // Hide on error
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
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading articles...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Placeholder for image, since 'image_url' is not in the table */}
                  <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-400 text-sm">No Image Available</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${article.is_paid ? 'text-yellow-600' : 'text-primary'}`}>
                        {article.is_paid ? "Premium" : "Free"}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {article.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                      {article.content ? article.content.substring(0, 100) + '...' : 'No description available.'}
                    </p>
                    {/* Link to the article using its 'id' as a fallback */}
                    <Link href={`/articles/${article.id}`}>
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

