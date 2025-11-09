"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { OTPInput } from "@/components/ui/otp-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function OTPVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const hasAutoSubmitted = useRef(false)
  
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    // Get email from URL params or session storage
    const emailParam = searchParams.get("email")
    const storedEmail = sessionStorage.getItem("otp_email")
    
    if (emailParam) {
      setEmail(emailParam)
      sessionStorage.setItem("otp_email", emailParam)
    } else if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // No email found, redirect back to login
      router.push("/login")
      return
    }

    // Start resend cooldown timer
    const storedCooldown = sessionStorage.getItem("otp_cooldown")
    if (storedCooldown) {
      const remaining = parseInt(storedCooldown) - Date.now()
      if (remaining > 0) {
        setResendCooldown(Math.ceil(remaining / 1000))
      }
    }
  }, [searchParams, router])

  useEffect(() => {
    // Countdown timer for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerifyOTP = async (e) => {
    if (e?.preventDefault) {
      e.preventDefault()
    }
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit OTP")
      return
    }

    if (loading) return // Prevent multiple submissions

    setLoading(true)
    setError("")
    setMessage("")
    hasAutoSubmitted.current = true

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (verifyError) {
        setError(verifyError.message)
        setLoading(false)
        hasAutoSubmitted.current = false // Reset to allow retry
        return
      }

      // Success - get user and redirect based on role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        // Clear session storage
        sessionStorage.removeItem("otp_email")
        sessionStorage.removeItem("otp_cooldown")

        if (profile?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/private")
        }
      } else {
        router.push("/private")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
      hasAutoSubmitted.current = false // Reset to allow retry
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !email) return

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      if (resendError) {
        setError(resendError.message)
      } else {
        setMessage("OTP resent successfully! Check your email.")
        // Set 60 second cooldown
        setResendCooldown(60)
        sessionStorage.setItem("otp_cooldown", String(Date.now() + 60000))
      }
    } catch {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !loading && !error && !hasAutoSubmitted.current) {
      const timer = setTimeout(() => {
        handleVerifyOTP()
      }, 500) // Small delay to ensure state is updated
      return () => clearTimeout(timer)
    }
    // Reset auto-submit flag when OTP changes
    if (otp.length < 6) {
      hasAutoSubmitted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center w-full block">
                Verification Code
              </Label>
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
                length={6}
                className="justify-center"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm text-center">
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={loading || resendCooldown > 0}
                className="w-full"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend OTP"}
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/login")}
                className="text-sm"
              >
                ← Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
