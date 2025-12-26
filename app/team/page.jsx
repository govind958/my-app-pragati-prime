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
  const [bannerText, setBannerText] = useState({
    title: "",
    subtitle: "",
    description: ""
  });
  const [volunteerContent, setVolunteerContent] = useState({
    volunteer_info: { paragraph1: "", paragraph2: "" },
    volunteer_opportunities: [],
    internship_info: { paragraph1: "", paragraph2: "" },
    internship_opportunities: [],
    career_positions: []
  });

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
          .select("team_page_banner_image_url, banner_texts")
          .limit(1)
          .maybeSingle();

        if (data?.team_page_banner_image_url) {
          setBannerImage(data.team_page_banner_image_url);
        }

        // Extract banner text for team page
        if (data.banner_texts && Array.isArray(data.banner_texts)) {
          const teamBannerText = data.banner_texts.find(item => item.page === 'team');
          if (teamBannerText) {
            setBannerText({
              title: teamBannerText.title || "",
              subtitle: teamBannerText.subtitle || "",
              description: teamBannerText.description || ""
            });
          }
        }
      } catch (error) {
        console.error("Error loading team banner:", error);
      } finally {
        setBannerLoading(false);
      }
    };

    const fetchVolunteerContent = async () => {
      try {
        // Load volunteer content from site_settings (already migrated)
        const { data: volunteerData } = await supabase
          .from("site_settings")
          .select("volunteer_info, volunteer_opportunities")
          .limit(1)
          .maybeSingle();

        // Load internship content and career positions from team_page_content (new table)
        const { data: internshipData } = await supabase
          .from("team_page_content")
          .select("internship_info, internship_opportunities, career_positions")
          .eq("section", "content")
          .single();

        setVolunteerContent({
          volunteer_info: volunteerData?.volunteer_info || { paragraph1: "", paragraph2: "" },
          volunteer_opportunities: volunteerData?.volunteer_opportunities || [],
          internship_info: internshipData?.internship_info || { paragraph1: "", paragraph2: "" },
          internship_opportunities: internshipData?.internship_opportunities || [],
          career_positions: internshipData?.career_positions || []
        });
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };

    fetchTeamMembers();
    fetchBannerImage();
    fetchVolunteerContent();
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
          {bannerText.title && (
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold max-w-4xl leading-tight tracking-tighter">
              <span className="bg-clip-text text-transparent
                             bg-linear-to-r from-primary/90 to-orange-300
                               transition-colors duration-300 ease-in-out">
                {bannerText.title}
              </span>
              {bannerText.subtitle && (
                <span className="text-white dark:text-zinc-50 block mt-2">
                  {bannerText.subtitle}
                </span>
              )}
            </h1>
          )}
          {bannerText.description && (
            <p className="mt-6 sm:mt-8 max-w-3xl text-lg sm:text-xl text-zinc-300 dark:text-zinc-400 mx-auto">
              {bannerText.description}
            </p>
          )}
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
              {volunteerContent.volunteer_info.paragraph1 && (
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {volunteerContent.volunteer_info.paragraph1}
                </p>
              )}
              {volunteerContent.volunteer_info.paragraph2 && (
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {volunteerContent.volunteer_info.paragraph2}
                </p>
              )}
            </div>
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Volunteer Opportunities</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                {volunteerContent.volunteer_opportunities && volunteerContent.volunteer_opportunities.length > 0 ? (
                  volunteerContent.volunteer_opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>{opportunity.content}</span>
                    </li>
                  ))
                ) : (
                  <>
 
                  </>
                )}
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
            <div>
              {volunteerContent.internship_info.paragraph1 && (
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {volunteerContent.internship_info.paragraph1}
                </p>
              )}
              {volunteerContent.internship_info.paragraph2 && (
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {volunteerContent.internship_info.paragraph2}
                </p>
              )}
            </div>
            <Card className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">What You&apos;ll Gain</h3>
              <ul className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
                {volunteerContent.internship_opportunities && volunteerContent.internship_opportunities.length > 0 ? (
                  volunteerContent.internship_opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 mt-1">✓</span>
                      <span>{opportunity.content}</span>
                    </li>
                  ))
                ) : (
                  <>
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
                  </>
                )}
              </ul>
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

          <div className="max-w-2xl mx-auto mb-12">
            <Card className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-950">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Open Positions</h3>
              <div className="space-y-4">
                {volunteerContent.career_positions && volunteerContent.career_positions.length > 0 ? (
                  volunteerContent.career_positions.map((position, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{position.title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{position.type}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {position.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 dark:text-zinc-400">No open positions available at this time.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
              Don&apos;t see a role yet? Share how you can advance rural women’s health, education, or economic independence—we&apos;re always scouting aligned talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
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

