"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  size?: "sm" | "default"
  className?: string
}

export function ThemeToggle({ size = "sm", className }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()

  return (
    <Button 
      variant="ghost" 
      size={size === "default" ? "icon-sm" : "icon-xs"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        size === "default" && "w-8 h-8",
        className
      )}
    >
      <Sun className={cn(
        "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
        size === "default" ? "h-4 w-4" : "h-3.5 w-3.5"
      )} />
      <Moon className={cn(
        "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
        size === "default" ? "h-4 w-4" : "h-3.5 w-3.5"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}