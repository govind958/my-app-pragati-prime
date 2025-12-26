"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function Vision() {
  const [focusAreas, setFocusAreas] = useState([]);
  const [loadingFocusAreas, setLoadingFocusAreas] = useState(true);
  const [bannerText, setBannerText] = useState({
    title: "",
    subtitle: "",
    description: ""
  });
  const [childInitiativesParagraph, setChildInitiativesParagraph] = useState("");
  const [womenEmpowermentVision, setWomenEmpowermentVision] = useState("");
  const [protectionInitiatives, setProtectionInitiatives] = useState("");
  const [ctaJoinMission, setCtaJoinMission] = useState("");

  useEffect(() => {
    const fetchFocusAreas = async () => {
      setLoadingFocusAreas(true);
      try {
        const { data, error } = await supabase
          .from("focus_areas")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching focus areas:", error.message);
          setFocusAreas([]);
        } else {
          setFocusAreas(data ? [data] : []);
        }
      } catch (err) {
        console.error("Error fetching focus areas:", err);
        setFocusAreas([]);
      } finally {
        setLoadingFocusAreas(false);
      }
    };

    fetchFocusAreas();
  }, []);

  useEffect(() => {
    const fetchBannerText = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("banner_texts, child_initiatives_paragraph, women_empowerment_vision, protection_initiatives, cta_join_mission")
          .limit(1)
          .maybeSingle();

        // Extract banner text for vision page
        if (data.banner_texts && Array.isArray(data.banner_texts)) {
          const visionBannerText = data.banner_texts.find(item => item.page === 'vision');
          if (visionBannerText) {
            setBannerText({
              title: visionBannerText.title || "",
              subtitle: visionBannerText.subtitle || "",
              description: visionBannerText.description || ""
            });
          }
        }

        // Set child initiatives paragraph
        if (data.child_initiatives_paragraph) {
          setChildInitiativesParagraph(data.child_initiatives_paragraph);
        }

        // Set women empowerment vision
        if (data.women_empowerment_vision) {
          setWomenEmpowermentVision(data.women_empowerment_vision);
        }

        // Set protection initiatives
        if (data.protection_initiatives) {
          setProtectionInitiatives(data.protection_initiatives);
        }

        // Set CTA join mission
        if (data.cta_join_mission) {
          setCtaJoinMission(data.cta_join_mission);
        }
      } catch (error) {
        console.error("Error loading vision banner text:", error);
      }
    };

    fetchBannerText();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section
        id="vision-hero"
        className="relative flex flex-col items-center justify-center text-center 
                    min-h-[50vh] 
                    py-20 px-4 sm:px-6 md:px-16 
                    overflow-hidden bg-zinc-950/90 dark:bg-black/90"
      >
        {/* Background Image: Deeper Dark Overlay for Contrast */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.png"
            alt="Our Vision"
            fill
            sizes="100vw"
            className="object-cover 
                     opacity-20 dark:opacity-10 
                     transition-transform duration-1000 ease-in-out 
                     hover:scale-105"
            priority  
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950/80" />
        </div>
        <div className="relative z-10 px-4 sm:px-0 max-w-5xl">
          {bannerText.title && (
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-tight tracking-tighter drop-shadow-lg">
              <span className="bg-clip-text text-transparent
                             bg-linear-to-r from-primary/90 to-orange-300
                               transition-colors duration-300 ease-in-out">
                {bannerText.title}
              </span>
              {bannerText.subtitle && (
                <span className="text-white dark:text-zinc-50 block mt-2 drop-shadow-md">
                  {bannerText.subtitle}
                </span>
              )}
            </h1>
          )}
          {bannerText.description && (
            <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl text-zinc-200 dark:text-zinc-300 mx-auto leading-relaxed drop-shadow-sm">
              {bannerText.description}
            </p>
          )}
          <div className="mt-8 rounded-2xl border border-white/40 bg-white/10 backdrop-blur-md px-6 py-4 text-sm uppercase tracking-wide text-white shadow-lg shadow-black/20">
            &ldquo;Healthy, Educated, and Empowered Girls Build a Stronger Nation.&rdquo; — Tagline: &ldquo;Swasth, Shikshit aur Samarth Meri Beti.&rdquo;
          </div>
        </div>
      </section>

      {/* Focus Areas / We Provide */}
      {loadingFocusAreas ? (
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-white dark:bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-64 mx-auto mb-12" />
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : focusAreas.length > 0 && focusAreas[0] ? (
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-white dark:bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                  {focusAreas[0].heading}
                </span>
                <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70 shadow-sm" />
              </h2>
            </div>

            <div className="space-y-10 sm:space-y-12">
              {/* Paragraph 1 with Image 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="mb-4">
                    <div className="w-16 h-1 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-[1.8]">
                    {focusAreas[0].paragraph1}
                  </p>
                </div>
                {focusAreas[0].image1_url && (
                  <div className="order-1 md:order-2 relative w-full h-80 sm:h-96 md:h-[500px] lg:h-[550px] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={focusAreas[0].image1_url}
                      alt="Focus Area 1"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>

              {/* Paragraph 2 with Image 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2">
                  <div className="mb-4">
                    <div className="w-16 h-1 bg-primary rounded-full"></div>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-[1.8]">
                    {focusAreas[0].paragraph2}
                  </p>
                </div>
                {focusAreas[0].image2_url && (
                  <div className="order-1 relative w-full h-80 sm:h-96 md:h-[500px] lg:h-[550px] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={focusAreas[0].image2_url}
                      alt="Focus Area 2"
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>

              {/* Paragraphs 3 and 4 (no images) */}
              <div className="space-y-8 max-w-4xl mx-auto pt-6">
                <div className="relative pl-6 border-l-4 border-primary/30">
                  <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-[1.8]">
                    {focusAreas[0].paragraph3}
                  </p>
                </div>
                <div className="relative pl-6 border-l-4 border-primary/30">
                  <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-[1.8]">
                    {focusAreas[0].paragraph4}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Child-Related Initiatives Section */}
      {childInitiativesParagraph && childInitiativesParagraph.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                  Child-Related Initiatives
                </span>
                <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70 shadow-sm" />
              </h2>
            </div>

            <div className="space-y-6">
              {childInitiativesParagraph.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-primary text-xl mt-1">•</span>
                  <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed flex-1">
                    {paragraph.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Women Empowerment Vision Section */}
      {womenEmpowermentVision && womenEmpowermentVision.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                  Women Empowerment Vision
                </span>
                <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70 shadow-sm" />
              </h2>
            </div>

            <div className="space-y-6">
              {womenEmpowermentVision.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-primary text-xl mt-1">•</span>
                  <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed flex-1">
                    {paragraph.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Protection Initiatives Section */}
      {protectionInitiatives && protectionInitiatives.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                  Protection Initiatives
                </span>
                <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70 shadow-sm" />
              </h2>
            </div>

            <div className="space-y-6">
              {protectionInitiatives.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-primary text-xl mt-1">•</span>
                  <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed flex-1">
                    {paragraph.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA to Join the Mission Section */}
      {ctaJoinMission && ctaJoinMission.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
                  Join Our Mission
                </span>
                <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70 shadow-sm" />
              </h2>
            </div>

            <div className="space-y-6">
              {ctaJoinMission.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-primary text-xl mt-1">•</span>
                  <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed flex-1">
                    {paragraph.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section
        id="vision-cta"
        className="py-16 sm:py-20 text-center bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 transition-all duration-500 hover:from-orange-600 hover:to-orange-700 shadow-lg"
      >
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
          <span className="text-white">
            Stand With Rural Girls & Women
          </span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/80 shadow-sm" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto text-white/95 leading-relaxed">
          Your support fuels health camps, bridge classrooms, livelihood cohorts, and grievance redressal cells that keep daughters safe and thriving.
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

