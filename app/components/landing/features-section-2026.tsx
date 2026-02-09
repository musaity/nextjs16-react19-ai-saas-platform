"use client";

import { useRef, useState, memo } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  MessageSquare, 
  Bot,
  Palette,
  Layers,
  Zap,
  Shield,
  Globe,
  Mic2,
  Wand2,
  Eraser,
  Brain,
  Camera,
  Music,
  FileText,
  Code,
  Rocket,
  Star,
  Heart,
  Settings,
  ArrowRight,
  LucideIcon,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
interface LandingFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  badge: string | null;
  imageUrl: string | null;
  mediaType?: string; // none, image, video
  order: number;
  category: string;
}

interface FeaturesSection2026Props {
  features: LandingFeature[];
  featureTitle?: string;
  featureTitleFont?: string;
  featureTitleFontSize?: string;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: customEase,
    },
  },
};

// ============================================================================
// ICON MAPPING
// ============================================================================
const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Image: ImageIcon,
  ImageIcon: ImageIcon,
  Video,
  MessageSquare,
  Bot,
  Palette,
  Layers,
  Zap,
  Shield,
  Globe,
  Mic2,
  Wand2,
  Eraser,
  Brain,
  Camera,
  Music,
  FileText,
  Code,
  Rocket,
  Star,
  Heart,
  Settings,
};

// ============================================================================
// COLOR SCHEMES FOR CATEGORIES
// ============================================================================
const categoryColors: Record<string, {
  gradient: string;
  glow: string;
  border: string;
  text: string;
  icon: string;
  bg: string;
}> = {
  image: {
    gradient: "from-fuchsia-500 via-violet-500 to-indigo-500",
    glow: "rgba(167, 139, 250, 0.4)",
    border: "border-violet-500/30",
    text: "text-violet-400",
    icon: "from-fuchsia-400 to-violet-500",
    bg: "bg-violet-500/10",
  },
  video: {
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    glow: "rgba(34, 211, 238, 0.4)",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    icon: "from-blue-400 to-cyan-500",
    bg: "bg-cyan-500/10",
  },
  chat: {
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    glow: "rgba(52, 211, 153, 0.4)",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: "from-emerald-400 to-green-500",
    bg: "bg-emerald-500/10",
  },
  ai: {
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    glow: "rgba(251, 191, 36, 0.4)",
    border: "border-amber-500/30",
    text: "text-amber-400",
    icon: "from-orange-400 to-amber-500",
    bg: "bg-amber-500/10",
  },
  security: {
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    glow: "rgba(244, 114, 182, 0.4)",
    border: "border-pink-500/30",
    text: "text-pink-400",
    icon: "from-rose-400 to-pink-500",
    bg: "bg-pink-500/10",
  },
  infrastructure: {
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "rgba(56, 189, 248, 0.4)",
    border: "border-sky-500/30",
    text: "text-sky-400",
    icon: "from-sky-400 to-blue-500",
    bg: "bg-sky-500/10",
  },
  default: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "rgba(167, 139, 250, 0.4)",
    border: "border-violet-500/30",
    text: "text-violet-400",
    icon: "from-violet-400 to-purple-500",
    bg: "bg-violet-500/10",
  },
};

