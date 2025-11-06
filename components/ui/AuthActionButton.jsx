"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function AuthActionButton({
  size = "lg",
  className = "",
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
