"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NavbarClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkMembership = useCallback(async (userId, supabase) => {
    const { data } = await supabase
      .from("members")
      .select("profile_id")
      .eq("profile_id", userId)
      .single();
    setIsMember(!!data);
  }, []);

  const checkAdmin = useCallback(async (userId, supabase) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    setIsAdmin(profile?.role === "admin");
  }, []);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkMembership(user.id, supabase);
        checkAdmin(user.id, supabase);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkMembership(session.user.id, supabase);
        checkAdmin(session.user.id, supabase);
      } else {
        setIsMember(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkMembership, checkAdmin]);

  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return;
      }
      
      // Clear local state
      setUser(null);
      setIsMember(false);
      setIsAdmin(false);
      
      // Redirect to home page
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-border bg-linear-to-r from-primary/10 to-secondary/20 backdrop-blur supports-backdrop-filter:bg-linear-to-r supports-backdrop-filter:from-primary/10 supports-backdrop-filter:to-secondary/20 sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link 
          href="/" 
          className="flex items-center hover:opacity-80 transition-opacity"
          onClick={closeMobileMenu}
        >
          <Image 
            src="/logo1.jpeg" 
            alt="Pragati Prime Logo" 
            width={80} 
            height={80} 
            className="rounded-full object-contain h-12 w-auto"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">About</Link>
          <Link href="/team" className="text-foreground/80 hover:text-primary transition-colors">Team</Link>
          <Link href="/articles" className="text-foreground/80 hover:text-primary transition-colors">Articles</Link>
          {loading ? (
            <span className="text-foreground/80">Loading...</span>
          ) : user ? (
            <>
              <Link href="/payment" className="text-foreground/80 hover:text-primary transition-colors">Payment</Link>
              {isMember && (
                <Link href="/profile" className="text-foreground/80 hover:text-primary transition-colors">Profile</Link>
              )}
              <Link href="/private" className="text-foreground/80 hover:text-primary transition-colors">Dashboard</Link>
              {/* Admin link removed from navbar */}
              <button onClick={handleLogout} className="text-foreground/80 hover:text-primary transition-colors cursor-pointer">Logout</button>
            </>
          ) : (
            <Link href="/login" className="text-foreground/80 hover:text-primary transition-colors">Memberlogin</Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-foreground/80 hover:text-primary transition-colors p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            <Link 
              href="/about" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link 
              href="/team" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Team
            </Link>
            <Link 
              href="/articles" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={closeMobileMenu}
            >
              Articles
            </Link>
            {loading ? (
              <span className="text-foreground/80 py-2">Loading...</span>
            ) : user ? (
              <>
                <Link 
                  href="/payment" 
                  className="text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Payment
                </Link>
                {isMember && (
                  <Link 
                    href="/profile" 
                    className="text-foreground/80 hover:text-primary transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                )}
                <Link 
                  href="/private" 
                  className="text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-foreground/80 hover:text-primary transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-left text-foreground/80 hover:text-primary transition-colors py-2 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
               Member login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

