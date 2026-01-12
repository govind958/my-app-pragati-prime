"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button1";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
});
import { createClient } from "@/utils/supabase/client";
import { stripHTML } from "@/lib/htmlUtils";


// Keyframe simulation for a subtle entrance animation
// Note: In a real app, you'd use Framer Motion's `initial` and `animate`
// for this, but for pure Tailwind, we'll rely on transitions and transforms.
const EntranceAnimation = ({ children }) => (
  <div className="animate-fade-in-up">
    {children}
  </div>
);

const supabase = createClient();

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [homeContent, setHomeContent] = useState({
    heroTitleLine1: "Empowering Rural Women.",
    heroTitleLine2: "Health. Education. Economic Independence.",
    missionStatement: "Healthy, Educated, and Empowered Girls Build a Stronger Nation.",
    tagline: "Swasth, Shikshit aur Samarth Meri Beti."
  });
  const [whatWeDoContent, setWhatWeDoContent] = useState([]);
  const [impactStories, setImpactStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [missionTexts, setMissionTexts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    location: "",
    interestedToConnect: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerImages, setBannerImages] = useState([
    "/banner-1.png",
    "/banner-2.png",
    "/banner-3.png",
    "/banner-4.png"
  ]);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("hero_title_line1, hero_title_line2, mission_statement, tagline, banner_images, what_we_do_paragraphs")
          .limit(1)
          .maybeSingle();
        
        if (data) {
          setHomeContent({
            heroTitleLine1: data.hero_title_line1 || "Empowering Rural Women.",
            heroTitleLine2: data.hero_title_line2 || "Health. Education. Economic Independence.",
            missionStatement: data.mission_statement || "Healthy, Educated, and Empowered Girls Build a Stronger Nation.",
            tagline: data.tagline || "Swasth, Shikshit aur Samarth Meri Beti."
          });
          
          // Load banner images from database
          if (data.banner_images && Array.isArray(data.banner_images) && data.banner_images.length > 0) {
            // Handle both old string format and new object format
            const processedBanners = data.banner_images.map(banner => {
              if (typeof banner === 'string') {
                // Old format: just image URL string
                return {
                  image: banner,
                  titleLine1: data.hero_title_line1 || "Empowering Rural Women.",
                  titleLine2: data.hero_title_line2 || "Health. Education. Economic Independence."
                };
              } else {
                // New format: object with image, titleLine1, titleLine2
                return {
                  image: banner.image || banner,
                  titleLine1: banner.titleLine1 || data.hero_title_line1 || "Empowering Rural Women.",
                  titleLine2: banner.titleLine2 || data.hero_title_line2 || "Health. Education. Economic Independence."
                };
              }
            });
            setBannerImages(processedBanners);
          }
          
          // Load What We Do content
          setWhatWeDoContent(
            Array.isArray(data.what_we_do_paragraphs)
              ? data.what_we_do_paragraphs.filter(item => item && item.content && item.content.trim() !== "")
              : []
          );
        }
      } catch (error) {
        console.error("Error loading home content:", error);
      }
    };

    fetchHomeContent();
  }, []); // Empty deps - only run once on mount

  useEffect(() => {
    let cancelled = false;
    
    const fetchArticles = async () => {
      setLoadingArticles(true);
      
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, content, is_paid, created_at, image_url")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(3); // Show only 3 articles on home page

        if (error) {
          console.error("Error fetching articles:", error.message);
        } else if (!cancelled) {
          setArticles(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching articles:", err);
        }
      } finally {
        if (!cancelled) {
          setLoadingArticles(false);
        }
      }
    };

    fetchArticles();
    
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchImpactStories = async () => {
      setLoadingStories(true);
      try {
        const { data, error } = await supabase
          .from("impact_stories")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error fetching impact stories:", error.message);
          setImpactStories([]);
        } else {
          setImpactStories(data || []);
        }
      } catch (err) {
        console.error("Error fetching impact stories:", err);
        setImpactStories([]);
      } finally {
        setLoadingStories(false);
      }
    };

    const fetchRecentUpdates = async () => {
      setLoadingUpdates(true);
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("recent_updates, mission_texts")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching recent updates:", error.message);
          setRecentUpdates([]);
        } else {
          setRecentUpdates(data?.recent_updates || []);
          setMissionTexts(data?.mission_texts || []);
        }
      } catch (err) {
        console.error("Error fetching recent updates:", err);
        setRecentUpdates([]);
      } finally {
        setLoadingUpdates(false);
      }
    };

    fetchImpactStories();
    fetchRecentUpdates();
  }, []);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  }, [bannerImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  }, [bannerImages.length]);

  // Auto-advance banner slider
  useEffect(() => {
    if (bannerImages.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length, nextSlide]);

  // Memoized helper function to get description from content
  const getDescription = useCallback((content) => {
    if (!content) return 'No description available.';
    const text = stripHTML(content);
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }, []);

  // Contact form handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      // Save contact form to database
      const { error } = await supabase.from("contact_us").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        state: formData.state,
        location: formData.location || '',
        interested_to_connect: formData.interestedToConnect,
        status: "new",
      });
      if (error) {
        console.error("Error inserting contact form:", error);
        alert("Failed to submit form. Please try again.");
        return;
      }
      
      setFormSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        state: "",
        location: "",
        interestedToConnect: false,
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
     {/* Hero Section - ENHANCED for Modern UI/UX */}
