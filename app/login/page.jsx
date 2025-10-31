'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // auto-sign up if user doesn't exist
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('✅ Magic Link sent! Check your email to log in.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <form
        onSubmit={handleMagicLinkLogin}
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 w-full max-w-sm space-y-6 border border-zinc-200 dark:border-zinc-800"
      >
        <h1 className="text-2xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
          Login via Magic Link
        </h1>

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
          {loading ? 'Sending...' : 'Send Magic Link'}
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
