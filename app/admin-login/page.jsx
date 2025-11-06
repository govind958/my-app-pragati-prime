"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Get the secret key from your environment variables
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_SECURITY_KEY

  const handleAdminSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    const securityKey = formData.get("security_key")

    // 1. CHECK THE SECURITY KEY FIRST
    if (securityKey !== ADMIN_KEY) {
      setError("Invalid Security Key.")
      setLoading(false)
      return
    }

    // 2. Key is correct, now check email/password
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 3. Email/password is correct, now check if they are in the 'admins' table
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .single()

    // 4. The Final Security Check
    if (adminError || !adminData) {
      setError("Access Denied: You are not an authorized admin.")
      await supabase.auth.signOut() // Log them back out
      setLoading(false)
      return
    }

    // 5. Success! All 3 checks passed.
    router.refresh()
    router.push("/admin") // Send to the protected /admin dashboard
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Portal Login
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleAdminSignIn} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              required 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label htmlFor="security_key" className="block text-sm font-medium text-gray-700 mb-2">
              Security Key
            </label>
            <input 
              type="password" 
              name="security_key" 
              id="security_key" 
              required 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter security key"
            />
          </div>

          {error && (
            <div className="p-4 text-center text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}