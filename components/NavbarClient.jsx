"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  LayoutDashboard,
  Zap,
  ChevronDown,
} from "lucide-react";
import { NAV_LINKS } from "@/config/nav-links";

export default function NavbarClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  /** ✅ Logout function */
  const handleLogout = async () => {
    setMobileMenuOpen(false);
    setOpenMobileSection(null);

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);

    setUser(null);
    setIsAdmin(false);

    router.push("/");
    router.refresh();
  };

  /** ✅ Handle hover enter with delay */
  const handleMouseEnter = (itemLabel) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredNavItem(itemLabel);
  };

  /** ✅ Handle hover leave with delay */
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredNavItem(null);
    }, 200); // 200ms delay before hiding
    setHoverTimeout(timeout);
  };

  // ✅ Classes
  const linkClass =
    "text-foreground/80 hover:text-primary transition-colors hover:scale-105 duration-200";
  const mobileLinkClass =
    "text-foreground/80 hover:text-primary flex items-center gap-3 py-2";
  const primaryButtonClass =
    "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] duration-300";
  const logoutButtonClass =
    "flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-destructive/90 transition-all transform hover:scale-[1.02] duration-300";

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
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          {NAV_LINKS.map((item) => {
            const hasSections = item.sections?.length;
            const isHovered = hoveredNavItem === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasSections && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className={`${linkClass} inline-flex items-center gap-1 rounded-full px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20`}
                >
                  <span>{item.label}</span>
                  {hasSections ? (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isHovered ? "rotate-180" : ""
                      }`}
                    />
                  ) : null}
                </Link>
                {hasSections ? (
                  <div
                    className={`absolute left-1/2 top-full z-30 mt-1 w-64 -translate-x-1/2 rounded-2xl border border-border/60 bg-white/95 p-4 shadow-xl backdrop-blur transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-zinc-900/40 ${
                      isHovered
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0"
                    }`}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
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

          {loading ? (
            <span className="text-foreground/80">Loading...</span>
          ) : user ? (
            <>
              <Link href="/private" className={linkClass}>
                Dashboard
              </Link>

              <button onClick={handleLogout} className={logoutButtonClass}>
                <LogOut className="w-4 h-4" />
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
            onClick={() =>
              setMobileMenuOpen((prev) => {
                const next = !prev;
                if (!next) {
                  setOpenMobileSection(null);
                }
                return next;
              })
            }
            className="text-primary p-2 rounded-md hover:text-primary/80"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col px-4 py-4 space-y-3">
            {NAV_LINKS.map((item) => {
              const hasSections = item.sections?.length;
              const isOpen = openMobileSection === item.label;

              return (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={mobileLinkClass}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOpenMobileSection(null);
                      }}
                    >
                      {item.label}
                    </Link>
                    {hasSections ? (
                      <button
                        type="button"
                        className="rounded-full p-1 text-foreground/70 hover:text-primary"
                        aria-label={`Toggle ${item.label} sections`}
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenMobileSection((prev) =>
                            prev === item.label ? null : item.label
                          )
                        }
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>
                  {hasSections && isOpen ? (
                    <div className="ml-4 flex flex-col gap-1 border-l border-border/50 pl-4">
                      {item.sections.map((section) => (
                        <Link
                          key={section.href}
                          href={section.href}
                          className="text-sm text-foreground/70 hover:text-primary"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setOpenMobileSection(null);
                          }}
                        >
                          {section.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="border-t pt-3 border-border/50" />

            {loading ? (
              <span className="text-foreground/80">Loading...</span>
            ) : user ? (
              <>
                <Link
                  href="/private"
                  className={mobileLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className={mobileLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Zap className="w-4 h-4" /> Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className={`${logoutButtonClass} justify-center mt-2`}
                >
                  <LogOut className="w-4 h-4" /> Logout
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
