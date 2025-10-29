import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-linear-to-r from-primary/10 to-secondary/20 backdrop-blur supports-backdrop-filter:bg-linear-to-r supports-backdrop-filter:from-primary/10 supports-backdrop-filter:to-secondary/20 sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
          Pragati Prime
        </Link>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors">About</Link>
          <Link href="/team" className="text-foreground/80 hover:text-primary transition-colors">Team</Link>
          <Link href="/articles" className="text-foreground/80 hover:text-primary transition-colors">Articles</Link>
          <Link href="/membership" className="text-foreground/80 hover:text-primary transition-colors">Membership</Link>
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


