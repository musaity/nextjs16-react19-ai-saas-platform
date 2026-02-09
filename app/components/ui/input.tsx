import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 sm:h-8 w-full rounded border border-border bg-background px-3 sm:px-2 py-2 sm:py-1 text-sm sm:text-xs text-foreground transition-colors duration-100",
        "placeholder:text-muted-foreground/60",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "hover:border-border/80",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "file:border-0 file:bg-transparent file:text-sm sm:file:text-xs file:font-medium",
        // iOS zoom fix - ensures 16px minimum on mobile
        "touch-manipulation",
        className
      )}
      {...props}
    />
  )
}

export { Input }
