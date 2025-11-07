"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";

// Keyframe simulation for a subtle entrance animation
// Note: In a real app, you'd use Framer Motion's `initial` and `animate`
// for this, but for pure Tailwind, we'll rely on transitions and transforms.
const EntranceAnimation = ({ children }) => (
  <div className="animate-fade-in-up">
    {children}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
     {/* Hero Section - ENHANCED for Modern UI/UX */}
<section className="relative flex flex-col items-center justify-center text-center 
                    min-h-[70vh] lg:min-h-screen 
                    py-28 px-4 sm:px-6 md:px-16 
                    overflow-hidden bg-zinc-950/90 dark:bg-black/90" // Stronger dark background
>
  {/* Background Image: Deeper Dark Overlay for Contrast */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/home.png"
      alt="Community empowerment in action"
      fill
      sizes="100vw"
      className="object-cover 
                 opacity-20 dark:opacity-10 
                 transition-transform duration-1000 ease-in-out 
                 hover:scale-105" // Image slightly scales on hover for subtle motion
      priority  
    />
  </div>

  <div className="relative z-10 px-4 sm:px-0 max-w-5xl">
    {/* Animated Text */}
    <EntranceAnimation>
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-tight tracking-tighter">
        <span className="bg-clip-text text-transparent 
                       bg-gradient-to-r from-primary/90 to-blue-300 
                         transition-colors duration-300 ease-in-out">
          Transforming Lives.
        </span>
        <span className="text-white dark:text-zinc-50 block mt-2">
          Become the Change Today.
        </span>
      </h1>
    </EntranceAnimation>
    
    <EntranceAnimation>
      <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl text-zinc-300 dark:text-zinc-400 mx-auto animate-delay-200">
        Be part of a movement that transforms lives through education, empowerment, and empathy.
      </p>
    </EntranceAnimation>

    {/* **IMPACT / CREDIBILITY ROW** */}
    <EntranceAnimation>
      <div className="mt-8 mb-10 text-center animate-delay-400">
          <p className="text-xl font-bold text-primary/80 tracking-wide uppercase">
              <span className="inline-block relative">
                10,000+ Lives Touched
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

      ---

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
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto px-4 sm:px-0">
            We strive to improve lives by supporting education, healthcare, and
            community development programs. Our dedicated team works closely
            with local communities to bring sustainable change and measurable
            impact.
          </p>
        </div>
      </section>

      ---

      {/* Key Impact Stories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Key Impact Stories
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          {/* Featured Story Cards - Added Hover and Transition */}
          {/* Story 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 mb-8 sm:mb-12 group transition-all duration-500 hover:bg-white/5 dark:hover:bg-black/5 p-4 rounded-xl">
            <div className="order-2 md:order-1 transition-transform duration-500 group-hover:translate-x-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
                Education for Every Child
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Providing scholarships and learning resources to underprivileged children. Our programs focus on
                access, mentoring, and long-term support so every child can stay in school and thrive.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/new-1.png"
                alt="Education for Every Child"
                width={800}
                height={500}
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
          {/* Story 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 mb-8 sm:mb-12 group transition-all duration-500 hover:bg-white/5 dark:hover:bg-black/5 p-4 rounded-xl">
            <div className="order-1 md:order-1">
              <Image
                src="/new-2.png"
                alt="Empowering Women Entrepreneurs"
                width={800}
                height={500}
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="order-2 md:order-2 transition-transform duration-500 group-hover:-translate-x-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
                Empowering Women Entrepreneurs
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Helping women start small businesses through training and micro-loans. We focus on
                financial literacy, market access, and mentorship to drive sustainable livelihoods.
              </p>
            </div>
          </div>
          {/* Story 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 mb-8 sm:mb-12 group transition-all duration-500 hover:bg-white/5 dark:hover:bg-black/5 p-4 rounded-xl">
            <div className="order-2 md:order-1 transition-transform duration-500 group-hover:translate-x-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
                Clean Water Initiative
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Building water wells and promoting hygiene awareness in rural areas. Cleaner water means
                healthier families and improved livelihoods across communities.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/new-3.png"
                alt="Clean Water Initiative"
                width={800}
                height={500}
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
          {/* This section of the original code was redundant and uses non-existent images, I am keeping it hidden for clean code */}
          {/* <div className="grid md:grid-cols-3 gap-8">...</div> */}
        </div>
      </section>

      ---

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Expanding Access to Education",
                desc: "Discover how our community-led education programs are transforming lives across rural areas. From scholarship initiatives to teacher training workshops, we're building sustainable educational ecosystems that empower children and families for generations to come.",
                href: "/articles/education-access",
              },
              {
                title: "Health Camps Impact Report",
                desc: "An in-depth analysis of our quarterly health camp initiatives. Learn about the thousands of lives touched through free medical checkups, vaccination drives, and health awareness programs that are making healthcare accessible to underserved communities.",
                href: "/articles/health-impact",
              },
              {
                title: "Women in Leadership",
                desc: "Celebrating the remarkable journeys of women entrepreneurs who've built successful businesses through our mentorship programs. These inspiring stories showcase how economic empowerment creates ripple effects throughout entire communities.",
                href: "/articles/women-leadership",
              },
            ].map((article, i) => (
              <Card 
                key={i} 
                className="rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:scale-[1.02] cursor-pointer"
              >
                <Link href={article.href}>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300 hover:text-primary">
                        {article.title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{article.desc}</p>
                      <span className="text-primary hover:underline transition-colors duration-300 hover:text-primary/70">Read more</span>
                    </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      ---

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
            <Link href="/updates" className="text-sm text-primary hover:underline self-start sm:self-auto transition-colors duration-300 hover:text-primary/70">View all</Link>
          </div>
          {/* Animated Update Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "New Community Center Opened",
                desc: "We inaugurated a new learning hub in Ward 11.",
              },
              {
                title: "Annual Fundraiser Launched",
                desc: "Support our 2025 education initiatives.",
              },
              {
                title: "Volunteer Drive This Month",
                desc: "Join outreach programs across neighborhoods.",
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

      ---

      {/* Membership CTA */}
      <section className="py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 sm:px-6 transition-all duration-500 hover:from-indigo-600 hover:to-blue-700">
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">
            Ready to Make a Difference?
          </span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">Become a part of our growing community of changemakers.</p>
        <Link href="/login">
          <Button 
            size="lg" 
            variant="secondary" 
            className="rounded-full bg-white text-blue-600 w-full sm:w-auto 
                       transition-all duration-300 
                       hover:bg-blue-100 hover:text-blue-800 hover:scale-105 
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