"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button1";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
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
  
  // Banner images array
  const bannerImages = [
    "/banner-1.png",
    "/banner-2.png",
    "/banner-3.png",
    "/banner-4.png"
  ];

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("hero_title_line1, hero_title_line2, mission_statement, tagline")
          .limit(1)
          .maybeSingle();
        
        if (data) {
          setHomeContent({
            heroTitleLine1: data.hero_title_line1 || "Empowering Rural Women.",
            heroTitleLine2: data.hero_title_line2 || "Health. Education. Economic Independence.",
            missionStatement: data.mission_statement || "Healthy, Educated, and Empowered Girls Build a Stronger Nation.",
            tagline: data.tagline || "Swasth, Shikshit aur Samarth Meri Beti."
          });
        }
      } catch (error) {
        console.error("Error loading home content:", error);
      }
    };

    fetchHomeContent();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, content, is_paid, created_at, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3); // Show only 3 articles on home page

      if (error) {
        console.error("Error fetching articles:", error.message);
      } else {
        setArticles(data || []);
      }
      setLoadingArticles(false);
    };

    fetchArticles();
  }, []);

  // Auto-advance banner slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Helper function to get description from content
  const getDescription = (content) => {
    if (!content) return 'No description available.';
    const text = stripHTML(content);
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  // Contact form handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      // Here you can add logic to save to database or send email
      // For now, we'll just log and show success message
      console.log("Form submitted:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
                    min-h-[70vh] lg:min-h-screen 
                    py-28 px-4 sm:px-6 md:px-16 
                    overflow-hidden bg-zinc-950/90 dark:bg-black/90" // Stronger dark background
>
  {/* Banner Slider Background */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    {bannerImages.map((src, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        <Image
          src={src}
          alt={`Banner ${index + 1}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
      </div>
    ))}
    {/* Dark overlay for text contrast */}
    <div className="absolute inset-0 bg-zinc-950/70 dark:bg-black/70 z-20" />
  </div>
  
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

  <div className="relative z-10 px-4 sm:px-0 max-w-5xl mx-auto w-full">
    {/* Animated Text */}
    <EntranceAnimation>
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold max-w-4xl mx-auto leading-tight sm:leading-tight tracking-tight sm:tracking-tighter">
        <span className="bg-clip-text text-transparent 
                       bg-linear-to-r from-primary/90 to-orange-300 
                         transition-colors duration-300 ease-in-out">
          {homeContent.heroTitleLine1}
        </span>
        <span className="text-white dark:text-zinc-50 block mt-2">
          {homeContent.heroTitleLine2}
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

    {/* **IMPACT / CREDIBILITY ROW** */}
    <EntranceAnimation>
      <div className="mt-8 mb-10 text-center animate-delay-400">
          <p className="text-xl font-bold text-primary/80 tracking-wide uppercase">
              <span className="inline-block relative">
                10,000+ Rural Women Supported
                {/* Subtle pulse effect on a dot for focus */}
                <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-primary animate-ping-slow" />
              </span>
          </p>
      </div>
    </EntranceAnimation>

    {/* Animated Button Group (Conversion Focus) */}
    <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center animate-delay-500">
      
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
                     hover:bg-white/10 hover:border-white/50"
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
            <p>
              Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan (Regd.) is a New Delhi-based NGO dedicated to empowering rural women and adolescent girls by promoting health, education, and economic independence.
            </p>
            <p>
              Our mission is to uplift women from rural communities, especially in Western Uttar Pradesh and Delhi, by connecting them with government welfare schemes, enhancing health awareness, and opening pathways for skill development and financial growth.
            </p>
            <p>
              We collaborate closely with villages to run health camps, awareness drives, livelihood training, education support, and grievance redressal for rural women, while CSR partnerships help us deliver sustainable assistance and long-term development opportunities.
            </p>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-center text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              &ldquo;{homeContent.missionStatement}&rdquo;
              <div className="mt-2 text-sm uppercase tracking-wide text-primary">
                Tagline: &quot;{homeContent.tagline}&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - Feature Cards */}
      <section className="py-16 sm:py-20 bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                What We Do
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We combine health, education, livelihood, and protection services so rural women and girls can lead self-reliant, dignified lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Education Card */}
            <Card className="rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Scholarships, bridge courses, and digital learning labs keep rural girls in school and open new futures in Western Uttar Pradesh and Delhi.
                </p>
              </CardContent>
            </Card>

            {/* Healthcare Card */}
            <Card className="rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Mobile health camps, screenings, and menstrual health awareness ensure women receive timely care and trusted information close to home.
                </p>
              </CardContent>
            </Card>

            {/* Empowerment Card */}
            <Card className="rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Entrepreneurship cohorts, micro-loans, and mentorship circles help women launch enterprises and gain financial independence.
                </p>
              </CardContent>
            </Card>

            {/* Infrastructure Card */}
            <Card className="rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Safe community hubs, water systems, and digital kiosks connect families to government welfare schemes and essential services.
                </p>
              </CardContent>
            </Card>

            {/* Environment Card */}
            <Card className="rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Climate-smart farming demos and water conservation drives protect village livelihoods and the environment women depend on.
                </p>
              </CardContent>
            </Card>

            {/* Community Development Card */}
            <Card className="rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Community Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Women-led collectives, grievance cells, and youth clubs nurture leadership and collective action across hamlets.
                </p>
              </CardContent>
            </Card>
          </div>
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

          {/* Story 1 - Education */}
          <div className="mb-10 sm:mb-16 rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl bg-white dark:bg-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative w-full h-[400px] md:h-full order-1 md:order-1">
                <Image
                  src="/new-1.png"
                  alt="Education for Every Child"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Education</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Keeping Girls in School
                </h3>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  Learning labs, bicycles, and mentoring circles ensure adolescent girls from rural blocks can continue their education, delay early marriage, and dream bigger.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Students Supported</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">120</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Teachers Trained</div>
                  </div>
                </div>
                <Link href="/articles" className="inline-flex items-center text-primary hover:text-primary/80 font-semibold group">
                  Learn More
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Story 2 - Women Empowerment */}
          <div className="mb-10 sm:mb-16 rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl bg-white dark:bg-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Empowerment</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Women-Led Enterprises
                </h3>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  SHG federations, product design labs, and CSR-backed seed funding are helping first-generation women entrepreneurs earn steady incomes and employ their peers.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">200+</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Women Entrepreneurs</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹5L+</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Micro-loans Disbursed</div>
                  </div>
                </div>
                <Link href="/articles" className="inline-flex items-center text-primary hover:text-primary/80 font-semibold group">
                  Learn More
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="relative w-full h-[400px] md:h-full order-1 md:order-2">
                <Image
                  src="/new-2.png"
                  alt="Empowering Women Entrepreneurs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Story 3 - Clean Water */}
          <div className="mb-10 sm:mb-16 rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl bg-white dark:bg-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative w-full h-[400px] md:h-full order-1 md:order-1">
                <Image
                  src="/new-3.png"
                  alt="Clean Water Initiative"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">Infrastructure</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Clean Water, Safer Villages
                </h3>
                <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  Women water stewards maintain hand pumps, lead hygiene sessions, and advocate for government repairs so families spend less time fetching water and stay healthier year-round.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">50+</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">Water Wells Built</div>
                  </div>
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">10K+</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">People Served</div>
                  </div>
                </div>
                <Link href="/articles" className="inline-flex items-center text-primary hover:text-primary/80 font-semibold group">
                  Learn More
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
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
                          className="object-cover"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Baghpat Health & Nutrition Camp",
                desc: "412 women screened for anemia, BP, and maternal health support.",
              },
              {
                title: "Skill Bridge Cohort Graduates",
                desc: "60 adolescent girls completed tailoring and digital literacy modules.",
              },
              {
                title: "New CSR Partner Onboarded",
                desc: "Corporate allies expand micro-loan pool for rural entrepreneurs.",
              },
            ].map((u, i) => (
              <Card key={i} className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:border-blue-500/20 hover:bg-white dark:hover:bg-zinc-800 cursor-default">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{u.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">{u.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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