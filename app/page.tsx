"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 md:px-16">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/ngo-hero.jpg"
            alt="NGO Impact Banner"
            fill
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 max-w-3xl leading-tight">
          Empowering Communities for a Better Tomorrow
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-700 dark:text-zinc-400">
          Join us in our mission to create sustainable impact through education,
          empowerment, and empathy.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/membership">
            <Button size="lg" className="rounded-full">
              Become a Member
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-zinc-300 dark:border-zinc-700"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Impact / About Preview */}
      <section className="py-20 bg-white dark:bg-zinc-950 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8">
            Our Mission
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            We strive to improve lives by supporting education, healthcare, and
            community development programs. Our dedicated team works closely
            with local communities to bring sustainable change and measurable
            impact.
          </p>
        </div>
      </section>

      {/* Key Impact Stories */}
      <section className="py-20 px-6 md:px-16 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 text-center mb-12">
            Key Impact Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((story, i) => (
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

      {/* CTA Section */}
      <section className="py-20 text-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="mb-8 text-lg">
          Become a part of our growing community of changemakers.
        </p>
        <Link href="/membership">
          <Button size="lg" variant="secondary" className="rounded-full bg-white text-blue-600">
            Join Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
