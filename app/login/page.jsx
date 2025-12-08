import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LoginForm from './LoginForm'
import Footer from "@/components/Footer";
import NavbarClient from "@/components/NavbarClient";   // ✅ IMPORT YOUR CLIENT NAVBAR

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If NOT logged in → show login UI + NavbarClient + Footer
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        
        <NavbarClient />   {/* ✅ YOUR CLIENT NAVBAR */}

        <div className="flex-grow flex items-center justify-center">
          <LoginForm />
        </div>

        <Footer />        {/* ✅ Footer */}
      </div>
    )
  }

  // Fetch role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Redirect based on role
  if (profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/')
  }
}