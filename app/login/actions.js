'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function loginWithMagicLink(formData) {
  const supabase = await createClient()

  const email = formData.get('email')

  if (!email) {
    redirect('/error') // or handle invalid input gracefully
  }

  // Send magic link email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) {
    console.error('Magic link error:', error)
    redirect('/error')
  }

  // No immediate session; user must check their email
  revalidatePath('/', 'layout')
  redirect('/private') // You can create a page telling user to check inbox
}
