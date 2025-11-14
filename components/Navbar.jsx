import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/logout/action";
import { createClient } from "@/utils/supabase/server";
import { NAV_LINKS } from "@/config/nav-links";
import { ChevronDown } from "lucide-react";

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if user is a member
  let isMember = false
  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("profile_id")
      .eq("profile_id", user.id)
      .single()
    isMember = !!member
  }
  
  
  return (
    <header className="w-full border-b border-border bg-linear-to-r from-primary/10 to-secondary/20 backdrop-blur supports-backdrop-filter:bg-linear-to-r supports-backdrop-filter:from-primary/10 supports-backdrop-filter:to-secondary/20 sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/logo1.jpeg" 
            alt="Pragati Prime Logo" 
            width={80} 
            height={80} 
            className="rounded-full object-contain h-12 w-auto "
            priority
          />
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((item) => {
            const hasSections = item.sections?.length;

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                >
                  <span>{item.label}</span>
                  {hasSections ? (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  ) : null}
                </Link>
                {hasSections ? (
                  <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 w-64 -translate-x-1/2 translate-y-2 rounded-2xl border border-border/60 bg-white/95 p-4 opacity-0 shadow-xl backdrop-blur transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-zinc-900/40">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Quick Links
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                      {item.sections.map((section) => (
                        <Link
                          key={section.href}
                          href={section.href}
                          className="rounded-xl px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-primary/10 hover:text-primary dark:text-zinc-300 dark:hover:bg-primary/30"
                        >
                          {section.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          {user ? (
            <>
              <Link
                href="/payment"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Payment
              </Link>
              {isMember ? (
                <Link
                  href="/profile"
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              ) : null}
              <Link
                href="/private"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-destructive px-4 py-2 text-white shadow-lg transition-all hover:bg-destructive/90"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-4 py-2 text-white shadow-lg transition-all hover:bg-primary/90"
            >
              Member Login
            </Link>
          )}
        </nav>
        <div className="md:hidden">
          <button className="text-foreground/80 hover:text-primary transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}


