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
    // 👇 THE FIX IS HERE
    // Redirect to the new, unprotected login page
    redirect("/admin-login")
  }

  // 2. Check if user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single()

  // 3. The Security Check
  if (adminError || !adminData) {
    // If they are logged in but NOT an admin,
    // send them to the regular user dashboard.
    redirect("/admin-login")
  }

  // 4. If all checks pass, render the protected admin page
  return (
    <>
      {/* You could put a shared Admin Navbar here */}
      <main>{children}</main>
    </>
  )
}