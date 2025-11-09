'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOTPLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Allow both login and signup - Supabase will create user if doesn't exist
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Allow creating new users (signup)
      },
    })

    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      // Store email in sessionStorage for OTP page
      sessionStorage.setItem('otp_email', email)
      // Set cooldown for resend (60 seconds)
      sessionStorage.setItem('otp_cooldown', String(Date.now() + 60000))
      // Redirect to OTP verification page
      router.push(`/login/otp?email=${encodeURIComponent(email)}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
     
     
     
      <form
        onSubmit={handleOTPLogin}
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6 border border-zinc-200 dark:border-zinc-800"
      >
        <h1 className="text-2xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
          Login / Sign Up
        </h1>
        <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
          Enter your email to receive a verification code
        </p>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>

        {message && (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {message}
          </p>
        )}
      </form>






    </div>
  )
}
