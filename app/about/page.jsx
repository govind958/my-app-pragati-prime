"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16">
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
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Story
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

      {/* Vision and Mission Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Vision Card */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Our Vision
                </h3>
                <div className="h-1 w-16 rounded-full bg-primary/70" />
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  To create a world where every individual has access to quality education, healthcare, and opportunities for personal and economic growth. We envision thriving communities where people are empowered to realize their full potential, breaking the cycle of poverty and inequality through sustainable development initiatives.
                </p>
              </CardContent>
            </Card>

            {/* Mission Card */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Our Mission
                </h3>
                <div className="h-1 w-16 rounded-full bg-primary/70" />
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  To improve lives by supporting education, healthcare, and community development programs. Our dedicated team works closely with local communities to bring sustainable change and measurable impact. We strive to empower individuals through education, enhance health outcomes, and build resilient communities that can thrive independently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Objectives
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Educational Access",
                description: "Provide scholarships, learning resources, and educational infrastructure to ensure every child has access to quality education regardless of their socioeconomic background.",
              },
              {
                title: "Healthcare Improvement",
                description: "Organize health camps, vaccination drives, and awareness programs to make healthcare accessible and affordable for underserved communities.",
              },
              {
                title: "Women Empowerment",
                description: "Support women entrepreneurs through training, micro-loans, and mentorship programs to promote economic independence and gender equality.",
              },
              {
                title: "Community Development",
                description: "Build sustainable infrastructure including water wells, community centers, and learning hubs that serve as foundations for long-term growth.",
              },
              {
                title: "Skill Development",
                description: "Offer vocational training and skill-building workshops to enhance employability and create pathways to sustainable livelihoods.",
              },
              {
                title: "Environmental Sustainability",
                description: "Promote environmental awareness and sustainable practices that protect natural resources while improving community resilience.",
              },
            ].map((objective, i) => (
              <Card key={i} className="rounded-2xl shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {objective.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {objective.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Our Impact Areas
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
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

      {/* Call to Action */}
      <section className="py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 sm:px-6">
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
          <Link href="/membership">
            <Button size="lg" variant="secondary" className="rounded-full bg-black text-white w-full sm:w-auto">
              Become a Member
            </Button>
          </Link>
          <Link href="/team">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-blue-600 hover:bg-white/10 w-full sm:w-auto"
            >
              Meet Our Team
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

