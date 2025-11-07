"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/logout/action";

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

  // Base class for desktop links
  const baseLinkClass = "text-foreground/80 hover:text-primary transition-colors hover:scale-105 transform duration-200";
  // Base class for mobile links
  const baseMobileLinkClass = "text-foreground/80 hover:text-primary transition-colors py-2 flex items-center gap-3";
  // Primary button class
  const primaryButtonClass = "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] duration-300";

  return (
    <header className="w-full border-b border-border bg-linear-to-r from-primary/10 to-secondary/20 backdrop-blur supports-backdrop-filter:bg-linear-to-r supports-backdrop-filter:from-primary/10 supports-backdrop-filter:to-secondary/20 sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link 
          href="/" 
          className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          onClick={closeMobileMenu}
        >
          Pragati Prime
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden gap-8 text-sm font-medium md:flex items-center">
          <Link href="/about" className={baseLinkClass}>About</Link>
          <Link href="/team" className={baseLinkClass}>Team</Link>
          <Link href="/articles" className={baseLinkClass}>Articles</Link>
          {loading ? (
            <span className="text-foreground/80">Loading...</span>
          ) : user ? (
            <>
              <Link href="/payment" className="text-foreground/80 hover:text-primary transition-colors">Payment</Link>
              {isMember && (
                <Link href="/profile" className={baseLinkClass}>Profile</Link>
              )}
              <Link href="/private" className={baseLinkClass}>Dashboard</Link>
              {/* Admin link removed from navbar */}
              <button onClick={handleLogout} className="text-foreground/80 hover:text-primary transition-colors cursor-pointer hover:scale-105 transform duration-200">Logout</button>
            </>
          ) : (
            <Link 
              href="/login" 
              className={primaryButtonClass} // Using the new button style
            >
              <LogIn className="w-4 h-4" />
              Member Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-primary hover:text-primary/80 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <Link 
              href="/about" 
              className={baseMobileLinkClass}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link 
              href="/team" 
              className={baseMobileLinkClass}
              onClick={closeMobileMenu}
            >
              Team
            </Link>
            <Link 
              href="/articles" 
              className={baseMobileLinkClass}
              onClick={closeMobileMenu}
            >
              Articles
            </Link>
            <div className="border-t border-border/50 my-2"></div>
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
                    className={baseMobileLinkClass}
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                )}
                <Link 
                  href="/private" 
                  className={baseMobileLinkClass}
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={baseMobileLinkClass}
                    onClick={closeMobileMenu}
                  >
                    <Zap className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-left text-foreground/80 hover:text-primary transition-colors py-2 cursor-pointer flex items-center gap-3"
                >
                  <LogIn className="w-4 h-4 rotate-180" /> Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className={primaryButtonClass + " mt-4 justify-center"} // Apply button style in mobile, centered
                onClick={closeMobileMenu}
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