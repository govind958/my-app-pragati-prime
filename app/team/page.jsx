"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button1";
import Footer from "@/components/Footer";
import AuthActionButton from "@/components/ui/AuthActionButton";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState("");
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("core_team")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading team members:", error);
          // Fallback to empty array if error
          setTeamMembers([]);
        } else {
          setTeamMembers(data || []);
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchBannerImage = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("team_page_banner_image_url")
          .limit(1)
          .maybeSingle();
        
        if (data?.team_page_banner_image_url) {
          setBannerImage(data.team_page_banner_image_url);
        }
      } catch (error) {
        console.error("Error loading team banner:", error);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchTeamMembers();
    fetchBannerImage();
  }, []);
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Hero */}
      <section
        id="team-hero"
        className="relative flex flex-col items-center justify-center text-center 
                    min-h-[50vh] 
                    py-20 px-4 sm:px-6 md:px-16 
                    overflow-hidden bg-zinc-950/90 dark:bg-black/90"
      >
        {/* Background Image: Deeper Dark Overlay for Contrast */}
        <div className="absolute inset-0 z-0">
          {bannerLoading ? (
            <div className="w-full h-full bg-zinc-900 animate-pulse" />
          ) : bannerImage ? (
            <Image
              src={bannerImage}
              alt="Our Core Team"
              fill
              sizes="100vw"
              className="object-cover 
                       opacity-20 dark:opacity-10 
                       transition-transform duration-1000 ease-in-out 
                       hover:scale-105"
              priority
            />
          ) : null}
        </div>
        <div className="relative z-10 px-4 sm:px-0 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-tight tracking-tighter">
            <span className="bg-clip-text text-transparent 
                           bg-linear-to-r from-primary/90 to-orange-300 
                             transition-colors duration-300 ease-in-out">
              People Powering Meri Beti Mission
            </span>
            <span className="text-white dark:text-zinc-50 block mt-2">
              Meet Our Dedicated Team
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl text-zinc-300 dark:text-zinc-400 mx-auto">
            Meet the Pragati Prime leaders partnering with rural women and girls to deliver health camps, bridge education, and income pathways across Western Uttar Pradesh and Delhi.
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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {teamMembers.map((member) => {
                const links = typeof member.links === "string" 
                  ? JSON.parse(member.links || "{}") 
                  : (member.links || {});
                
                return (
                  <Card key={member.id} className="rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-56 w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                        src={member.image || "/logo1.jpeg"}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6"
                  />
                </div>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
                      {member.role && (
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                      )}
                </CardHeader>
                <CardContent>
                      {member.bio && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.bio}</p>
                      )}
                  <div className="mt-4 flex items-center gap-4">
                        {links?.linkedin && (
                      <Link
                            href={links.linkedin}
                        aria-label={`LinkedIn of ${member.name}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.06-1.865-3.06-1.868 0-2.154 1.459-2.154 2.968v5.696h-3v-10h2.881v1.367h.041c.401-.762 1.379-1.565 2.839-1.565 3.036 0 3.6 2.001 3.6 4.604v5.594z" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">No team members found. Check back soon!</p>
          </div>
          )}
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
                Volunteer with us to host health camps, mentor adolescent girls, and help families enroll in government schemes—the support that keeps rural daughters safe in school.
              </p>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Whether you can translate awareness materials into Hindi, teach digital literacy, or document impact stories, your skills strengthen the Meri Beti Mera Abhiman movement.
              </p>
            </div>
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Volunteer Opportunities</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Education bridges: Mentor board exam cohorts, run STEM clubs, or help with scholarship paperwork</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Healthcare camps: Support screenings, menstrual health workshops, and referral follow-ups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Community outreach: Map high-risk villages, collect beneficiary stories, and spread scheme awareness</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Digital ops: Manage case-tracking dashboards, WhatsApp helplines, and donor updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Skills training: Coach women entrepreneurs on pricing, packaging, and online marketplaces</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/#contact-form">
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
                Interns co-create field toolkits, visualize impact data, and shadow frontline teams as they connect rural households to health, education, and financial services.
              </p>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Roles span program design, storytelling, fundraising, and research; most last 12-24 weeks with hybrid options from Delhi NCR plus immersive village visits.
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
                Learn to design, implement, and monitor women-centered development cohorts
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
                Craft bilingual storytelling that spotlights rural girls’ progress
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
                Conduct research, analyze gendered data, and measure program impact
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/#contact-form">
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
              Partner with Pragati Prime to channel CSR capital into rural health, education, and livelihood pipelines for women and girls—complete with transparent reporting and on-ground visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Partnership Benefits</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Enhanced brand reputation with community-first women empowerment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Employee engagement through experiential village immersions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Tax benefits and CSR compliance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Measurable, gender-disaggregated impact dashboards</span>
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
                  <span>Financial sponsorship for health, education, or livelihood cohorts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>In-kind donations and resource sharing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span>Employee volunteering programs focused on mentoring girls</span>
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
            <Link href="/#contact-form">
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
              We&apos;re hiring builders who believe rural girls deserve equitable healthcare, classrooms, and careers. If you can blend community empathy with execution rigor, we want you on the Meri Beti mission.
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
                    <strong className="text-zinc-900 dark:text-zinc-100">Meaningful Work:</strong> Design and scale programs that keep thousands of girls in school and women in business.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Professional Growth:</strong> Receive mentorship from experts in gender, public health, and impact finance.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Collaborative Culture:</strong> Co-create with field leaders, SHG federations, and youth volunteers.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Work-Life Balance:</strong> Flexible, purpose-driven schedules with periodic village immersions.
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
              Don&apos;t see a role yet? Share how you can advance rural women’s health, education, or economic independence—we&apos;re always scouting aligned talent.
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
              <Link href="/#contact-form">
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
        className="py-16 sm:py-20 text-center bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 transition-all duration-500 hover:from-orange-600 hover:to-orange-700"
      >
        <h2 className="relative text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="text-white">Keep Rural Daughters Thriving</span>
          <span className="mt-3 block h-1 w-16 sm:w-24 mx-auto rounded-full bg-white/70" />
        </h2>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
          Volunteer, apply, or partner with Pragati Prime – Meri Beti Mera Abhiman Mahila Sangathan and help deliver health, education, and livelihood pathways to women and girls who need them most.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <AuthActionButton />
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-orange-600 hover:bg-white/10 w-full sm:w-auto"
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

