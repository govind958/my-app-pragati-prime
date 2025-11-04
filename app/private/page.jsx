import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

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

  // 4️⃣ Render member info
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {member.full_name || user.email}
      </h1>

      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
        <p><strong>Membership ID:</strong> {member.member_id}</p>
        <p>
          <strong>Type:</strong>{" "}
          <span
            className={
              member.membership_type === "paid"
                ? "text-green-600 font-semibold"
                : "text-gray-700 font-semibold"
            }
          >
            {member.membership_type.toUpperCase()}
          </span>
        </p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact:</strong> {member.profiles?.contact || "N/A"}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Member Dashboard</h2>
        {member.membership_type === "paid" ? (
          <div className="p-4 border rounded bg-green-50 text-green-800">
            ✅ Access granted to premium articles and updates!
          </div>
        ) : (
          <>
            <div className="p-4 border rounded bg-yellow-50 text-yellow-800 mb-6">
              ⚠️ You are on a Free Membership. Upgrade to access premium content.
            </div>
            
            {/* Premium Membership Upgrade Card */}
            <div className="border-2 border-blue-500 rounded-xl bg-white shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Upgrade to Premium</h3>
                <p className="text-gray-600">Unlock all premium content and exclusive benefits</p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 text-lg">Premium Plan</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Unlock all premium content</p>
                  <p className="text-3xl font-bold text-blue-600">₹499 <span className="text-base font-normal text-gray-600">/ year</span></p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Access to all premium articles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Member-only updates and announcements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Unique Membership ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <a
                href="/register-membership"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all text-center"
              >
                Upgrade to Premium
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