// ============================================================================
// 3D TILT FEATURE CARD
// ============================================================================
const FeatureCard3D = memo(function FeatureCard3D({
  feature,
  index,
}: {
  feature: LandingFeature;
  index: number;
}) {
  const IconComponent = iconMap[feature.icon] || Sparkles;
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Spring physics for smooth animation
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), springConfig);
  
  // Glow position
  const glowX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Get color scheme based on category
  const getColors = () => {
    const category = feature.category?.toLowerCase() || "";
    if (category.includes("image") || category.includes("visual")) return categoryColors.image;
    if (category.includes("video")) return categoryColors.video;
    if (category.includes("chat")) return categoryColors.chat;
    if (category.includes("ai")) return categoryColors.ai;
    if (category.includes("security")) return categoryColors.security;
    if (category.includes("infrastructure")) return categoryColors.infrastructure;
    return categoryColors.default;
  };

  const colors = getColors();

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      whileHover={{ scale: 1.02, z: 50 }}
      className="group relative cursor-pointer"
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${colors.glow}, transparent 60%)`,
        }}
      />
      
      {/* Main card */}
      <div className={cn(
        "relative h-full rounded-2xl overflow-hidden",
        "bg-white dark:bg-slate-900/80",
        "border border-slate-200/80 dark:border-slate-700/50",
        "shadow-xl shadow-slate-200/50 dark:shadow-black/20",
        "backdrop-blur-xl",
        "transition-all duration-500",
        "group-hover:border-transparent"
      )}>
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={cn(
            "absolute inset-0 rounded-2xl",
            "bg-gradient-to-br",
            colors.gradient
          )} />
          <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-slate-900/95" />
        </div>

        {/* Mesh gradient background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, ${colors.glow.replace('0.4', '0.15')}, transparent 50%),
                radial-gradient(ellipse at 80% 80%, ${colors.glow.replace('0.4', '0.1')}, transparent 50%)
              `,
            }}
          />
        </div>

        {/* Card content */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex flex-col">
          {/* Media Section - Image or Video */}
          {feature.imageUrl && feature.mediaType && feature.mediaType !== "none" && (
            <div className="mb-4 sm:mb-5 -mx-5 sm:-mx-6 md:-mx-8 -mt-5 sm:-mt-6 md:-mt-8 rounded-t-2xl overflow-hidden">
              {feature.mediaType === "video" ? (
                <video
                  src={feature.imageUrl}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover"
                />
              )}
            </div>
          )}

          {/* Top row: Icon + Badge */}
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            {/* Floating icon with glow */}
            <motion.div
              style={{ transform: "translateZ(30px)" }}
              className="relative"
            >
              {/* Icon glow */}
              <div className={cn(
                "absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500",
                "bg-gradient-to-br",
                colors.icon
              )} />
              
              <div className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center",
                "bg-gradient-to-br",
                colors.icon,
                "shadow-lg",
                "group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
              )}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>
            </motion.div>

            {/* Badge */}
            {feature.badge && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={cn(
                  "px-3 py-1.5 rounded-full",
                  "bg-gradient-to-r",
                  colors.gradient,
                  "text-white text-xs font-bold",
                  "shadow-lg",
                  "animate-pulse"
                )}
              >
                {feature.badge}
              </motion.div>
            )}
          </div>

          {/* Title with gradient on hover */}
          <motion.h3
            style={{ transform: "translateZ(20px)" }}
            className={cn(
              "text-lg sm:text-xl md:text-2xl font-bold font-heading mb-2 sm:mb-3",
              "text-slate-900 dark:text-white",
              "transition-all duration-300"
            )}
          >
            <span className="bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                // @ts-ignore
                "--tw-gradient-from": colors.gradient.split(" ")[0].replace("from-", "var(--"),
              }}
            >
              {feature.title}
            </span>
          </motion.h3>

          {/* Description */}
          <motion.p
            style={{ transform: "translateZ(10px)" }}
            className="text-slate-600 dark:text-slate-400 leading-relaxed flex-1 text-xs sm:text-sm md:text-base font-display"
          >
            {feature.description}
          </motion.p>

          {/* Bottom action */}
          <Link
            href="/platform"
            className={cn(
              "mt-4 sm:mt-6 inline-flex items-center gap-2",
              "text-xs sm:text-sm font-semibold",
              "text-slate-400 dark:text-slate-500",
              colors.text.replace("text-", "group-hover:text-"),
              "transition-colors duration-300",
              "hover:gap-3"
            )}
          >
            <span>Explore feature</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          {/* Decorative corner accent */}
          <div className={cn(
            "absolute -bottom-8 -right-8 w-32 h-32 rounded-full",
            "opacity-0 group-hover:opacity-30 transition-opacity duration-500",
            "bg-gradient-to-br",
            colors.gradient,
            "blur-2xl"
          )} />
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// ANIMATED SECTION HEADER
// ============================================================================
function SectionHeader({ 
  title, 
  subtitle,
  titleFont,
  titleFontSize
}: { 
  title: string; 
  subtitle: string;
  titleFont?: string;
  titleFontSize?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: customEase }}
      className="text-center mb-10 sm:mb-16 md:mb-24"
    >
      {/* Animated badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 relative overflow-hidden group cursor-default"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 animate-gradient-x" />
        <div className="absolute inset-0 border border-violet-500/30 dark:border-violet-400/20 rounded-full" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400 relative z-10 animate-pulse" />
        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 relative z-10">
          Powerful Features
        </span>
      </motion.div>

      {/* Main title with gradient */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8, ease: customEase }}
        className={cn(
          "font-bold font-heading tracking-tight",
          "leading-[1.1] mb-4 sm:mb-6 px-2"
        )}
        style={{
          fontFamily: titleFont || 'var(--font-space-grotesk), Space Grotesk, Inter',
          fontSize: `clamp(1.5rem, 5vw, ${titleFontSize || '36'}px)`
        }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white/60">
          {title}
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8, ease: customEase }}
        className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed px-2 font-display"
      >
        {subtitle}
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8, ease: customEase }}
        className="mt-8 sm:mt-10 mx-auto w-16 sm:w-24 h-1 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"
      />
    </motion.div>
  );
}

