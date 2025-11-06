"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";

const TEAM_MEMBERS = [
  {
    name: "Aarav Sharma",
    role: "Founder & President",
    bio: "Leads strategy and partnerships, focusing on education access and policy advocacy.",
    image: "/team_image.png",
    links: { linkedin: "#" },
  },
  {
    name: "Neha Verma",
    role: "Program Director",
    bio: "Oversees program design and delivery across education and healthcare verticals.",
    image: "/logo.png",
    links: { linkedin: "#" },
  },
  {
    name: "Rahul Mehta",
    role: "Head of Community Development",
    bio: "Drives grassroots initiatives, building resilient community infrastructures.",
    image: "/logo.png",
    links: { linkedin: "#" },
  },
  {
    name: "Priya Iyer",
    role: "Women Empowerment Lead",
    bio: "Leads entrepreneurship, mentorship, and micro-loan programs for women.",
    image: "/logo.png",
    links: { linkedin: "#" },
  },
  {
    name: "Vikram Singh",
    role: "Health Initiatives Manager",
    bio: "Runs health camps, vaccination drives, and preventive care awareness.",
    image: "/logo.png",
    links: { linkedin: "#" },
  },
  {
    name: "Ananya Gupta",
    role: "Monitoring & Evaluation",
    bio: "Measures outcomes and ensures data-driven impact across all programs.",
    image: "/logo.png",
    links: { linkedin: "#" },
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home.png"
            alt="Our Core Team"
            fill
            sizes="100vw"
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">Our Core Team</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-800 dark:text-zinc-400">
            The people behind Pragati Prime&apos;s mission—leading programs, partnerships, and impact.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Meet the Team
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Card key={member.name} className="rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-56 w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6"
                  />
                </div>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.bio}</p>
                  <div className="mt-4 flex items-center gap-4">
                    {member.links?.linkedin && (
                      <Link
                        href={member.links.linkedin}
                        aria-label={`LinkedIn of ${member.name}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.06-1.865-3.06-1.868 0-2.154 1.459-2.154 2.968v5.696h-3v-10h2.881v1.367h.041c.401-.762 1.379-1.565 2.839-1.565 3.036 0 3.6 2.001 3.6 4.604v5.594z" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 sm:px-6">
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">Work With Us</span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
          Passionate about impact? Volunteer or join our programs to help drive change.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <AuthActionButton />
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-blue-600 hover:bg-white/10 w-full sm:w-auto"
            >
              Learn More About Us
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

