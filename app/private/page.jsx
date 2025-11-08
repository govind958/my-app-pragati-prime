import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import BuyNowButton from "@/components/BuyNowButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button1"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Crown, Lock, ArrowRight, Sparkles, FileText } from "lucide-react"

export default async function MemberPage() {
  // Create a Supabase server client (reads cookies for auth)
  const supabase = await createClient()

  // 1️⃣ Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/login")
  }

  // 2️⃣ Fetch member profile from "members" table
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select(`
      *,
      profiles:profile_id (
        contact
      )
    `)
    .eq("profile_id", user.id)
    .single()

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, contact")
    .eq("id", user.id)
    .single()

  // 3️⃣ Handle missing member data
  if (memberError || !member) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome, {user.email}</CardTitle>
            <CardDescription>No membership record found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/register-membership">
                Complete your membership registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPremium = member.membership_type === "paid"
  const userName = profile?.name || user.email?.split("@")[0] || "Member"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // 4️⃣ Render beautiful member dashboard
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Welcome Header - At top on mobile, hidden on desktop (shown in main content) */}
        <div className="mb-6 lg:hidden">
          <Card className="bg-linear-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl md:text-3xl mb-2">
                    Welcome back, {userName}! 👋
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {isPremium 
                      ? "You have access to all premium content and features."
                      : "Explore our community and upgrade to unlock premium features."
                    }
                  </CardDescription>
                </div>
                {isPremium && (
                  <div className="hidden sm:block">
                    <Sparkles className="h-12 w-12 text-yellow-300" />
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Beautiful Sidebar */}
          <aside className="lg:col-span-3">
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{userName}</CardTitle>
                    <CardDescription className="truncate">{user.email}</CardDescription>
                  </div>
                </div>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Membership</span>
                    <Badge 
                      variant={isPremium ? "default" : "secondary"}
                      className={isPremium ? "bg-linear-to-r from-yellow-400 to-orange-500 text-white" : ""}
                    >
                      {isPremium ? (
                        <>
                          <Crown className="mr-1 h-3 w-3" />
                          Premium
                        </>
                      ) : (
                        "Free"
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member ID</span>
                    <span className="font-mono text-xs">{member.member_id}</span>
                  </div>
                </div>
                <Separator />
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/articles">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Articles
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/profile">
                      <FileText className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6">
            {/* Welcome Header - Hidden on mobile (shown at top), visible on desktop */}
            <Card className="hidden lg:block bg-linear-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl mb-2">
                      Welcome back, {userName}! 👋
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      {isPremium 
                        ? "You have access to all premium content and features."
                        : "Explore our community and upgrade to unlock premium features."
                      }
                    </CardDescription>
                  </div>
                  {isPremium && (
                    <div className="hidden md:block">
                      <Sparkles className="h-12 w-12 text-yellow-300" />
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Articles Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Articles & Content
                    </CardTitle>
                    <CardDescription>Browse free and premium content</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/articles">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Free Articles Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      Free Articles
                    </h3>
                    <Link 
                      href="/articles" 
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View all
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                      <Link href="/articles">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">All Community Posts</h4>
                              <p className="text-sm text-muted-foreground">
                                General updates, programs, and stories from our community
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">Free</Badge>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>
                </section>

                <Separator />

                {/* Premium Articles Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {isPremium ? (
                        <>
                          <Crown className="h-4 w-4 text-yellow-500" />
                          Premium Articles
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Premium Articles
                        </>
                      )}
                    </h3>
                    {isPremium && (
                      <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Included
                      </Badge>
                    )}
                  </div>

                  {isPremium ? (
                    <div className="grid gap-4">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-yellow-200 hover:border-yellow-400 bg-linear-to-br from-yellow-50 to-orange-50">
                        <Link href="/articles">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">Premium Insights</h4>
                                  <Crown className="h-4 w-4 text-yellow-600" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Exclusive reports and member-only analyses
                                </p>
                              </div>
                              <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white">
                                Premium
                              </Badge>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    </div>
                  ) : (
                    <Card className="border-2 border-yellow-200 bg-linear-to-br from-yellow-50 to-orange-50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-yellow-100 rounded-full">
                            <Lock className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                              Premium Content Locked
                              <Crown className="h-5 w-5 text-yellow-600" />
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Upgrade your membership to unlock all premium articles, exclusive insights, and member-only content.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <BuyNowButton
                                amount={499}
                                userDetails={{
                                  name: profile?.name || "",
                                  email: user.email || "",
                                  contact: profile?.contact || "",
                                }}
                              />
                              <Button variant="outline" asChild>
                                <Link href="/payment">
                                  Learn More
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile">
                      Go to Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Options</CardTitle>
                  <CardDescription>Upgrade or manage your subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/payment">
                      View Plans
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
