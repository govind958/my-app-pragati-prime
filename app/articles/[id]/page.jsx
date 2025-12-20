"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
}); 
import { createClient } from "@/utils/supabase/client"; 
import { Button } from "@/components/ui/button1";
import { sanitizeHTML } from "@/lib/htmlUtils";

// Initialize Supabase Client
const supabase = createClient();

export default function ArticleDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremiumMember, setIsPremiumMember] = useState(false);
  const [planName, setPlanName] = useState(null);
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
    let cancelled = false;
    
    const fetchArticle = async () => {
      if (!id) return; 

      setLoading(true);
      setError(null);

      try {
        // Parallelize queries for better performance
        const [
          { data: { user } },
          { data: articleData, error: articleError }
        ] = await Promise.all([
          supabase.auth.getUser(),
          supabase
        .from("articles")
            .select("id, title, content, is_paid, created_at, published, image_url, required_plan_name")
        .eq("id", id)
        .eq("published", true)
            .single()
        ]);

        if (cancelled) return;

        if (articleError) {
          console.error("Error fetching article:", articleError.message);
        setError("Article not found or you do not have permission to view it.");
          setLoading(false);
          return;
        }

        setArticle(articleData);

        // Check membership status if user is logged in
        if (user) {
          const { data: memberData } = await supabase
            .from("members")
            .select("membership_type, plan_id")
            .eq("profile_id", user.id)
            .maybeSingle();

          if (cancelled) return;

          if (memberData?.membership_type === "paid") {
            setIsPremiumMember(true);

            if (memberData.plan_id) {
              const { data: planData } = await supabase
                .from("membership_plans")
                .select("name")
                .eq("id", memberData.plan_id)
                .maybeSingle();

              if (!cancelled && planData?.name) {
                setPlanName(planData.name);
      }
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Unexpected error loading article:", err);
          setError("Something went wrong while loading the article.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchArticle();
    
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
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
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
              quality={90}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
               <span className="text-zinc-400">No Image Available</span>
            </div>
          )}
        </div>

        {/* Article Content */}
        {article.is_paid && !isPremiumMember ? (
          <div className="border border-orange-200 bg-orange-50 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-lg font-semibold text-orange-800 mb-2">
              This is a members-only article.
            </p>
            <p className="text-sm text-orange-700 mb-6">
              Become an Active, Executive, or CSR Member to read the full content and access all premium articles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  Login to your account
                </Button>
              </Link>
              <Link href="/private">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                  View Membership Plans
                </Button>
              </Link>
            </div>
          </div>
        ) : article.is_paid && article.required_plan_name && planName && (() => {
            const order = {
              "Active Member": 1,
              "Executive Member": 2,
              "CSR Member": 3,
            }
            const memberLevel = order[planName] || 0
            const requiredLevel = order[article.required_plan_name] || 0
            return memberLevel < requiredLevel
          })() ? (
          <div className="border border-orange-200 bg-orange-50 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-lg font-semibold text-orange-800 mb-2">
              This article is available only for {article.required_plan_name}s.
            </p>
            <p className="text-sm text-orange-700 mb-6">
              Your current membership plan does not include this content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/private">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                  View Membership Plans
                </Button>
              </Link>
            </div>
          </div>
        ) : (
        <article 
          className="prose prose-lg dark:prose-invert max-w-none article-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        )}

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
