import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') || 'email'
  const next = searchParams.get('next') ?? '/private'

  const supabase = await createClient()

  try {
    if (code) {
      // For PKCE or OAuth-style links
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      console.log('✅ Code exchange success')
      redirect(next)
    } else if (token_hash) {
      // For Magic Link or Signup confirmation
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      })
      if (error) throw error
      console.log('✅ OTP verification success')
      redirect(next)
    } else {
      throw new Error('Missing code or token_hash')
    }
  } catch (err) {
    console.error('❌ Verification failed:', err.message)
    redirect('/error')
  }
}
