"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LegalFooterLinks } from "./legal-quick-view";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface SiteFooterProps {
  siteName: string;
  logoUrl?: string | null;
  darkLogoUrl?: string | null;
}

export function SiteFooter({ siteName, logoUrl, darkLogoUrl }: SiteFooterProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to show based on theme
  const currentLogo = mounted && (resolvedTheme === "dark" && darkLogoUrl) 
    ? darkLogoUrl 
    : logoUrl;

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      {/* 2026 Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        
        {/* Subtle gradient orb */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-12">
          {/* Top Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* 2026 Logo with glow */}
            <Link href="/" className="flex items-center gap-3 group">
              {currentLogo ? (
                <img 
                  src={currentLogo} 
                  alt={siteName}
                  className="h-10 md:h-12 w-auto object-contain max-w-[160px]"
                />
              ) : (
                <>
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600",
                      "shadow-[0_8px_24px_rgba(139,92,246,0.35)]",
                      "group-hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)]",
                      "transition-all duration-300"
                    )}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="font-bold text-2xl text-foreground group-hover:text-foreground/90 transition-colors">
                    {siteName}
                  </span>
                </>
              )}
            </Link>

            {/* Navigation Links - 2026 style */}
            <div className="flex items-center gap-2">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Gallery", href: "#gallery" },
              ].map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground",
                    "hover:text-foreground",
                    "hover:bg-white/[0.05] dark:hover:bg-white/[0.03]",
                    "transition-all duration-300"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* 2026 Divider with gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Bottom Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Legal Links with Quick View Modal */}
            <LegalFooterLinks />

            {/* Copyright - 2026 style */}
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
