"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer"; // Assuming this exists
import { createClient } from "@/utils/supabase/client"; // Import Supabase client
import { Button } from "@/components/ui/button"; // Assuming this exists

// Initialize Supabase Client
const supabase = createClient();

export default function ArticleDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return; // Don't fetch if ID isn't available yet

      setLoading(true);
      setError(null);

      // Fetch the single article.
      // We only need to check for 'published' = true.
      // Your RLS policies will automatically handle paid/free access.
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, content, is_paid, created_at, published")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error) {
        console.error("Error fetching article:", error.message);
        // This error can happen if the article doesn't exist OR
        // if RLS policy denies access (e.g., free user on paid article)
        setError("Article not found or you do not have permission to view it.");
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]); // Re-run when the 'id' from the URL changes

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <div className="max-w-3xl mx-auto py-16 sm:py-24 px-4 animate-pulse">
          <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
          <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-8"></div>
          <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-8"></div>
          <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
          <div className="h-6 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
          <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <Footer />
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
        <div className="relative h-64 sm:h-96 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-8 flex items-center justify-center">
          <span className="text-zinc-400">Article Image Placeholder</span>
        </div>

        {/* Article Content */}
        {/* We use a 'prose' class from Tailwind Typography for nice formatting */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {/* This renders the article content. 
              If it's Markdown, you'd use a library like 'react-markdown'.
              For plain text, a <p> tag is fine.
          */}
          <p>
            {article.content || "This article has no content."}
          </p>
        </article>

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
