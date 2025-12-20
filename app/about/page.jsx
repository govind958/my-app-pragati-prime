"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function About() {
  const [aboutContent, setAboutContent] = useState({
    about_mission_paragraph1: "",
    about_mission_paragraph2: "",
    about_mission_paragraph3: "",
    about_vision_title: "Vision for Rural Girls & Women",
    about_vision_description: "",
    about_team_image_url: "",
    about_vision_image_url: ""
  });

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("about_mission_paragraph1, about_mission_paragraph2, about_mission_paragraph3, about_vision_title, about_vision_description, about_team_image_url, about_vision_image_url")
          .limit(1)
          .maybeSingle();
        
        if (data) {
          setAboutContent({
            about_mission_paragraph1: data.about_mission_paragraph1 || "",
            about_mission_paragraph2: data.about_mission_paragraph2 || "",
            about_mission_paragraph3: data.about_mission_paragraph3 || "",
            about_vision_title: data.about_vision_title || "Vision for Rural Girls & Women",
            about_vision_description: data.about_vision_description || "",
            about_hero_image_url: data.about_hero_image_url || "",
            about_team_image_url: data.about_team_image_url || "",
            about_vision_image_url: data.about_vision_image_url || ""
          });
        }
      } catch (error) {
        console.error("Error loading about content:", error);
      }
    };

    fetchAboutContent();
  }, []);
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">

      {/* Hero Section */}
      <section
        id="about-hero"
        className="relative flex flex-col items-center justify-center text-center 
                    min-h-[50vh] 
                    py-20 px-4 sm:px-6 md:px-16 
                    overflow-hidden bg-zinc-950/90 dark:bg-black/90"
      >
        {/* Background Image: Deeper Dark Overlay for Contrast */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.png"
            alt="About Pragati Prime"
            fill
            sizes="100vw"
            className="object-cover 
                     opacity-20 dark:opacity-10 
                     transition-transform duration-1000 ease-in-out 
                     hover:scale-105"
            priority  
          />
        </div>
        <div className="relative z-10 px-4 sm:px-0 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-tight tracking-tighter">
            <span className="bg-clip-text text-transparent 
                           bg-linear-to-r from-primary/90 to-orange-300 
                             transition-colors duration-300 ease-in-out">
              About Pragati Prime
            </span>
            <span className="text-white dark:text-zinc-50 block mt-2">
              Empowering Communities Through Action
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl text-zinc-300 dark:text-zinc-400 mx-auto">
            Empowering communities through education, healthcare, and sustainable development initiatives.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section
        id="about-us"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              About Us
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div className="space-y-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              <p>
                Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan (Regd.) is a New Delhi-based NGO dedicated to empowering rural women and adolescent girls by promoting health, education, and economic independence.
              </p>
              <p>
                Our mission is to uplift women from rural communities, especially in Western Uttar Pradesh and Delhi, by connecting them with government welfare schemes, creating awareness about health, and providing opportunities for skill development and financial growth.
              </p>
              <p>
                We work closely with local communities to organize health camps, awareness programs, livelihood training, education support, and grievance resolution for rural women.
              </p>
              <p>
                Through CSR partnerships and collaborative initiatives, we aim to provide sustainable support, financial assistance, and long-term development opportunities for women and girls.
              </p>
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 dark:bg-primary/5">
                <p className="font-semibold italic text-zinc-900 dark:text-zinc-100">
                  &ldquo;Healthy, Educated, and Empowered Girls Build a Stronger Nation.&rdquo;
                </p>
                <p className="text-sm uppercase tracking-wide text-primary/80 mt-3">
                  Tagline: &quot;Swasth, Shikshit aur Samarth Meri Beti.&quot;
                </p>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 md:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={aboutContent.about_team_image_url || "/team_image.png"}
                alt="Pragati Prime Team"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
          <div className="mt-12 rounded-3xl border border-primary/20 bg-rose-50/80 p-6 sm:p-10 text-base sm:text-lg text-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
            <h3 className="text-2xl font-semibold text-rose-900 dark:text-rose-200 mb-4">
              🌸 हमारे बारे में (Hindi)
            </h3>
            <div className="space-y-4 leading-relaxed">
              <p>
                प्रगति प्राइम – मेरी बेटी मेरा अभिमान महिला संगठन एक पंजीकृत गैर-सरकारी संस्था (NGO) है, जिसका उद्देश्य ग्रामीण क्षेत्रों की महिलाओं और किशोरियों को स्वास्थ्य, शिक्षा और आर्थिक सशक्तिकरण के माध्यम से आगे बढ़ाना है।
              </p>
              <p>
                हमारा लक्ष्य पश्चिमी उत्तर प्रदेश और दिल्ली की ग्रामीण महिलाओं को सरकारी योजनाओं का लाभ दिलाना, स्वास्थ्य जागरूकता बढ़ाना, कौशल विकास के अवसर प्रदान करना और उन्हें आर्थिक रूप से मजबूत बनाना है।
              </p>
              <p>
                संगठन द्वारा नियमित रूप से स्वास्थ्य शिविर, जागरूकता कार्यक्रम, कौशल प्रशिक्षण, शिक्षा सहायता, सरकारी योजनाओं की जानकारी, और ग्रामीण महिलाओं की समस्याओं का समाधान किया जाता है।
              </p>
              <p>
                CSR कंपनियों और सामाजिक संगठनों के सहयोग से हम महिलाओं को वित्तीय सहायता, प्रशिक्षण और स्थायी विकास के अवसर उपलब्ध कराने का कार्य करते हैं।
              </p>
              <div className="rounded-2xl bg-white/70 dark:bg-zinc-800/70 border border-rose-200/60 dark:border-rose-500/30 p-5">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  &ldquo;स्वस्थ, शिक्षित और समर्थ बेटियाँ ही मजबूत समाज और देश का निर्माण करती हैं।&rdquo;
                </p>
                <p className="text-sm tracking-wide text-rose-700 dark:text-rose-200 mt-3">
                  टैगलाइन: &ldquo;स्वस्थ, शिक्षित और समर्थ मेरी बेटी।&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="our-mission"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Mission
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 sm:gap-12">
            <div className="space-y-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-300">
              {aboutContent.about_mission_paragraph1 ? (
                <>
                  {aboutContent.about_mission_paragraph1 && <p>{aboutContent.about_mission_paragraph1}</p>}
                  {aboutContent.about_mission_paragraph2 && <p>{aboutContent.about_mission_paragraph2}</p>}
                  {aboutContent.about_mission_paragraph3 && <p>{aboutContent.about_mission_paragraph3}</p>}
                </>
              ) : (
                <>
                  <p>
                    Pragati Prime is committed to empowering rural women and adolescent girls in Western Uttar
                    Pradesh and Delhi NCR through health, education, and economic independence.
                  </p>
                  <p>
                    We bridge the gap between communities and government schemes, ensuring women can easily access
                    healthcare services, social security benefits, and livelihood opportunities.
                  </p>
                  <p>
                    By partnering with local leaders, institutions, and CSR initiatives, we design programs that
                    are practical, culturally rooted, and focused on long-term impact.
                  </p>
                </>
              )}
            </div>

            <div className="rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/30 p-6 sm:p-8 space-y-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                We focus on:
              </h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>Strengthening mother–child health and menstrual hygiene awareness.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>Supporting girls&apos; education, digital learning, and life-skills training.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>Creating income-generation avenues through skilling, SHGs, and entrepreneurship.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>Helping women raise their voices, access grievance redressal, and claim their rights.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        id="our-vision"
        className="py-16 sm:py-20 bg-zinc-100 dark:bg-zinc-900 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Vision
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-12">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-lg border border-primary/20">
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  {aboutContent.about_vision_title}
                </h3>
                {aboutContent.about_vision_description ? (
                  <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {aboutContent.about_vision_description}
                  </p>
                ) : (
                  <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    A Western Uttar Pradesh and Delhi NCR where every girl is healthy, educated, and economically confident—and every woman can claim government entitlements, livelihoods, and her own voice.
                  </p>
                )}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 dark:bg-primary/5">
                  <p className="font-semibold italic text-zinc-900 dark:text-zinc-100 text-lg">
                    &ldquo;Healthy, Educated, and Empowered Girls Build a Stronger Nation.&rdquo;
                  </p>
                  <p className="text-sm uppercase tracking-wide text-primary/80 mt-3">
                    Tagline: &quot;Swasth, Shikshit aur Samarth Meri Beti.&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Health & Well-being</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Ensuring every girl and woman has access to quality healthcare, nutrition, and wellness programs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Education & Learning</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Empowering girls through quality education, scholarships, and skill development opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Economic Independence</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Creating pathways for women to achieve financial security through entrepreneurship and employment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Rights & Entitlements</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Ensuring women can access and claim their rightful government benefits and legal protections.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-64 sm:h-80 md:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-lg">
              <Image
                src={aboutContent.about_vision_image_url || "/ai-imag.png"}
                alt="Vision for Rural Girls & Women"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-fit"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Areas Section */}
      <section
        id="impact-areas"
        className="py-20 sm:py-24 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-12 sm:mb-16 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Impact Areas
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
            {/* Education */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Education</h3>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                We believe education is the cornerstone of empowerment. Our education programs focus on:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Scholarships for underprivileged students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Educational infrastructure development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Teacher training and capacity building</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Digital learning resources and technology access</span>
                </li>
              </ul>
            </div>

            {/* Healthcare */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Healthcare</h3>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                Access to healthcare is a fundamental right. Our healthcare initiatives include:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Free health camps and medical checkups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Vaccination drives and preventive care</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Health awareness and hygiene programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Mental health support and counseling</span>
                </li>
              </ul>
            </div>

            {/* Women Empowerment */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Women Empowerment</h3>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                Empowering women creates stronger communities. Our programs support:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Entrepreneurship training and mentorship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Micro-loan programs for small businesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Financial literacy workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Leadership development programs</span>
                </li>
              </ul>
            </div>

            {/* Community Development */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Community Development</h3>
              </div>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
                Building resilient communities through infrastructure and capacity building:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Clean water initiatives and well construction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Community centers and learning hubs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Skill development and vocational training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Environmental sustainability programs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section
        id="our-approach"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                Our Approach
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Our methodology combines community engagement, data-driven solutions, and sustainable practices to create lasting impact
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {/* Step 1: Community Engagement */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 w-full md:w-1/4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">01</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Community Engagement</h3>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We begin by building strong relationships with local communities. Through dialogue, needs assessments, and participatory planning, we ensure that our programs are designed with and for the people we serve, not imposed upon them.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Regular community meetings and consultations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Participatory needs assessment and planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Local leadership involvement and capacity building</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2: Needs Assessment */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 w-full md:w-1/4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 mb-4">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">02</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Needs Assessment</h3>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Comprehensive data collection and analysis help us understand the root causes of challenges. We use evidence-based approaches to identify priorities and design targeted interventions that address real needs.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Comprehensive baseline surveys and data collection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Stakeholder mapping and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Evidence-based priority setting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3: Program Design */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 w-full md:w-1/4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 mb-4">
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">03</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Program Design</h3>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We design holistic programs that integrate multiple interventions. Our approach connects education, healthcare, economic empowerment, and infrastructure development to create synergistic effects and maximize impact.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Integrated multi-sectoral program design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Cultural sensitivity and local adaptation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Scalable and replicable model development</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4: Implementation */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 w-full md:w-1/4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 mb-4">
                  <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">04</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Implementation</h3>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  With strong community partnerships and local ownership, we implement programs through trained local teams. Regular monitoring ensures quality delivery and allows for adaptive management based on real-time feedback.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Local team training and capacity building</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Continuous monitoring and quality assurance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Adaptive management and course correction</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 5: Impact Measurement */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 w-full md:w-1/4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">05</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Impact Measurement</h3>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We track progress using clear indicators and metrics. Regular evaluations help us understand what works, what doesn&apos;t, and how to improve. This data-driven approach ensures accountability and continuous improvement.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Regular progress tracking and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Impact evaluations and outcome assessments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Learning documentation and knowledge sharing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 6: Sustainability */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
              <div className="flex-shrink-0 w-full md:w-1/4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">06</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Sustainability</h3>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  From the start, we build local capacity and ownership. Our programs are designed to become self-sustaining, with communities taking full responsibility for continued operation and growth long after our direct involvement.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Local ownership and governance structures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Resource mobilization and financial sustainability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span>Long-term partnership and support networks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Pragati Prime Section */}
      <section
        id="why-pragati-prime"
        className="py-20 sm:py-24 px-4 sm:px-6 md:px-16 bg-white dark:bg-zinc-950"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                Why Pragati Prime?
              </span>
              <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Discover what makes us different and why thousands trust us to create lasting change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Proven Track Record */}
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-zinc-50 dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Proven Track Record</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  With over 10,000+ lives touched, we have a demonstrated history of creating meaningful impact through our comprehensive programs and community partnerships.
                </p>
              </CardContent>
            </Card>

            {/* Community-Centered Approach */}
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-zinc-50 dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Community-Centered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We work directly with local communities, understanding their unique needs and co-creating solutions that are sustainable and culturally appropriate.
                </p>
              </CardContent>
            </Card>

            {/* Transparent & Accountable */}
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-zinc-50 dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Transparent & Accountable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We maintain complete transparency in our operations, regularly sharing impact reports and ensuring every contribution directly benefits the communities we serve.
                </p>
              </CardContent>
            </Card>

            {/* Holistic Solutions */}
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-zinc-50 dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Holistic Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Our integrated approach addresses education, healthcare, empowerment, and infrastructure together, creating comprehensive and lasting transformation.
                </p>
              </CardContent>
            </Card>

            {/* Experienced Team */}
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-zinc-50 dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Experienced Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Our dedicated team of professionals brings years of experience in development work, ensuring effective program implementation and maximum impact.
                </p>
              </CardContent>
            </Card>

            {/* Sustainable Impact */}
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-zinc-50 dark:bg-zinc-900">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl mb-2">Sustainable Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We focus on building capacity and creating self-sustaining programs that continue to benefit communities long after our direct involvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="about-cta"
        className="py-16 sm:py-20 text-center bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 transition-all duration-500 hover:from-orange-600 hover:to-orange-700"
      >
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">
            Join Us in Making a Difference
          </span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
          Together, we can create lasting change and build stronger communities. Your support makes our work possible.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
        <AuthActionButton />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

