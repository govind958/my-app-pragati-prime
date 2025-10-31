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
    .select("*")
    .eq("user_id", user.id)
    .single()

  // 3️⃣ Handle missing member data
  if (memberError || !member) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Welcome, {user.email}</h2>
        <p className="text-gray-600">No membership record found.</p>
        <a href="/register" className="text-blue-500 underline">
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
        <p><strong>Membership ID:</strong> {member.membership_id}</p>
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
        <p><strong>Contact:</strong> {member.contact || "N/A"}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Member Dashboard</h2>
        {member.membership_type === "paid" ? (
          <div className="p-4 border rounded bg-green-50 text-green-800">
            ✅ Access granted to premium articles and updates!
          </div>
        ) : (
          <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
            ⚠️ You are on a Free Membership. Upgrade to access premium content.
          </div>
        )}
      </div>
    </div>
  )
}
