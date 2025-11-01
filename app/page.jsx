"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40 dark:opacity-30"
            priority  
          />
        </div>
        <div className="relative z-10 px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl leading-tight">
          <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Empowering Communities
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {" "}for a Better Tomorrow
          </span>
        </h1>
        <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-zinc-800 dark:text-zinc-400 mx-auto">
          Be part of a movement that transforms lives through education, empowerment, and empathy.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <Link href="/login">
            <Button size="lg" className="rounded-full w-full sm:w-auto">
              Become a Member
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-zinc-300 dark:border-zinc-700 w-full sm:w-auto"
            >
              Learn More
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
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto px-4 sm:px-0">
            We strive to improve lives by supporting education, healthcare, and
            community development programs. Our dedicated team works closely
            with local communities to bring sustainable change and measurable
            impact.
          </p>
        </div>
      </section>

      {/* Key Impact Stories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Key Impact Stories
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>
          {/* Featured Story: text left, image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="order-2 md:order-1">
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
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl"
                priority
              />
            </div>
          </div>
          {/* Second Featured Story: image left, text right */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="order-1 md:order-1">
              <Image
                src="/new-2.png"
                alt="Empowering Women Entrepreneurs"
                width={800}
                height={500}
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
            <div className="order-2 md:order-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
                Empowering Women Entrepreneurs
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Helping women start small businesses through training and micro-loans. We focus on
                financial literacy, market access, and mentorship to drive sustainable livelihoods.
              </p>
            </div>
          </div>
          {/* Third Featured Story: text left, image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="order-2 md:order-1">
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
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {([
              {
                title: "Education for Every Child",
                img: "/images/impact-1.jpg",
                desc: "Providing scholarships and learning resources to underprivileged children.",
              },
              {
                title: "Empowering Women Entrepreneurs",
                img: "/images/impact-2.jpg",
                desc: "Helping women start small businesses through training and micro-loans.",
              },
              {
                title: "Clean Water Initiative",
                img: "/images/impact-3.jpg",
                desc: "Building water wells and promoting hygiene awareness in rural areas.",
              },
            ]).slice(3).map((story, i) => (
              <Card key={i} className="overflow-hidden rounded-2xl border-none shadow-lg">
                <Image
                  src={story.img}
                  alt={story.title}
                  width={500}
                  height={300}
                  className="w-full h-56 object-cover"
                />
                <CardHeader>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {story.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">{story.desc}</p>
                </CardContent>
              </Card>
            ))}
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
            <Link href="/articles" className="text-sm text-primary hover:underline self-start sm:self-auto">View all</Link>
          </div>
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
              <Card key={i} className="rounded-2xl">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {article.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">{article.desc}</p>
                  <Link href={article.href} className="text-primary hover:underline">Read more</Link>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <Link href="/updates" className="text-sm text-primary hover:underline self-start sm:self-auto">View all</Link>
          </div>
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
              <Card key={i} className="rounded-2xl">
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

      {/* Membership CTA */}
      <section className="py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 sm:px-6">
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">
            Ready to Make a Difference?
          </span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">Become a part of our growing community of changemakers.</p>
        <Link href="/login">
          <Button size="lg" variant="secondary" className="rounded-full bg-white text-blue-600 w-full sm:w-auto">
            Join Now
          </Button>
        </Link>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}


