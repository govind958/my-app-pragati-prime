"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Menu, X, LogIn, LayoutDashboard, Zap } from "lucide-react";

export default function NavbarClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const supabase = createClient();

  /** ✅ Check if user is Admin */
  const checkAdmin = useCallback(async (userId) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    setIsAdmin(profile?.role === "admin");
  }, [supabase]);

  /** ✅ Load user on mount */
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);

      if (user) {
        checkAdmin(user.id);
      }
      setLoading(false);
    });

    /** ✅ Listen for login/logout events */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkAdmin, supabase]);

  /** ✅ Logout function */
  const handleLogout = async () => {
    setMobileMenuOpen(false);

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);

    setUser(null);
    setIsAdmin(false);

    router.push("/");
    router.refresh();
  };

  // ✅ Classes
  const linkClass =
    "text-foreground/80 hover:text-primary transition-colors hover:scale-105 duration-200";
  const mobileLinkClass =
    "text-foreground/80 hover:text-primary flex items-center gap-3 py-2";
  const primaryButtonClass =
    "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] duration-300";

  return (
    <header className="w-full border-b border-border bg-linear-to-r from-primary/10 to-secondary/20 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* ✅ Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary hover:text-primary/80"
          onClick={() => setMobileMenuOpen(false)}
        >
          Pragati Prime
        </Link>

        {/* ✅ Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
          <Link href="/about" className={linkClass}>About</Link>
          <Link href="/team" className={linkClass}>Team</Link>
          <Link href="/articles" className={linkClass}>Articles</Link>

          {loading ? (
            <span className="text-foreground/80">Loading...</span>
          ) : user ? (
            <>
              <Link href="/private" className={linkClass}>Dashboard</Link>

              <button
                onClick={handleLogout}
                className="hover:text-primary transition-colors hover:scale-105 duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={primaryButtonClass}>
              <LogIn className="w-4 h-4" />
              Member Login
            </Link>
          )}
        </nav>

        {/* ✅ Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary p-2 rounded-md hover:text-primary/80"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <Link href="/about" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/team" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Team</Link>
            <Link href="/articles" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Articles</Link>

            <div className="border-t my-2 border-border/50"></div>

            {loading ? (
              <span className="text-foreground/80">Loading...</span>
            ) : user ? (
              <>
                <Link href="/private" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                {isAdmin && (
                  <Link href="/admin" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                    <Zap className="w-4 h-4" /> Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-left text-foreground/80 hover:text-primary"
                >
                  <LogIn className="w-4 h-4 rotate-180" /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={primaryButtonClass + " justify-center mt-4"}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" /> Member Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
