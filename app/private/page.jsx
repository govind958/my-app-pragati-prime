import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import BuyNowButton from "@/components/BuyNowButton"

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
  .single();

  const { data: profile } = await supabase
  .from("profiles")
  .select("name, contact")
  .eq("id", user.id)
  .single();

  // 3️⃣ Handle missing member data
  if (memberError || !member) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Welcome, {user.email}</h2>
        <p className="text-gray-600">No membership record found.</p>
        <a href="/register-membership" className="text-blue-500 underline">
          Complete your membership registration →
        </a>
      </div>
    )
  }

  // 4️⃣ Render member dashboard with sidebar and Articles tab
  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-3 lg:col-span-3 border rounded-lg bg-white shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Member Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome, {profile.name || user.email}</p>
          </div>
          <nav className="p-2">
            <a className="block px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-900">Articles</a>
          </nav>
          <div className="p-4 border-t text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Membership</span>
              <span className={
                member.membership_type === "paid"
                  ? "text-green-600 font-semibold"
                  : "text-gray-700 font-semibold"
              }>
                {member.membership_type.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 text-gray-500 truncate">{user.email}</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="md:col-span-9 lg:col-span-9">
          {/* Articles Tab */}
          <div className="border rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-xl font-semibold">Articles</h3>
              <p className="text-sm text-gray-500">Browse free and premium content</p>
            </div>

            <div className="p-4 space-y-10">
              {/* Free Articles Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold">Free Articles</h4>
                  <Link href="/articles" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="grid gap-3">
                  <Link href="/articles" className="block p-3 border rounded hover:bg-gray-50 transition">
                    <div className="font-medium">All community posts</div>
                    <div className="text-sm text-gray-500">General updates, programs, and stories</div>
                  </Link>
                </div>
              </section>

              {/* Premium Articles Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold">Premium Articles</h4>
                  {member.membership_type === "paid" ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Included</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">Upgrade to access</span>
                  )}
                </div>

                {member.membership_type === "paid" ? (
                  <div className="grid gap-3">
                    <Link href="/articles" className="block p-3 border rounded hover:bg-gray-50 transition">
                      <div className="font-medium">Premium insights</div>
                      <div className="text-sm text-gray-500">Exclusive reports and member-only analyses</div>
                    </Link>
                  </div>
                ) : (
                  <div className="border rounded p-4 bg-yellow-50 text-yellow-800">
                    <div className="font-medium">Premium content is locked</div>
                    <p className="text-sm mt-1">Upgrade your membership to unlock all premium articles.</p>
                    <div className="mt-4">
                      <BuyNowButton
                        amount={499}
                        userDetails={{
                          name: profile.name,
                          email: user.email,
                          contact: profile.contact,
                        }}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
