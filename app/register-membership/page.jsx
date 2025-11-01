"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function RegisterMembershipPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    contact: "",
    membership_type: "free"
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      router.push("/login")
      return
    }

    // Generate Membership ID
    const membership_id = `MEM${Math.floor(Math.random() * 1000000)}`

    const { error } = await supabase.from("members").insert([
      {
        user_id: user.id,
        full_name: form.full_name,
        contact: form.contact,
        membership_type: form.membership_type,
        membership_id
      }
    ])

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("Membership registration successful!")
      router.push("/member")
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
                  form.membership_type === "free"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => setForm({ ...form, membership_type: "free" })}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            {loading
              ? "Processing..."
              : form.membership_type === "paid"
              ? "Proceed to Payment"
              : "Register Membership"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already a member?{" "}
          <a
            href="/member"
            className="text-blue-600 font-medium hover:underline"
          >
            Go to Dashboard →
          </a>
        </p>
      </div>
    </div>
  )
}
