"use client";

import { usePathname } from "next/navigation";
import NavbarClient from "./NavbarClient";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on login and admin pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <NavbarClient />;
}

