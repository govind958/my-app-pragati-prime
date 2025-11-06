import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function AdminLayout({ children }) {
  const supabase = await createClient()

  // 1. Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    // Redirect to the new, unprotected login page
    redirect("/login")
  }

  // 2. Check if user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // 3. The Security Check
  if (profileError || !profile || profile.role !== "admin") {
    // If they are logged in but NOT an admin,
    // send them to the public home page.
    redirect("/")
  }

  // 4. If all checks pass, render the protected admin page
  return (
    <>
      {/* You could put a shared Admin Navbar here */}
      <main>{children}</main>
    </>
  )
}