// ============================================================================
// DEFAULT FEATURES (fallback)
// ============================================================================
const defaultFeatures: LandingFeature[] = [
  {
    id: "1",
    title: "AI Image Generation",
    description: "Create stunning visuals with state-of-the-art diffusion models. Generate photos, illustrations, and art in seconds.",
    icon: "ImageIcon",
    color: "violet",
    bgColor: "violet",
    badge: "Most Popular",
    imageUrl: null,
    mediaType: "none",
    order: 1,
    category: "image",
  },
  {
    id: "2",
    title: "Video Creation",
    description: "Transform text into cinematic videos. Create product demos, social content, and more with AI-powered video generation.",
    icon: "Video",
    color: "blue",
    bgColor: "blue",
    badge: "New",
    imageUrl: null,
    mediaType: "none",
    order: 2,
    category: "video",
  },
  {
    id: "3",
    title: "Intelligent Chatbots",
    description: "Deploy custom AI assistants that understand context, provide accurate answers, and learn from interactions.",
    icon: "MessageSquare",
    color: "emerald",
    bgColor: "emerald",
    badge: null,
    imageUrl: null,
    mediaType: "none",
    order: 3,
    category: "chat",
  },
  {
    id: "4",
    title: "Multi-Model Support",
    description: "Access GPT-4, Claude, Gemini, Stable Diffusion, and more through a unified API. Switch providers instantly.",
    icon: "Brain",
    color: "purple",
    bgColor: "purple",
    badge: "Pro",
    imageUrl: null,
    mediaType: "none",
    order: 4,
    category: "ai",
  },
  {
    id: "5",
    title: "Enterprise Security",
    description: "SOC 2 compliant infrastructure with end-to-end encryption, SSO support, and granular access controls.",
    icon: "Shield",
    color: "slate",
    bgColor: "slate",
    badge: null,
    imageUrl: null,
    mediaType: "none",
    order: 5,
    category: "security",
  },
  {
    id: "6",
    title: "Global CDN",
    description: "Lightning-fast content delivery across 200+ edge locations. Sub-50ms latency worldwide.",
    icon: "Globe",
    color: "cyan",
    bgColor: "cyan",
    badge: null,
    imageUrl: null,
    mediaType: "none",
    order: 6,
    category: "infrastructure",
  },
];

// ============================================================================
// MAIN FEATURES SECTION 2026
// ============================================================================
export function FeaturesSection2026({ 
  features = defaultFeatures, 
  featureTitle = "Everything you need to build AI products",
  featureTitleFont,
  featureTitleFontSize
}: FeaturesSection2026Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Use provided features or fallback to default
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Complex background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        
        {/* Dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        
        {/* Large gradient orbs */}
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] opacity-30 dark:opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] opacity-20 dark:opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-20 dark:opacity-30"
          style={{
            background: 'radial-gradient(ellipse, rgba(34, 211, 238, 0.2) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Animated gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader 
          title={featureTitle}
          subtitle="Transform your ideas into reality with our comprehensive suite of AI-powered tools designed for the next generation of creators."
          titleFont={featureTitleFont}
          titleFontSize={featureTitleFontSize}
        />

        {/* Features Grid - 3D perspective container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          style={{ perspective: "1200px" }}
        >
          {displayFeatures.slice(0, 6).map((feature, index) => (
            <FeatureCard3D
              key={feature.id}
              feature={feature}
              index={index}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8, ease: customEase }}
          className="mt-10 sm:mt-16 md:mt-20 text-center"
        >
          <Link 
            href="/platform"
            className={cn(
              "inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl",
              "text-sm sm:text-base font-semibold",
              "text-white",
              "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600",
              "hover:from-violet-500 hover:via-fuchsia-500 hover:to-violet-500",
              "shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40",
              "transition-all duration-300 group",
              "relative overflow-hidden"
            )}
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <span className="relative z-10">Discover all features</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {/* Secondary link */}
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
            or{" "}
            <a href="/contact" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
              talk to our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection2026;
