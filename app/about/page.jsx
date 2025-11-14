"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";


export default function About() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">

      {/* Hero Section */}
      <section
        id="about-hero"
        className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.png"
            alt="About Pragati Prime"
            fill
            sizes="100vw"
            className="object-cover opacity-40 dark:opacity-30"
            priority  
          />
        </div>
        <div className="relative z-10 px-4 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              About Pragati Prime
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-zinc-800 dark:text-zinc-400 mx-auto">
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
            <div>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-4">
                Pragati Prime is a non-governmental organization dedicated to creating lasting positive change in communities across the region. Founded with a vision to bridge the gap between underserved populations and essential resources, we work tirelessly to empower individuals and transform communities.
              </p>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-4">
                Our journey began with a simple belief: that every individual deserves access to quality education, healthcare, and opportunities for growth. Over the years, we have developed comprehensive programs that address the root causes of poverty and inequality, focusing on sustainable solutions that create ripple effects throughout communities.
              </p>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
                Through collaboration with local communities, government agencies, and international partners, Pragati Prime has established itself as a trusted catalyst for social change, touching thousands of lives and building a foundation for a brighter future.
              </p>
            </div>
            <div className="relative h-64 sm:h-80 md:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src="/team_image.png"
                alt="Pragati Prime Team"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
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
        className="py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 sm:px-6"
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

