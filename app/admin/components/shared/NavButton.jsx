"use client";

import { Button } from "@/components/ui/button1";

export default function NavButton({ children, active, onClick, icon: Icon }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Button>
  );
}
