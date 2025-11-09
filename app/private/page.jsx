"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button1"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu, X, LogOut, LayoutDashboard, User, BookOpen, Crown, Lock, ArrowRight, CreditCard } from "lucide-react"
import BuyNowButton from "@/components/BuyNowButton"
import { sanitizeHTML, stripHTML } from "@/lib/htmlUtils"

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
          // Only allow navigation within dashboard or to logout
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
          .select("id, email, name, contact, role")
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
      // If user is premium, show all articles; otherwise, filter out paid articles
      let query = supabase
        .from("articles")
        .select("id, title, content, is_paid, published, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error("Error fetching articles:", error)
      } else {
        // Filter paid articles if user is not premium
        const filteredArticles = isPremium 
          ? data || []
          : (data || []).filter(article => !article.is_paid)
        setArticles(filteredArticles)
      }
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setLoading(false)
    }
  }, [isPremium])

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
    setLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          contact: formData.contact
        })
        .eq("id", user.id)

      if (error) throw error

      // Reload profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, email, name, contact, role")
        .eq("id", user.id)
        .single()

      setProfile(profileData)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile.")
    } finally {
      setLoading(false)
    }
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
            profile={profile} 
            user={user}
            selectedArticle={selectedArticle}
            onArticleSelect={setSelectedArticle}
          />
        )
      case "payment":
        return <PaymentSection profile={profile} user={user} isPremium={isPremium} />
      case "profile":
        return <ProfileSection profile={profile} user={user} onUpdate={handleProfileUpdate} loading={loading} />
      default:
        return <DashboardSection user={user} profile={profile} member={member} isPremium={isPremium} />
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r p-4 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-indigo-800">
            Member Dashboard
          </h1>
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
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                {userInitials}
              </div>
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

        <div className="mt-8 pt-4 border-t">
          <Button
            variant="destructive"
            className="w-full"
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
                Member dashboard — {section === "dashboard" ? "Welcome back!" : section === "articles" ? "Browse articles" : "Manage your profile"}
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
      <Card className="bg-linear-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            Welcome back, {profile?.name || user?.email?.split("@")[0] || "Member"}! 👋
          </CardTitle>
          <CardDescription className="text-blue-100">
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
            variant="outline" 
            className="h-auto py-4"
            onClick={() => switchSection("articles")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Articles
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4"
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
function ArticlesSection({ articles, isPremium, loading, profile, user, selectedArticle, onArticleSelect }) {
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
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onArticleSelect(article)}>
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
                  variant="outline" 
                  className="w-full"
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

      {!isPremium && (
        <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-yellow-600" />
              Unlock Premium Articles
            </CardTitle>
            <CardDescription>
              Upgrade to access exclusive premium content and member-only articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BuyNowButton
              amount={499}
              userDetails={{
                name: profile?.name || "",
                email: user?.email || "",
                contact: profile?.contact || "",
              }}
            />
          </CardContent>
        </Card>
      )}
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

      <Card className="max-w-4xl mx-auto">
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
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Articles
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Payment Section
function PaymentSection({ profile, user, isPremium }) {
  const userDetails = {
    name: profile?.name || "",
    email: user?.email || "",
    contact: profile?.contact || "",
  }

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">Payment Options</CardTitle>
        <CardDescription>
          Choose a membership plan to unlock premium features
        </CardDescription>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <CardDescription>Access limited articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-4xl font-bold">₹0</span>
              <span className="text-muted-foreground"> / year</span>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Limited article access
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Basic community features
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>
              {isPremium ? "Current Plan" : "Active"}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={isPremium ? "border-primary" : "border-blue-500"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <CardDescription>Unlock all premium content</CardDescription>
              </div>
              {!isPremium && (
                <Badge className="bg-blue-500">Popular</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-4xl font-bold">₹499</span>
              <span className="text-muted-foreground"> / year</span>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Unlimited article access
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Premium content access
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Exclusive member benefits
              </li>
            </ul>
            {isPremium ? (
              <Button variant="outline" className="w-full" disabled>
                <Crown className="mr-2 h-4 w-4" />
                Current Plan
              </Button>
            ) : (
              <BuyNowButton
                amount={499}
                userDetails={userDetails}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {isPremium && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-lg">Premium Active</CardTitle>
                <CardDescription>
                  You currently have an active premium membership. Thank you for your support!
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Profile Section
function ProfileSection({ profile, user, onUpdate, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  // Initialize form data when profile is available
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        contact: profile.contact || "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]) // Only update when profile ID changes

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    try {
      await onUpdate(formData)
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
                className="mt-1"
                placeholder="Enter your contact number"
              />
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
