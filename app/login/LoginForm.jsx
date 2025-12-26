"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { OTPInput } from "@/components/ui/otp-input";

// Supabase client instance
const supabase = createClient();

/**
 * A modern, full-page SaaS-style Login/Signup form using Supabase OTP Email.
 * Now collects Name and Phone Number on signup.
 */
export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  /**
   * Handles sending the OTP email using Supabase's signInWithOtp.
   * It also saves Name and Phone to local storage if it's a signup attempt.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. If signing up, store extra data locally
    if (tab === "signup") {
      try {
        localStorage.setItem("signup_name", name);
        localStorage.setItem("signup_phone", phone);
      } catch (err) {
        console.error("Failed to save to local storage:", err);
        setMessage("Warning: Could not save profile data. You may need to enter it later.");
      }
    }

    // 2. Send OTP email
    let error = null;

    if (tab === "login") {
      // For login, try to sign in without creating user
      const result = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create user for login
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      error = result.error;

      // If user doesn't exist, show signup required message
      if (error && (
        error.message.includes("User not found") ||
        error.message.includes("Invalid login credentials") ||
        error.message.includes("Email not confirmed") ||
        error.message.includes("signup") ||
        error.message.includes("Signups not allowed")
      )) {
        setMessage("❌ First signup - no account found with this email.");
        setLoading(false);
        return;
      }

    } else if (tab === "signup") {
      // For signup, try to sign in with user creation allowed
      const result = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      error = result.error;

      // Store signup data
      if (!error && (name || phone)) {
        try {
          localStorage.setItem("signup_name", name);
          localStorage.setItem("signup_phone", phone);
        } catch (err) {
          console.error("Failed to save to local storage:", err);
          setMessage("Warning: Could not save profile data. You may need to enter it later.");
        }
      }
    }

    setLoading(false);

    // 3. Handle response
    if (error) {
      setMessage(`❌ Error: ${error.message}`);
      // Clear local storage on error
      if (tab === "signup") {
        localStorage.removeItem("signup_name");
        localStorage.removeItem("signup_phone");
      }
    } else {
      setMessage(`✅ OTP sent to ${email}. Please check your inbox.`);
      setOtpSent(true);
      setOtp(""); // Clear any previous OTP
    }
  };

  /**
   * Handles OTP verification
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("❌ Please enter a valid 6-digit OTP.");
      return;
    }

    setVerifying(true);
    setMessage("");

    // Verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    setVerifying(false);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
      setOtp(""); // Clear OTP on error
    } else if (data?.user) {
      // Success! Handle signup profile data if needed
      if (tab === "signup") {
        try {
          const signupName = localStorage.getItem("signup_name");
          const signupPhone = localStorage.getItem("signup_phone");
          
          if (signupName || signupPhone) {
            // Update user profile with name and phone
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                name: signupName || null,
                contact: signupPhone || null,
              })
              .eq('id', data.user.id);

            if (updateError) {
              console.error("Failed to update profile:", updateError);
            }

            // Clean up local storage
            localStorage.removeItem("signup_name");
            localStorage.removeItem("signup_phone");
          }
        } catch (err) {
          console.error("Error updating profile:", err);
        }
      }

      // Check user role and redirect accordingly
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/private');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Default to private page if role check fails
        router.push('/private');
      }
    }
  };

  /**
   * Resend OTP
   */
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    setOtp("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: tab === "signup",
      },
    });

    setLoading(false);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(`✅ New OTP sent to ${email}. Please check your inbox.`);
    }
  };

  // --- Render Components ---

  const AuthForm = (
    <div className="p-8 md:p-10">
      {/* Tabs for Login/Signup - Only show if OTP not sent */}
      {!otpSent && (
        <div className="flex w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab("login"); setMessage(""); }}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              tab === "login"
                ? "bg-white dark:bg-zinc-900 text-primary shadow-md"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab("signup"); setMessage(""); }}
            className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              tab === "signup"
                ? "bg-white dark:bg-zinc-900 text-primary shadow-md"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Form Title & Description */}
      <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-2">
        {otpSent 
          ? "Verify Your Email" 
          : tab === "login" 
          ? "Welcome Back" 
          : "Start Your Free Trial"}
      </h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
        {otpSent
          ? `Enter the 6-digit code sent to ${email}`
          : tab === "login"
          ? "Enter your registered email to receive a secure OTP code."
          : "Create your account first. Signup is required before you can login."}
      </p>

      {/* OTP Verification Form */}
      {otpSent ? (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4 text-center">
              Enter OTP Code
            </label>
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={verifying}
            />
          </div>

          <button
            type="submit"
            disabled={verifying || otp.length !== 6}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setMessage("");
              }}
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:underline"
            >
              Change Email
            </button>
          </div>

          {/* Message Area */}
          {message && (
            <p className={`text-center text-sm font-medium pt-2 ${message.startsWith('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      ) : (
        /* Main Auth Form */
        <form onSubmit={handleSendOtp} className="space-y-6">

        {/* --- NEW FIELDS: Name and Phone (Only visible on Signup) --- */}
        {tab === "signup" && (
          <>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-zinc-100 shadow-sm transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="(123) 456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-zinc-100 shadow-sm transition-colors"
              />
            </div>
          </>
        )}
        
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-zinc-100 shadow-sm transition-colors"
          />
        </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
          >
            {loading
              ? "Sending OTP..."
              : tab === "login"
              ? "Send OTP Code"
              : "Sign Up and Send OTP"}
          </button>

          {/* Message Area */}
          {message && (
            <p className={`text-center text-sm font-medium pt-2 ${message.startsWith('✅') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );

  // --- Full Page Layout ---

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-zinc-300 dark:text-zinc-800"/>
        </svg>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
        {AuthForm}
      </div>
    </div>
  );
}