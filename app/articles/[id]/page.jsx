"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer"; 
import { createClient } from "@/utils/supabase/client"; 
import { Button } from "@/components/ui/button1";
import { sanitizeHTML } from "@/lib/htmlUtils";

// Initialize Supabase Client
const supabase = createClient();

export default function ArticleDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;

  // Sanitize HTML content
  const sanitizedContent = useMemo(() => {
    if (!article || !article.content) {
      return "<p>This article has no content.</p>"
    }
    return sanitizeHTML(article.content) || "<p>This article has no content.</p>"
  }, [article])

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return; 

      setLoading(true);
      setError(null);

      // Fetch the single article.
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, content, is_paid, created_at, published, image_url")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error) {
        console.error("Error fetching article:", error.message);

        setError("Article not found or you do not have permission to view it.");
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Error or Not Found State
  if (error || !article) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
            {error || "Article Not Found"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            The page you are looking for might have been removed or is unavailable.
          </p>
          <Link href="/articles">
            <Button>← Back to All Articles</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Success State: Display the article
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <div className="max-w-3xl mx-auto py-16 sm:py-24 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${article.is_paid ? 'text-yellow-600' : 'text-primary'}`}>
              {article.is_paid ? "Premium Article" : "Free Article"}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
            {article.title}
          </h1>
        </header>
        
        {/* Placeholder for a featured image */}
        <div className="relative h-64 sm:h-96 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-8 overflow-hidden">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority // Prioritize loading the main article image
            />
          ) : (
            <div className="flex items-center justify-center h-full">
               <span className="text-zinc-400">No Image Available</span>
            </div>
          )}
        </div>

        {/* Article Content */}
        <article 
          className="prose prose-lg dark:prose-invert max-w-none article-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t dark:border-zinc-800 text-center">
          <Link href="/articles">
            <Button variant="outline">← Back to All Articles</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
