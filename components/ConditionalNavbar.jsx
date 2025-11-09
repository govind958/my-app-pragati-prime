"use client";

import { usePathname } from "next/navigation";
import NavbarClient from "./NavbarClient";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on login, admin, and private (dashboard) pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/admin") || pathname?.startsWith("/private")) {
    return null;
  }
  
  return <NavbarClient />;
}

