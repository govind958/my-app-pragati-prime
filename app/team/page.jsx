"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";

const TEAM_MEMBERS = [
  {
    name: "Aarav Sharma",
    role: "Founder & President",
    bio: "Leads strategy and partnerships, focusing on education access and policy advocacy.",
    image: "/logo1.jpeg",
    links: { linkedin: "#" },
  },
  {
    name: "Neha Verma",
    role: "Program Director",
    bio: "Oversees program design and delivery across education and healthcare verticals.",
    image: "/logo1.jpeg",
    links: { linkedin: "#" },
  },
  {
    name: "Rahul Mehta",
    role: "Head of Community Development",
    bio: "Drives grassroots initiatives, building resilient community infrastructures.",
    image: "/logo1.jpeg",
    links: { linkedin: "#" },
  },
  {
    name: "Priya Iyer",
    role: "Women Empowerment Lead",
    bio: "Leads entrepreneurship, mentorship, and micro-loan programs for women.",
    image: "/logo1.jpeg",
    links: { linkedin: "#" },
  },
  {
    name: "Vikram Singh",
    role: "Health Initiatives Manager",
    bio: "Runs health camps, vaccination drives, and preventive care awareness.",
    image: "/logo1.jpeg",
    links: { linkedin: "#" },
  },
  {
    name: "Ananya Gupta",
    role: "Monitoring & Evaluation",
    bio: "Measures outcomes and ensures data-driven impact across all programs.",
    image: "/logo1.jpeg",
    links: { linkedin: "#" },
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero */}
      <section
        id="team-hero"
        className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-32 sm:px-6 md:py-40 md:px-16"
      >
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
      <section
        id="meet-the-team"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
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

      {/* Volunteering Section */}
      <section
        id="volunteering"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Volunteering
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-8">
            <div>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Join our volunteer community and make a tangible difference in the lives of those we serve. 
                Whether you have a few hours a week or want to commit to a long-term project, your time and 
                skills can create lasting impact.
              </p>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Our volunteers are the backbone of Pragati Prime, bringing passion, expertise, and dedication 
                to every program we run. From teaching and mentoring to organizing events and supporting 
                administrative work, there&apos;s a role for everyone.
              </p>
            </div>
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Volunteer Opportunities</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Education: Teaching, tutoring, and curriculum development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Healthcare: Assisting in health camps and awareness programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Community Outreach: Field work and community engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Administrative: Data entry, communications, and event planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Skills Training: Sharing professional expertise and mentorship</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/login">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white"
              >
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Internship Section */}
      <section
        id="internship-program"
        className="py-16 sm:py-20 bg-zinc-100 dark:bg-zinc-900 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Internship Program
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-8">
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">What You&apos;ll Gain</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Hands-on experience in development work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Mentorship from experienced professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Networking opportunities with industry leaders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Certificate of completion and recommendation letters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Real-world project experience for your portfolio</span>
                </li>
              </ul>
            </Card>
            <div>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Our internship program offers students and recent graduates the opportunity to gain valuable 
                experience in the non-profit sector while contributing to meaningful social change. Interns 
                work alongside our team on real projects, learning about program management, community 
                engagement, and impact measurement.
              </p>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                We offer internships in various departments including program management, communications, 
                research and evaluation, fundraising, and field operations. Internships typically last 3-6 
                months and can be part-time or full-time based on your availability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl p-6 bg-white dark:bg-zinc-950">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Program Management</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Learn to design, implement, and monitor development programs
              </p>
            </Card>
            <Card className="rounded-2xl p-6 bg-white dark:bg-zinc-950">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Communications</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Develop content, manage social media, and tell impact stories
              </p>
            </Card>
            <Card className="rounded-2xl p-6 bg-white dark:bg-zinc-950">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Research & Evaluation</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Conduct research, analyze data, and measure program impact
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/login">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white"
              >
                Apply for Internship
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Partners Section */}
      <section
        id="corporate-partners"
        className="py-16 sm:py-20 bg-white dark:bg-zinc-950 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Corporate Partners
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="text-center mb-12">
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-8">
              Partner with Pragati Prime to create meaningful social impact while achieving your corporate 
              social responsibility goals. Together, we can build stronger communities and create lasting change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Partnership Benefits</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Enhanced brand reputation and visibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Employee engagement and team building opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Tax benefits and CSR compliance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Measurable social impact and reporting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Customized partnership programs</span>
                </li>
              </ul>
            </Card>

            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Partnership Models</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Financial sponsorship for specific programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>In-kind donations and resource sharing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Employee volunteering programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Skill-based pro bono services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Long-term strategic partnerships</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl p-6 text-center bg-zinc-50 dark:bg-zinc-900">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Corporate Partners</div>
            </Card>
            <Card className="rounded-2xl p-6 text-center bg-zinc-50 dark:bg-zinc-900">
              <div className="text-3xl font-bold text-primary mb-2">₹2Cr+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Partnership Value</div>
            </Card>
            <Card className="rounded-2xl p-6 text-center bg-zinc-50 dark:bg-zinc-900">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Employee Volunteers</div>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/about">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white"
              >
                Become a Corporate Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section
        id="careers"
        className="py-16 sm:py-20 bg-zinc-100 dark:bg-zinc-900 px-4 sm:px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="relative text-center mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Careers
            </span>
            <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-primary/70" />
          </h2>

          <div className="text-center mb-12">
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-8">
              Join our mission-driven team and help create lasting social impact. We&apos;re looking for 
              passionate individuals who are committed to making a difference in the communities we serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Why Work With Us?</h3>
              <ul className="space-y-4 text-base text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Meaningful Work:</strong> Every day, you&apos;ll contribute to programs that directly impact lives and communities.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Professional Growth:</strong> We invest in your development with training, mentorship, and career advancement opportunities.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Collaborative Culture:</strong> Work with a diverse, passionate team that values innovation and teamwork.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Work-Life Balance:</strong> We believe in sustainable work practices and support flexible arrangements.
                  </div>
                </li>
              </ul>
            </div>

            <Card className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Open Positions</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Program Manager</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Full-time • Remote/Hybrid</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Lead program design and implementation across education and healthcare verticals.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Community Outreach Coordinator</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Full-time • Field-based</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Build relationships with communities and coordinate grassroots initiatives.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Fundraising Manager</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Full-time • Hybrid</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Develop and execute fundraising strategies to support our programs.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Communications Specialist</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Full-time • Remote</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Create compelling content and manage our digital presence and storytelling.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
              Don&apos;t see a position that matches your skills? We&apos;re always looking for talented individuals. 
              Send us your resume and we&apos;ll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-white"
                >
                  View All Openings
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 border-2 border-primary text-primary hover:bg-primary/10"
                >
                  Submit General Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section
        id="team-cta"
        className="py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 sm:px-6"
      >
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

