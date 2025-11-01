import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Exchange code failed:', error)
      redirect('/error')
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      console.error('Verification failed:', error)
      redirect('/error')
    }
  } else {
    console.error('No code or token_hash found')
    redirect('/error')
  }

  // ✅ Success — user is now logged in
  redirect('/private')
}
