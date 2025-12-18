"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button1";
import { createClient } from "@/utils/supabase/client";

export default function AuthActionButton({
  size = "lg",
  className = "bg-white text-orange-600 hover:bg-orange-100 hover:text-orange-800 hover:scale-105 shadow-xl hover:shadow-2xl",
  loginText = "Become a Member",
  memberText = "Go to Member Page",
  loginHref = "/login",
  memberHref = "/register-membership",
}) {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    getUser();
  }, [supabase]);

  if (!user) {
    // Not logged in → show login button
    return (
      <Link href={loginHref}>
        <Button size={size} className={`rounded-full ${className}`}>
          {loginText}
        </Button>
      </Link>
    );
  }

  // Logged in → show member/dashboard button
  return (
    <Link href={memberHref}>
      <Button
        size={size}
        className={`rounded-full ${className}`}
      >
        {memberText}
      </Button>
    </Link>
  );
}
