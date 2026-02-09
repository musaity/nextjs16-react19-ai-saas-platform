"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Clock,
  Gift,
  Star,
  Heart,
  Award,
  Check,
  Rocket,
  Crown,
  Gem,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  Gift,
  Zap,
  Shield,
  Clock,
  Star,
  Heart,
  Award,
  Check,
  Rocket,
  Sparkles,
  Crown,
  Gem,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// CTA Data interface
interface CtaBenefit {
  icon: string;
  text: string;
}

interface CtaData {
  badge: string;
  badgeEnabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  benefits: CtaBenefit[];
}

interface CTASectionProps {
  ctaData?: CtaData;
}

// Default CTA data
const defaultCtaData: CtaData = {
  badge: "Limited Time Offer",
  badgeEnabled: true,
  title: "Start Creating Today",
  description: "Join thousands of creators using AI to bring their ideas to life. No technical skills required.",
  buttonText: "Get Started Free",
  buttonUrl: "/platform/studio",
  secondaryButtonText: "View Documentation",
  secondaryButtonUrl: "/docs",
  benefits: [
    { icon: "Gift", text: "50 free credits to start" },
    { icon: "Zap", text: "No credit card required" },
    { icon: "Shield", text: "Cancel anytime" },
    { icon: "Clock", text: "Setup in 30 seconds" },
  ],
};

// ============================================================================
// CTA SECTION - Premium call-to-action (2026 Theme)
// ============================================================================
export const CTASection = memo(function CTASection({ ctaData }: CTASectionProps) {
  // Merge with defaults
  const data = {
    ...defaultCtaData,
    ...ctaData,
    benefits: ctaData?.benefits?.length ? ctaData.benefits : defaultCtaData.benefits,
  };

  return (
    <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-slate-50 dark:bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div 
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={cn(
            "relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 overflow-hidden",
            "bg-white/80 dark:bg-white/[0.03]",
            "border border-slate-200/80 dark:border-white/10",
            "backdrop-blur-xl",
            "shadow-xl shadow-slate-200/50 dark:shadow-none"
          )}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-50 dark:opacity-30"
              style={{
                background: "radial-gradient(ellipse at top, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 text-center">
            {/* Badge */}
            {data.badgeEnabled && (
              <motion.div 
                variants={itemVariants}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 sm:mb-8",
                  "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
                  "border border-violet-500/20 dark:border-violet-400/20",
                  "backdrop-blur-sm"
                )}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                  {data.badge}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h2 
              variants={itemVariants}
              className={cn(
                "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 sm:mb-6",
                "bg-clip-text text-transparent",
                "bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-white dark:to-white/60"
              )}
            >
              {data.title}
            </motion.h2>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-2xl mx-auto mb-8 sm:mb-10 px-2 font-display"
            >
              {data.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12"
            >
              <Link
                href={data.buttonUrl}
                className={cn(
                  "group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl w-full sm:w-auto justify-center",
                  "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
                  "font-bold font-display text-base sm:text-lg",
                  "shadow-xl shadow-slate-900/20 dark:shadow-white/20",
                  "hover:shadow-2xl hover:scale-[1.02]",
                  "active:scale-[0.98]",
                  "transition-all duration-200",
                  "overflow-hidden"
                )}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent" />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                {data.buttonText}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href={data.secondaryButtonUrl}
                className={cn(
                  "inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl w-full sm:w-auto justify-center",
                  "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10",
                  "text-slate-700 dark:text-white font-semibold text-base sm:text-lg",
                  "hover:bg-slate-200 dark:hover:bg-white/10",
                  "hover:border-slate-300 dark:hover:border-white/20",
                  "transition-all duration-200"
                )}
              >
                {data.secondaryButtonText}
              </Link>
            </motion.div>

            {/* Benefits */}
            {data.benefits.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-4 sm:gap-8"
              >
                {data.benefits.map((benefit, index) => {
                  const Icon = iconMap[benefit.icon] || Gift;
                  return (
                    <div
                      key={`${benefit.text}-${index}`}
                      className="flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/60 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-violet-500/10 dark:bg-violet-500/20">
                        <Icon className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{benefit.text}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
