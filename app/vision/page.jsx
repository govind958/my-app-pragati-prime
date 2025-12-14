"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";

export default function Vision() {
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
        </div>
        <div className="relative z-10 px-4 sm:px-0 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-tight tracking-tighter">
            <span className="bg-clip-text text-transparent 
                           bg-linear-to-r from-primary/90 to-orange-300 
                             transition-colors duration-300 ease-in-out">
              Vision for Rural Girls & Women
            </span>
            <span className="text-white dark:text-zinc-50 block mt-2">
              Building a Stronger Nation Together
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl text-zinc-300 dark:text-zinc-400 mx-auto">
            A Western Uttar Pradesh and Delhi NCR where every girl is healthy, educated, and economically confident—and every woman can claim government entitlements, livelihoods, and her own voice.
          </p>
          <div className="mt-8 rounded-2xl border border-white/40 bg-white/10 backdrop-blur-sm px-6 py-4 text-sm uppercase tracking-wide text-white">
            &ldquo;Healthy, Educated, and Empowered Girls Build a Stronger Nation.&rdquo; — Tagline: &ldquo;Swasth, Shikshit aur Samarth Meri Beti.&rdquo;
          </div>
        </div>
      </section>

      {/* Vision Sections */}
      <section
        id="focus-areas"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Core Focus Areas
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="space-y-12 sm:space-y-16">
            {/* 1. Child Education */}
            <Card
              id="child-education"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 p-0 gap-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 ">
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-1">
                  <Image
                    src="/Growth.png"
                    alt="Child Education"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Education</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Child Education
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    Pragati Prime keeps rural daughters learning by pairing scholarships with bicycles, STEM clubs, and 
                    mentor didis who guide first-generation learners through board exams and beyond.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Scholarship programs for underprivileged children</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Access to quality learning materials and digital resources</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Teacher training and capacity building</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Safe learning environments and infrastructure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 2. Child Health and Nutrition */}
            <Card
              id="child-health"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 p-0 gap-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Health</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Child Health and Nutrition
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    Our health vans travel through Western Uttar Pradesh villages each month, screening girls for anemia, linking expectant mothers to schemes, and equipping families with nutrition and WASH knowledge.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Nutrition programs and meal support for children</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Regular health checkups and vaccination drives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Access to clean water and sanitation facilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Health education and awareness programs</span>
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-2">
                  <Image
                    src="/Food.png"
                    alt="Child Health and Nutrition"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              </div>
            </Card>

            {/* 3. Stop Child Labour */}
            <Card
              id="stop-child-labour"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 p-0 gap-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-1">
                  <Image
                    src="/ChildLabour.png"
                    alt="Stop Child Labour"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Protection</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Stop Child Labour
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    By combining livelihood support for parents with village protection committees, we keep girls out of brick kilns and back into classrooms, while paralegal teams handle rescue and rehabilitation.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Rescue and rehabilitation of child labourers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Economic support for families to prevent child labour</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Community awareness and advocacy programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Legal support and policy advocacy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 4. Support Girl Child */}
            <Card
              id="support-girl-child"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 p-0 gap-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wide">Empowerment</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Support Girl Child
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    Leadership labs, sports fellowships, and peer-led support circles help adolescent girls negotiate safer homes, access government stipends, and step into community decision-making.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Scholarships and educational support specifically for girls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Mentorship programs and leadership development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Safe spaces and support networks for girls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Advocacy for girls&apos; rights and equal opportunities</span>
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-2">
                  <Image
                    src="/GirlChild.png"
                    alt="Support Girl Child"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              </div>
            </Card>

            {/* 5. Stop Child Marriage */}
            <Card
              id="stop-child-marriage"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 p-0 gap-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-1">
                  <Image
                    src="/ChildMarriage.png"
                    alt="Stop Child Marriage"
                    fill
                    className="object-fill"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Protection</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Stop Child Marriage
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    Our rapid response collectives track high-risk cases, engage village leaders, and offer bridge education so girls can delay marriage, graduate, and pursue livelihoods on their terms.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Community awareness campaigns against child marriage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Support and counseling for at-risk children and families</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Legal intervention and protection services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Education and economic opportunities to prevent child marriage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 6. Women Health and Empowerment */}
            <Card
              id="women-health-empowerment"
              className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 p-0 gap-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Empowerment</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Women Health and Empowerment
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    CSR-backed micro-loan pools, digital finance bootcamps, and referral partnerships with hospitals ensure rural women can protect their health, launch enterprises, and reinvest in their daughters.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Comprehensive healthcare services for women</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Entrepreneurship training and micro-loan programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Skill development and vocational training</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>Leadership development and mentorship programs</span>
                    </li>
                  </ul>
                </div>
                <div className="relative h-64 md:h-auto min-h-[300px] order-1 md:order-2">
                  <Image
                    src="/WomenEmpowerment.png"
                    alt="Women Health and Empowerment"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="vision-cta"
        className="py-16 sm:py-20 text-center bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 transition-all duration-500 hover:from-orange-600 hover:to-orange-700"
      >
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">
            Stand With Rural Girls & Women
          </span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
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

