"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import BuyNowButton from "@/components/BuyNowButton" 

export default function RegisterMembershipPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    full_name: "",
    contact: "",
    membership_type: "member"
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      router.push("/login")
      return
    }

    // This variable name is fine
    const membership_id = `MEM${Math.floor(Math.random() * 1000000)}`

    // Query 1: Insert the new membership record
    const memberInsert = supabase.from("members").insert([
      {
        profile_id: user.id,
        member_id: membership_id, // Changed from 'membership_id'
        membership_type: form.membership_type,
      }
    ])
    
    // Query 2: Update the user's profile with their full name
    const profileUpdate = supabase
      .from("profiles")
      .update({ name: form.full_name, contact: form.contact})
      .eq("id", user.id)

    // Run both queries in parallel
    const [memberResult, profileResult] = await Promise.all([
      memberInsert,
      profileUpdate
    ])
    
    // --- END OF UPDATED QUERIES ---

    setLoading(false)

    // Check if either query failed
    if (memberResult.error || profileResult.error) {
      const memberError = memberResult.error?.message || ""
      const profileError = profileResult.error?.message || ""
      setError(`Registration Error: ${memberError} ${profileError}`)
    } else {
      // Success!
      setMessage("Membership registration successful!")
      // Redirect to the private page after a short delay
      setTimeout(() => {
        router.push("/private")
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Membership Registration
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Join our community and get access to member benefits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              placeholder="Enter your contact number"
              value={form.contact}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Membership Type
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* Free Plan */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer text-center transition-all ${
                  form.membership_type === "member"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setForm({ ...form, membership_type: "member" })}
              >
                <h3 className="font-semibold text-gray-800">Free Plan</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Access limited articles
                </p>
                <p className="text-lg font-semibold mt-2">₹0</p>
              </div>

              {/* Paid Plan */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer text-center transition-all ${
                  form.membership_type === "paid"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setForm({ ...form, membership_type: "paid" })}
              >
                <h3 className="font-semibold text-gray-800">Premium Plan</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Unlock all premium content
                </p>
                <p className="text-lg font-semibold mt-2">₹499 / year</p>

              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 text-center text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 text-center text-green-700 bg-green-50 border border-green-200 rounded-lg">
              <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}

          {/* Conditional Button */}
          {form.membership_type === "paid" ? (
            <BuyNowButton
              amount={499} // ₹499 in paise
              userDetails={{
                name: form.full_name,
                email: "", // replace with user email from supabase if available
                contact: form.contact,
              }}
            />
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
            >
              {loading ? "Processing..." : "Register Membership"}
            </button>
          )}
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already a member?{" "}
          <a
            href="/private"
            className="text-blue-600 font-medium hover:underline"
          >
            Go to Dashboard →
          </a>
        </p>
      </div>
    </div>
  )
}

