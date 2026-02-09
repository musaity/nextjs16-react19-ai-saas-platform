import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] sm:min-h-[64px] w-full rounded border border-border bg-background px-3 sm:px-2 py-2 sm:py-1.5 text-sm sm:text-xs text-foreground transition-colors duration-100",
        "placeholder:text-muted-foreground/60",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "hover:border-border/80",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "resize-none",
        // iOS zoom fix
        "touch-manipulation",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
