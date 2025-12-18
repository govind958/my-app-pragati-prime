"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button1"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu, X, LogOut, LayoutDashboard, User, BookOpen, Crown, ArrowRight, CreditCard, Upload } from "lucide-react"
import BuyNowButton from "@/components/BuyNowButton"
import { sanitizeHTML, stripHTML } from "@/lib/htmlUtils"
import Footer from "@/components/Footer"

const supabase = createClient()

export default function MemberDashboard() {
  const router = useRouter()
  const [section, setSection] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [member, setMember] = useState(null)
  const [articles, setArticles] = useState([])
  const [isPremium, setIsPremium] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Block navigation away from dashboard
  useEffect(() => {
    // Intercept link clicks
    const handleClick = (e) => {
      const target = e.target.closest("a")
      if (target && target.href) {
        try {
          const url = new URL(target.href)
          const currentOrigin = window.location.origin
          
          // Allow external links (different origin)
          if (url.origin !== currentOrigin) {
            return true // Allow external links (social media, etc.)
          }
          
          // Allow links with target="_blank" (external links)
          if (target.target === "_blank") {
            return true // Allow external links
          }
          
          // Allow links within footer
          const isInFooter = target.closest("footer")
          if (isInFooter) {
            return true // Allow footer links
          }
          
          // Allow navigation within dashboard or to logout
          if (!url.pathname.startsWith("/private") && !url.pathname.startsWith("/logout")) {
            e.preventDefault()
            e.stopPropagation()
            // Optionally show a message
            return false
          }
        } catch {
          // Invalid URL, allow default behavior
        }
      }
    }

    // Intercept browser navigation
    const handlePopState = () => {
      if (!window.location.pathname.startsWith("/private")) {
        window.history.pushState(null, "", "/private")
        router.replace("/private")
      }
    }

    // Prevent navigation via router
    const originalPush = router.push
    router.push = (href, options) => {
      if (typeof href === "string" && !href.startsWith("/private") && !href.startsWith("/logout")) {
        console.log("Navigation blocked: Dashboard users must stay on dashboard")
        return Promise.resolve(false)
      }
      return originalPush.call(router, href, options)
    }

    document.addEventListener("click", handleClick, true)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleClick, true)
      window.removeEventListener("popstate", handlePopState)
      router.push = originalPush // Restore original
    }
  }, [router])

  // Fetch user data and check authentication
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          router.push("/login")
          return
        }

        setUser(authUser)

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, email, name, contact, role, profile_image_url")
          .eq("id", authUser.id)
          .single()
        
        setProfile(profileData)

        // Fetch member data
        const { data: memberData } = await supabase
          .from("members")
          .select("*")
          .eq("profile_id", authUser.id)
          .single()

        if (memberData) {
          setMember(memberData)
          setIsPremium(memberData.membership_type === "paid")
        } else {
          // Not a member, redirect to registration
          router.push("/register-membership")
          return
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const loadArticles = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch published articles
      // If user is premium, show only articles allowed for their plan; otherwise, filter out paid articles
      let query = supabase
        .from("articles")
        .select("id, title, content, is_paid, published, created_at, image_url, required_plan_name")
        .eq("published", true)
        .order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error("Error fetching articles:", error)
      } else {
        let filteredArticles = data || []

        // helper to check plan hierarchy
        const canAccessForPlan = (memberPlan, requiredPlan) => {
          if (!requiredPlan) return true // any paid member
          if (!memberPlan) return false

          const order = {
            "Active Member": 1,
            "Executive Member": 2,
            "CSR Member": 3,
          }

          const memberLevel = order[memberPlan] || 0
          const requiredLevel = order[requiredPlan] || 0

          // higher or equal tier can see lower-tier content
          return memberLevel >= requiredLevel
        }

        if (!isPremium) {
          // Non‑paid members see only free articles
          filteredArticles = filteredArticles.filter(article => !article.is_paid)
        } else {
          // Paid members: respect required_plan_name with hierarchy
          let planName = null
          if (member?.plan_id) {
            const { data: planData, error: planError } = await supabase
              .from("membership_plans")
              .select("name")
              .eq("id", member.plan_id)
              .maybeSingle()

            if (!planError) {
              planName = planData?.name || null
            }
          }

          filteredArticles = filteredArticles.filter(article => {
            if (!article.is_paid) return true
            return canAccessForPlan(planName, article.required_plan_name)
          })
        }
        setArticles(filteredArticles)
      }
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setLoading(false)
    }
  }, [isPremium, member])

  useEffect(() => {
    if (section === "articles" && member) {
      loadArticles()
    }
  }, [section, member, loadArticles])

  const switchSection = useCallback((sec) => {
    setSection(sec)
    setSidebarOpen(false)
    setSelectedArticle(null) // Clear selected article when switching sections
    if (sec === "articles") {
      loadArticles()
    }
  }, [loadArticles])

  const handleProfileUpdate = async (formData) => {
    // Do not toggle global `loading` here to avoid layout shifts in the dashboard.
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        contact: formData.contact,
        address: formData.address || null,
        occupation: formData.occupation || null,
        description: formData.description || null,
      })
      .eq("id", user.id)

    if (error) throw error

    // Reload profile with extended fields
    const { data: profileData, error: reloadError } = await supabase
      .from("profiles")
      .select("id, email, name, contact, role, profile_image_url, address, occupation, description")
      .eq("id", user.id)
      .single()

    if (reloadError) throw reloadError

    setProfile(profileData)
  }

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <DashboardSection user={user} profile={profile} member={member} isPremium={isPremium} switchSection={switchSection} />
      case "articles":
        return (
          <ArticlesSection 
            articles={articles} 
            isPremium={isPremium} 
            loading={loading} 
            selectedArticle={selectedArticle}
            onArticleSelect={setSelectedArticle}
          />
        )
      case "payment":
        return <PaymentSection profile={profile} user={user} member={member} isPremium={isPremium} />
      case "profile":
        return <ProfileSection profile={profile} user={user} onUpdate={handleProfileUpdate} supabase={supabase} />
      default:
        return <DashboardSection user={user} profile={profile} member={member} isPremium={isPremium} />
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const userName = profile?.name || user?.email?.split("@")[0] || "Member"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex relative flex-1 h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col h-screen`}
        >
        <div className="p-4 overflow-y-auto flex-1 min-h-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo1.jpeg" 
                alt="Pragati Prime Logo" 
                width={32} 
                height={32} 
                className="rounded-full object-contain"
              />
              <h1 className="text-xl font-semibold text-primary">
                Member Dashboard
              </h1>
            </div>
            <Button
              onClick={() => setSidebarOpen(false)}
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* User Info */}
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                {profile?.profile_image_url ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                    <Image
                      src={profile.profile_image_url}
                      alt={userName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {userInitials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{userName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Badge variant={isPremium ? "default" : "secondary"} className="w-full justify-center">
                {isPremium ? (
                  <>
                    <Crown className="mr-1 h-3 w-3" />
                    Premium Member
                  </>
                ) : (
                  "Free Member"
                )}
              </Badge>
            </CardContent>
          </Card>

          <nav className="space-y-2">
            <NavButton
              active={section === "dashboard"}
              onClick={() => switchSection("dashboard")}
              icon={LayoutDashboard}
            >
              Dashboard
            </NavButton>
            <NavButton
              active={section === "articles"}
              onClick={() => switchSection("articles")}
              icon={BookOpen}
            >
              Articles
            </NavButton>
            <NavButton
              active={section === "payment"}
              onClick={() => switchSection("payment")}
              icon={CreditCard}
            >
              Payment
            </NavButton>
            <NavButton
              active={section === "profile"}
              onClick={() => switchSection("profile")}
              icon={User}
            >
              Profile
            </NavButton>
          </nav>
        </div>

        <div className="p-4 pt-4 border-t mt-auto shrink-0">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = "/"
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:w-auto">
        <header className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
               {section === "dashboard" ? "" : section === "articles" ? "" : ""}
              </p>
            </div>
          </div>
        </header>

        <Card className="min-h-[70vh]">
          <CardContent className="p-4 md:p-6">
            {loading && section !== "dashboard" ? (
              <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
              </div>
            ) : (
              renderSection()
            )}
          </CardContent>
        </Card>
      </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Nav Button Component
function NavButton({ children, active, onClick, icon: Icon }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Button>
  )
}

// Dashboard Section
function DashboardSection({ user, profile, member, isPremium, switchSection }) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-linear-to-r from-orange-500 to-orange-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            Welcome back, {profile?.name || user?.email?.split("@")[0] || "Member"}! 👋
          </CardTitle>
          <CardDescription className="text-orange-100">
            {isPremium
              ? "You have access to all premium content and features."
              : "Explore our community and upgrade to unlock premium features."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <CardDescription className="mb-2">Membership Status</CardDescription>
            <CardTitle className="text-2xl">
              {isPremium ? "Premium" : "Free"}
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CardDescription className="mb-2">Member ID</CardDescription>
            <CardTitle className="text-lg font-mono">
              {member?.member_id || "N/A"}
            </CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CardDescription className="mb-2">Contact</CardDescription>
            <CardTitle className="text-lg">
              {profile?.contact || "Not set"}
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            className="h-auto py-4 bg-primary hover:bg-primary/90 text-white"
            onClick={() => switchSection("articles")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Articles
          </Button>
          <Button 
            className="h-auto py-4 bg-primary hover:bg-primary/90 text-white"
            onClick={() => switchSection("payment")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isPremium ? "View Payment" : "Upgrade to Premium"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Articles Section
function ArticlesSection({ articles, isPremium, loading, selectedArticle, onArticleSelect }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    )
  }

  // If an article is selected, show the article view
  if (selectedArticle) {
    return <ArticleView article={selectedArticle} onBack={() => onArticleSelect(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg mb-2">Articles ({articles.length})</CardTitle>
          <CardDescription>
            {isPremium
              ? "Browse all free and premium articles"
              : "Free articles available. Upgrade to access premium content."}
          </CardDescription>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden" onClick={() => onArticleSelect(article)}>
              {/* Article Image */}
              {article.image_url && (
                <div className="relative h-48 w-full mt-[-25px] bg-gray-100 overflow-hidden">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={article.is_paid ? "default" : "secondary"}>
                    {article.is_paid ? (
                      <>
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </>
                    ) : (
                      "Free"
                    )}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {stripHTML(article.content)?.substring(0, 150) || "No content available"}
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onArticleSelect(article)
                  }}
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Premium upsell card removed per request */}
    </div>
  )
}

// Article View Component
function ArticleView({ article, onBack }) {
  // Sanitize HTML content - useMemo ensures it's computed on client side
  const sanitizedContent = useMemo(() => {
    if (!article || !article.content) {
      return "<p>This article has no content.</p>"
    }
    // sanitizeHTML handles SSR properly - returns HTML on server, sanitizes on client
    return sanitizeHTML(article.content) || "<p>This article has no content.</p>"
  }, [article])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          Back to Articles
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden">
        {/* Article Image */}
        {article.image_url && (
          <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-100">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <Badge variant={article.is_paid ? "default" : "secondary"} className="text-sm">
              {article.is_paid ? (
                <>
                  <Crown className="mr-1 h-3 w-3" />
                  Premium Article
                </>
              ) : (
                "Free Article"
              )}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(article.created_at).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <CardTitle className="text-2xl md:text-3xl lg:text-4xl leading-tight">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert article-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </CardContent>
        <CardFooter className="pt-6 border-t">
          <Button onClick={onBack} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Articles
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Payment Section
function PaymentSection({ profile, user, member, isPremium }) {
  const userDetails = {
    name: profile?.name || "",
    email: user?.email || "",
    contact: profile?.contact || "",
  }

  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data, error } = await supabase
          .from("membership_plans")
          .select("id, name, price, billing_cycle")
          .order("price", { ascending: true })

        if (error) {
          console.error("Error loading membership plans:", error)
        } else {
          setPlans(data || [])
        }
      } catch (err) {
        console.error("Unexpected error loading membership plans:", err)
      } finally {
        setLoadingPlans(false)
      }
    }

    loadPlans()
  }, [])

  const getPlanFeatures = (name) => {
    switch (name) {
      case "Active Member":
        return [
          "Access to member dashboard and community updates",
          "Read selected members-only articles",
          "Basic participation in events and programs",
        ]
      case "Executive Member":
        return [
          "All Active Member benefits",
          "Full access to premium articles and resources",
          "Priority invites to trainings and field visits",
        ]
      case "CSR Member":
        return [
          "All Executive Member benefits",
          "Dedicated CSR coordination and reporting",
          "Co-branded initiatives and visibility",
        ]
      default:
        return [
          "Access to member dashboard",
          "Members-only updates and content",
        ]
    }
  }

  const currentPlanId = member?.plan_id || null

  return (
    <div className="space-y-6">
      <div>
        <CardDescription>
          Choose a membership plan to unlock premium features
        </CardDescription>
        {isPremium && (
          <p className="mt-2 text-sm text-green-600">
            You already have an active paid membership.
          </p>
        )}
      </div>

      {loadingPlans ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-transparent border-t-orange-500 mx-auto" />
            <p className="mt-3 text-sm text-gray-600">Loading plans...</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const features = getPlanFeatures(plan.name)
            const isPopular = plan.name === "Executive Member"
            const isCurrent = currentPlanId && currentPlanId === plan.id

            return (
              <Card
                key={plan.id}
                className={isPopular ? "border-primary shadow-lg" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>
                        {plan.name === "Active Member" && "Best for individuals starting their journey"}
                        {plan.name === "Executive Member" && "For engaged supporters and leaders"}
                        {plan.name === "CSR Member" && "Ideal for corporate & institutional partners"}
                      </CardDescription>
                    </div>
                    {isPopular && !isPremium && (
                      <Badge className="bg-primary">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {plan.billing_cycle || "year"}
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Crown className="mr-2 h-4 w-4" />
                      Current Member
                    </Button>
                  ) : (
                    <BuyNowButton
                      amount={Number(plan.price)}
                      userDetails={userDetails}
                      planId={plan.id}
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Profile Section
function ProfileSection({ profile, user, onUpdate, supabase }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    occupation: "",
    description: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState(profile?.profile_image_url || "")

  // Initialize form data when profile is available
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        contact: profile.contact || "",
        address: profile.address || "",
        occupation: profile.occupation || "",
        description: profile.description || "",
      })
      setProfileImageUrl(profile.profile_image_url || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]) // Only update when profile ID changes

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `profile-${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("profile_image")
        .upload(filePath, file, {
          upsert: true // Replace if exists
        })

      if (uploadError) {
        console.error("Image upload failed:", uploadError)
        alert("Image upload failed. Please try again.")
        setUploadingImage(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from("profile_image")
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        setProfileImageUrl(urlData.publicUrl)
        // Update profile with new image URL
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ profile_image_url: urlData.publicUrl })
          .eq("id", user.id)

        if (updateError) {
          console.error("Error updating profile image:", updateError)
          alert("Image uploaded but failed to update profile. Please refresh the page.")
        } else {
          alert("Profile image uploaded successfully!")
          // Reload the page to show the new image
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    try {
      setSaving(true)
      await onUpdate(formData)
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">Profile Information</CardTitle>
        <CardDescription>View and update your personal information</CardDescription>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <Label>Profile Picture</Label>
              <div className="mt-2 flex items-center gap-4">
                {profileImageUrl ? (
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-2xl">
                    {(profile?.name || user?.email?.split("@")[0] || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('profile-image-upload')?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImage ? "Uploading..." : profileImageUrl ? "Change Image" : "Upload Image"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Upload a profile picture (JPG, PNG, etc.)</p>
                </div>
              </div>
            </div>

            {/* Main details in responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="mt-1 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="contact">Phone Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="mt-1"
                  placeholder="Enter your occupation"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1"
                  placeholder="Enter your full address"
                />
              </div>
            </div>

            {/* Description full width */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Tell us about yourself (up to 10 lines)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This short bio helps us understand you better.
              </p>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-white">
              {saving ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
