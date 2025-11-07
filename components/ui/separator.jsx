"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal", ...props }) {
  return orientation === "vertical" ? (
    <div
      data-slot="separator"
      className={cn("bg-border w-px h-full", className)}
      {...props}
    />
  ) : (
    <div
      data-slot="separator"
      className={cn("bg-border h-px w-full", className)}
      {...props}
    />
  );
}

export { Separator };
