"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Helper function to generate membership ID
function generateMembershipId() {
  return `MEM${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export default function RegisterMembershipPage() {
  const supabase = createClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      full_name: "",
      contact: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      const membership_id = generateMembershipId()

      // Insert the new membership record
      const memberInsert = supabase.from("members").insert([
        {
          profile_id: user.id,
          member_id: membership_id,
          membership_type: "member",
        }
      ])
      
      // Update the user's profile with their full name and contact
      const profileUpdate = supabase
        .from("profiles")
        .update({ name: data.full_name, contact: data.contact })
        .eq("id", user.id)

      // Run both queries in parallel
      const [memberResult, profileResult] = await Promise.all([
        memberInsert,
        profileUpdate
      ])

      // Check if either query failed
      if (memberResult.error || profileResult.error) {
        const memberError = memberResult.error?.message || ""
        const profileError = profileResult.error?.message || ""
        form.setError("root", {
          message: `Registration Error: ${memberError} ${profileError}`
        })
      } else {
        // Success! Redirect to the private page after a short delay
        setTimeout(() => {
          router.push("/private")
        }, 1500)
      }
    } catch (error) {
      form.setError("root", {
        message: error.message || "An unexpected error occurred"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Membership Registration</CardTitle>
          <CardDescription className="text-center">
            Join our community and get access to member benefits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                rules={{
                  required: "Full name is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter your complete name as it should appear on your membership.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                rules={{
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit contact number"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your contact number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your 10-digit mobile number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="p-4 text-center text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {form.formState.errors.root.message}
                </div>
              )}

              {form.formState.isSubmitSuccessful && (
                <div className="p-4 text-center text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Membership registration successful!
                </div>
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  "Register Membership"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already a member?{" "}
            <a
              href="/private"
              className="text-blue-600 font-medium hover:underline"
            >
              Go to Dashboard →
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
