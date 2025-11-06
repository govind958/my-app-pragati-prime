"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Start loading initially
  const [userEmail, setUserEmail] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isMember, setIsMember] = useState(false)
  
  // Single state for form data
  const [form, setForm] = useState({ name: "", contact: "" })

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      setUserEmail(user.email || "")

      // 1. Check if user is a member first
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("profile_id", user.id) 
        .single()

      if (memberError || !member) {
        // Not a member, redirect to registration
        setIsMember(false)
        router.push("/register-membership")
        return
      }
      
      setIsMember(true)

      // 2. Since they are a member, load their profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, contact") // Get name and contact
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError.message)
      } else if (profile) {
        // Set the form state with data from profiles
        setForm({
          name: profile.name || "",
          contact: profile.contact || ""
        })
      }
      
      setLoading(false) // Stop loading after all checks
    }

    loadProfile()
  }, [router, supabase])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      router.push("/login")
      return
    }

    try {
      // ONLY update the profiles table.
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          contact: form.contact
        })
        .eq("id", user.id) // Use the user's ID to find the row

      if (profileError) {
        setMessage({ type: "error", text: profileError.message })
        setLoading(false)
        return
      }

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: error.message })
    }

    setLoading(false)
  }

  // Show loading spinner while checking auth and membership
  if (loading || !isMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Update your profile information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              disabled
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name" // Added name attribute
              value={form.name} // Use state from form
              onChange={handleChange} // Use handleChange
              required
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:text-gray-100"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              id="contact"
              name="contact" // Added name attribute
              value={form.contact} // Use state from form
              onChange={handleChange} // Use handleChange
              required
              className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:text-gray-100"
              placeholder="Enter your contact number"
            />
          </div>

          {message.text && (
            <div className={`p-4 text-center border rounded-lg ${
              message.type === "success"
                ? "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20"
                : "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20"
            }`}>
              <svg className={`inline-block w-5 h-5 mr-2 ${message.type === "success" ? "text-green-600" : "text-red-600"}`} fill="currentColor" viewBox="0 0 20 20">
                {message.type === "success" ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {message.text}
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
                Updating...
              </span>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
