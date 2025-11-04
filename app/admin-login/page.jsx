"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleAdminSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    const supabase = createClient()

    // This just sends the link. It does not check the role.
    // The middleware will handle the role check AFTER login.
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // This is where the user will be sent AFTER clicking the link
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Check your email for the magic login link!")
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Admin Portal Login
        </h1>
        <form onSubmit={handleAdminSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {message && (
            <p className="mb-4 text-center text-green-600 bg-green-50 p-2 rounded">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-4 text-center text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Sending link..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </div>
  )
}