<section className="relative flex flex-col items-center justify-center text-center 
                    min-h-[60vh] sm:min-h-[70vh] lg:min-h-screen 
                    py-20 sm:py-28 px-4 sm:px-6 md:px-16 
                    overflow-hidden bg-zinc-950/90 dark:bg-black/90"
>
  {/* Banner Slider Background */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    {bannerImages.map((banner, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        <Image
          src={banner.image}
          alt={`Banner ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain sm:object-cover object-center"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          quality={index === 0 ? 90 : 75}
        />
      </div>
    ))}
    {/* Dark overlay for text contrast */}
    <div className="absolute inset-0 bg-zinc-950/70 dark:bg-black/70 z-20" />
  </div>
  
  {/* Navigation Arrows */}
  {bannerImages.length > 1 && (
    <>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-primary transition-colors" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-primary transition-colors" />
      </button>
    </>
  )}
  
  {/* Slider Navigation Dots */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
    {bannerImages.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          index === currentSlide
            ? "bg-primary w-8"
            : "bg-white/50 hover:bg-white/75"
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>

  <div className="relative z-10 px-4 sm:px-0 max-w-5xl mx-auto w-full flex flex-col justify-between h-full">
    {/* Animated Text - Shifted upward */}
    <EntranceAnimation>
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold max-w-4xl mx-auto leading-tight sm:leading-tight tracking-tight sm:tracking-tighter -mt-8 sm:-mt-12 md:-mt-16">
        <span className="bg-clip-text text-transparent
                       bg-linear-to-r from-primary/90 to-orange-300
                         transition-colors duration-300 ease-in-out">
          {bannerImages[currentSlide]?.titleLine1 || homeContent.heroTitleLine1}
        </span>
        <span className="text-white dark:text-zinc-50 block mt-2">
          {bannerImages[currentSlide]?.titleLine2 || homeContent.heroTitleLine2}
        </span>
      </h1>
    </EntranceAnimation>
    
    {/* Sliding Highlight Banner (moved up to replace the paragraph) */}
    <div className="relative mt-8 w-full overflow-hidden animate-delay-200">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-zinc-950/90 via-zinc-950/40 to-transparent dark:from-black/90 dark:via-black/40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-zinc-950/90 via-zinc-950/40 to-transparent dark:from-black/90 dark:via-black/40" />

      <div className="flex items-center gap-4 sm:gap-6 marquee">
        {[
          "10,000+ Women Impacted",
          "200+ Health Camps",
          "Scholarships for Girls",
          "Skill Training & Jobs",
          "Menstrual Health Drives",
          "Nutrition & Wellness",
          "Access to Government Schemes",
        ].map((item) => (
          <div
            key={item}
            className="shrink-0 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-primary/20 backdrop-blur"
          >
            {item}
          </div>
        ))}
        {[
          "10,000+ Women Impacted",
          "200+ Health Camps",
          "Scholarships for Girls",
          "Skill Training & Jobs",
          "Menstrual Health Drives",
          "Nutrition & Wellness",
          "Access to Government Schemes",
        ].map((item, idx) => (
          <div
            key={`dupe-${idx}`}
            className="shrink-0 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-primary/20 backdrop-blur"
          >
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* **IMPACT / CREDIBILITY ROW** - Shifted downward */}
    <EntranceAnimation>
      <div className="mt-16 sm:mt-20 md:mt-24 mb-6 text-center animate-delay-400">
          <p className="text-xl font-bold text-primary/80 tracking-wide uppercase ">
              <span className="inline-block relative">
                10,000+ Rural Women Supported
                {/* Subtle pulse effect on a dot for focus */}
                <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-primary animate-ping-slow" />
              </span>
          </p>
      </div>
    </EntranceAnimation>

    {/* Animated Button Group (Conversion Focus) - Shifted downward */}
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center animate-delay-500">
      
      {/* Primary CTA: Magnetic, High-Contrast */}
      <Link href="/login">
        <Button 
          size="lg" 
          className="rounded-full px-10 py-7 text-lg font-bold 
                     bg-primary hover:bg-primary/90 text-white 
                     shadow-2xl shadow-primary/40 
                     transition-all duration-300 
                     hover:scale-105 hover:shadow-primary/60 
                     focus:ring-4 focus:ring-primary/50"
        >
          Join the Movement Now
        </Button>
      </Link>
      
      {/* Secondary CTA: Transparent for less visual weight */}
      <Link href="/about">
        <Button 
          variant="outline" 
          size="lg" 
          className="rounded-full px-8 py-7 text-lg font-medium 
                     bg-transparent border-white/30 text-white 
                     transition-all duration-300 
                     hover:bg-white/10 hover:border-white/50 hover:text-white"
        >
          See Our Impact
        </Button>
      </Link>
      
    </div>

  </div>
</section>

      {/* Impact / About Preview */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="relative text-center mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Mission
            </span>
            {/* Pulsating/Vibrating separator for subtle attention */}
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70 animate-pulse-slow" />
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto px-4 sm:px-0 text-center">
            {/* <p>
              Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan (Regd.) is a New Delhi-based NGO dedicated to empowering rural women and adolescent girls by promoting health, education, and economic independence.
            </p> */}
            {missionTexts.map((text, index) => (
              <p key={index} className="mb-4">
                {text}
              </p>
            ))}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-center text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              &ldquo;{homeContent.missionStatement}&rdquo;
              <div className="mt-2 text-sm uppercase tracking-wide text-primary">
                Tagline: &quot;{homeContent.tagline}&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Simple Paragraphs */}
      <section className="py-16 sm:py-20 bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                What We Do
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
            </h2>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-4 text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed list-none">
            {Array.isArray(whatWeDoContent) && whatWeDoContent.map((paragraph, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary mt-2 shrink-0">•</span>
                <span className="flex-1">{paragraph.content}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Impact Stories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-linear-to-b from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                Key Impact Stories
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Real stories of transformation and positive change in communities we serve
            </p>
          </div>

          {/* Impact Stories from Database */}
          {loadingStories ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading stories...</p>
              </div>
            </div>
          ) : impactStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">No impact stories available at the moment.</p>
            </div>
          ) : (
            impactStories.map((story, index) => {
              const isEven = index % 2 === 0;
              const colorClasses = [
                { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
                { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
                { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400" }
              ];
              const colors = colorClasses[index % colorClasses.length];
              
              return (
                <div key={story.id} className="mb-10 sm:mb-16 rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl bg-white dark:bg-zinc-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className={`relative w-full h-[400px] md:h-full ${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}>
                      {story.image_url ? (
                        <Image
                          src={story.image_url}
                          alt={story.main_title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                          <span className="text-zinc-400">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className={`p-6 sm:p-8 md:p-10 flex flex-col justify-center ${isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                          <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className={`text-sm font-semibold ${colors.text} uppercase tracking-wide`}>
                          {story.title}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        {story.main_title}
                      </h3>
                      <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                        {story.description}
                      </p>
                      <Link href="/articles" className="inline-flex items-center text-primary hover:text-primary/80 font-semibold group">
                        Learn More
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                Articles
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 rounded-full bg-primary/70" />
            </h2>
            <Link href="/articles" className="text-sm text-primary hover:underline self-start sm:self-auto transition-colors duration-300 hover:text-primary/70">View all</Link>
          </div>
          {/* Animated Article Cards */}
          {loadingArticles ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading articles...</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">No articles available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article) => (
                <Card 
                  key={article.id} 
                  className="rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:scale-[1.02] cursor-pointer overflow-hidden"
                >
                  <Link href={`/articles/${article.id}`}>
                    {article.image_url && (
                      <div className="relative h-48 mt-[-24px] w-full bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          loading="lazy"
                          quality={80}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium ${article.is_paid ? 'text-yellow-600' : 'text-primary'}`}>
                          {article.is_paid ? "Premium" : "Free"}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300 hover:text-primary">
                        {article.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{getDescription(article.content)}</p>
                      <span className="text-primary hover:underline transition-colors duration-300 hover:text-primary/70">Read more</span>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Recent Updates */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                Recent Updates
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 rounded-full bg-primary/70" />
            </h2>
            <Link href="/articles" className="text-sm text-primary hover:underline self-start sm:self-auto transition-colors duration-300 hover:text-primary/70">View all</Link>
          </div>
          {/* Animated Update Cards */}
          {loadingUpdates ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading updates...</p>
              </div>
            </div>
          ) : recentUpdates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {recentUpdates.map((update, index) => (
                <Card key={index} className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:border-blue-500/20 hover:bg-white dark:hover:bg-zinc-800 cursor-default">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{update.heading}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-400">{update.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">No recent updates available. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              <span className=" bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Connect with us to learn more about our initiatives and how you can contribute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Contact Image */}
            <div className="mb-8 md:mb-0">
              <div className="relative w-full h-[420px] md:h-full min-h-[460px]">
                <Image
                  src="/contact-us.png"
                  alt="Contact us illustration"
                  fill
                  className="object-contain rounded-2xl"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading="lazy"
                  quality={85}
                />
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-2 border-primary/20 shadow-xl h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold text-primary mb-2">Thank You!</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      We&apos;ve received your message and will get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="w-full"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email address"
                        className="w-full"
                      />
                    </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter your state"
                      className="w-full"
                    />
                  </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Enter your Address"
                        className="w-full"
                      />
                    </div>

                    {/* Interested to Connect (Checkbox) */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="interestedToConnect"
                        checked={formData.interestedToConnect}
                        onChange={(e) => setFormData({ ...formData, interestedToConnect: e.target.checked })}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <Label htmlFor="interestedToConnect" className="font-normal cursor-pointer">
                        Interested to Connect
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                    >
                      {formSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-16 sm:py-20 text-center bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 transition-all duration-500 hover:from-orange-600 hover:to-orange-700">
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">
            Ready to Make a Difference?
          </span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">Help rural women and girls access healthcare, classrooms, and dignified livelihoods.</p>
        <Link href="/login">
          <Button 
            size="lg" 
            variant="secondary" 
            className="rounded-full bg-white text-orange-600 w-full sm:w-auto 
                       transition-all duration-300 
                       hover:bg-orange-100 hover:text-orange-800 hover:scale-105 
                       shadow-xl hover:shadow-2xl"
          >
            Join Now
          </Button>
        </Link>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// NOTE: To make the `animate-fade-in-up`, `animate-delay-200`, `animate-delay-400`
// and `animate-pulse-slow` classes work, you would need to extend your `tailwind.config.js`
// with custom keyframes and utility classes, like this:

/*
// Inside tailwind.config.js
module.exports = {
  // ... other configs
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  // ... other configs
}
*/