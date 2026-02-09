"use client";

import { cn } from "@/lib/utils";
import { memo, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

// ============================================================================
// SCROLL REVEAL - Smooth scroll animations for sections
// ============================================================================
type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur" | "slideUp" | "spring";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const animationVariants: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp: {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  spring: {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

export const ScrollReveal = memo(function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const springTransition = variant === "spring" 
    ? { type: "spring" as const, damping: 25, stiffness: 100, delay }
    : { duration, delay, ease: [0.25, 0.4, 0.25, 1] as const };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animationVariants[variant]}
      transition={springTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// ============================================================================
// STAGGER CHILDREN - Animate children with stagger effect
// ============================================================================
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
  threshold = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// ============================================================================
// STAGGER ITEM - Individual item in stagger container
// ============================================================================
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
}

export const StaggerItem = memo(function StaggerItem({
  children,
  className,
  variant = "fadeUp",
}: StaggerItemProps) {
  return (
    <motion.div
      variants={animationVariants[variant]}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// ============================================================================
// 2026 ANIMATED BACKGROUND - Premium Mesh Gradient
// ============================================================================
export const AnimatedBackground = memo(function AnimatedBackground({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div 
          className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full opacity-30 dark:opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full opacity-25 dark:opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute top-[40%] left-[60%] w-[50%] h-[50%] rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

// ============================================================================
// SECTION HEADER - Consistent section titles
// ============================================================================
interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  highlightedText?: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeader = memo(function SectionHeader({
  badge,
  badgeIcon,
  title,
  highlightedText,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-10 sm:mb-12 md:mb-16 px-2 sm:px-0",
      align === "center" && "text-center"
    )}>
      {badge && (
        <div className={cn(
          "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6",
          "bg-violet-500/10 border border-violet-500/20"
        )}>
          {badgeIcon}
          <span className="text-xs sm:text-sm font-semibold font-accent text-violet-600 dark:text-violet-400">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground mb-3 sm:mb-4">
        {title}{" "}
        {highlightedText && (
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
            {highlightedText}
          </span>
        )}
      </h2>
      {description && (
        <p className={cn(
          "text-sm sm:text-base md:text-lg text-muted-foreground font-display",
          align === "center" && "max-w-2xl mx-auto"
        )}>
          {description}
        </p>
      )}
    </div>
  );
});

// ============================================================================
// BENTO CARD - Flexible grid card component
// ============================================================================
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "featured" | "gradient";
  href?: string;
}

export const BentoCard = memo(function BentoCard({
  children,
  className,
  variant = "default",
  href,
}: BentoCardProps) {
  const baseStyles = cn(
    "relative rounded-3xl p-6 md:p-8 overflow-hidden transition-all duration-300",
    "group cursor-pointer"
  );

  const variantStyles = {
    default: cn(
      "bg-gray-100/80 dark:bg-white/[0.02]",
      "border border-gray-200 dark:border-white/5",
      "hover:bg-gray-50 dark:hover:bg-white/[0.05]",
      "hover:border-violet-500/40 dark:hover:border-violet-500/20",
      "shadow-sm dark:shadow-none",
      "hover:shadow-lg hover:shadow-violet-500/5"
    ),
    featured: cn(
      "bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10",
      "dark:from-violet-500/[0.08] dark:via-purple-500/[0.04] dark:to-fuchsia-500/[0.08]",
      "border border-violet-500/20 dark:border-violet-500/15",
      "hover:border-violet-500/40 dark:hover:border-violet-500/30",
      "hover:shadow-xl hover:shadow-violet-500/10"
    ),
    gradient: cn(
      "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600",
      "border-0",
      "hover:shadow-2xl hover:shadow-violet-500/20",
      "hover:scale-[1.02]"
    ),
  };

  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      href={href}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </Wrapper>
  );
});

// ============================================================================
// GLASS BUTTON - Premium button styles
// ============================================================================
interface GlassButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const GlassButton = memo(function GlassButton({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  onClick,
}: GlassButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 font-semibold font-display rounded-xl transition-all duration-200",
    "active:scale-[0.98]"
  );

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary: cn(
      "bg-gradient-to-r from-violet-600 to-purple-600",
      "text-white shadow-lg shadow-violet-500/25",
      "hover:shadow-xl hover:shadow-violet-500/30",
      "hover:scale-[1.02]"
    ),
    secondary: cn(
      "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10",
      "text-foreground",
      "hover:bg-slate-200 dark:hover:bg-white/10 hover:border-violet-500/30"
    ),
    ghost: cn(
      "text-muted-foreground",
      "hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5"
    ),
  };

  const Wrapper = href ? "a" : "button";

  return (
    <Wrapper
      href={href}
      onClick={onClick}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
    >
      {children}
    </Wrapper>
  );
});

// ============================================================================
// FLOATING CARD - Animated floating effect
// ============================================================================
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FloatingCard = memo(function FloatingCard({
  children,
  className,
  delay = 0,
}: FloatingCardProps) {
  return (
    <div 
      className={cn(
        "animate-float",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================================
// GLOW ORB - Decorative glow effect
// ============================================================================
interface GlowOrbProps {
  color?: "violet" | "purple" | "fuchsia" | "cyan";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GlowOrb = memo(function GlowOrb({
  color = "violet",
  size = "md",
  className,
}: GlowOrbProps) {
  const colors = {
    violet: "from-violet-500/30 to-violet-500/0",
    purple: "from-purple-500/30 to-purple-500/0",
    fuchsia: "from-fuchsia-500/30 to-fuchsia-500/0",
    cyan: "from-cyan-500/30 to-cyan-500/0",
  };

  const sizes = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl pointer-events-none",
        `bg-gradient-radial ${colors[color]}`,
        sizes[size],
        className
      )}
    />
  );
});
