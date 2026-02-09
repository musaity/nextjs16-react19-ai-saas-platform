"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, Zap, Image as ImageIcon, Video, MessageSquare, Bot, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
interface BrandingData {
  logoUrl: string | null;
  darkLogoUrl: string | null;
  brandName: string;
  heroTitle: string;
  heroHighlight?: string;
  heroDescription: string;
  heroBadge: string;
  heroBadgeFont?: string;
  heroBadgeFontSize?: string;
  heroTitleFont?: string;
  heroTitleFontSize?: string;
  heroSubtitleFont?: string;
  heroSubtitleFontSize?: string;
  featureTitle: string;
  featureTitleFont?: string;
  featureTitleFontSize?: string;
  demoMediaUrl?: string | null;
  demoMediaType?: string;
  // Hero CTA & Stats
  heroPrimaryButtonText?: string;
  heroPrimaryButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroStats?: { value: string; label: string }[];
  trustedByEnabled?: boolean;
  trustedByTitle?: string;
  trustedByCompanies?: string[];
}

interface HeroSection2026Props {
  branding: BrandingData;
}

// ============================================================================
// ANIMATION VARIANTS - Custom ease curve [0.16, 1, 0.3, 1]
// ============================================================================
const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: customEase,
    },
  },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: customEase,
    },
  },
};

// ============================================================================
// GEOMETRIC GRID BACKGROUND
// ============================================================================
function GeometricGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Geometric Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] animate-grid-fade"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(139, 92, 246) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(139, 92, 246) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial fade mask - Light mode uses lighter gradient */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-50 dark:to-black"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, transparent 30%, var(--grid-fade-color, black) 100%)',
        }}
      />
      {/* Extra fade at bottom */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-black"
      />
    </div>
  );
}

// ============================================================================
// AMBIENT GLOW EFFECTS
// ============================================================================
function AmbientGlows() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary purple glow - top center */}
      <div
        className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[min(800px,100vw)] h-[min(600px,80vw)] rounded-full opacity-40 dark:opacity-100"
        style={{
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Blue glow - right side */}
      <div
        className="absolute top-1/4 -right-[10%] w-[min(500px,70vw)] h-[min(500px,70vw)] rounded-full opacity-40 dark:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Subtle pink glow - left side */}
      <div
        className="absolute top-1/3 -left-[10%] w-[min(400px,60vw)] h-[min(400px,60vw)] rounded-full opacity-40 dark:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

// ============================================================================
// PULSING BADGE
// ============================================================================
function PulsingBadge({ text, font, fontSize }: { text: string; font?: string; fontSize?: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
        "border border-violet-500/20 dark:border-violet-500/20",
        "backdrop-blur-sm",
        "relative overflow-hidden group cursor-pointer",
        "hover:border-violet-500/40 transition-colors duration-300"
      )}
    >
      {/* Animated border shine */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
          backgroundSize: '200% 100%',
          animation: 'border-shine 2s linear infinite',
        }}
      />
      
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
      </span>
      
      <span 
        className="relative font-medium text-violet-600 dark:text-violet-300"
        style={{
          fontFamily: font || 'Inter',
          fontSize: `${fontSize || '14'}px`
        }}
      >
        {text}
      </span>
      
      <ChevronRight className="w-4 h-4 text-violet-500 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
    </motion.div>
  );
}

// ============================================================================
// SHINY BUTTON WITH ROTATING CONIC GRADIENT
// ============================================================================
function ShinyButton({ 
  children, 
  href,
  variant = "primary"
}: { 
  children: React.ReactNode; 
  href: string;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <Link
        href={href}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 w-full sm:w-auto",
          "text-sm sm:text-base font-semibold",
          "text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white",
          "bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10",
          "border border-slate-300 hover:border-slate-400 dark:border-white/10 dark:hover:border-white/20",
          "rounded-xl",
          "transition-all duration-300",
          "group"
        )}
      >
        <Play className="w-4 h-4 fill-current" />
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className="relative inline-flex group w-full sm:w-auto">
      {/* Rotating gradient border */}
      <div 
        className="absolute -inset-[1px] rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #8b5cf6, #ec4899, #8b5cf6)',
          animation: 'rotate-gradient 3s linear infinite',
        }}
      />
      
      {/* Inner button */}
      <div className={cn(
        "relative inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 w-full",
        "text-sm sm:text-base font-semibold text-white",
        "bg-slate-900 dark:bg-black rounded-xl",
        "transition-all duration-300",
        "group-hover:bg-slate-800 dark:group-hover:bg-black/80"
      )}>
        <Sparkles className="w-4 h-4" />
        {children}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </Link>
  );
}

// ============================================================================
// 3D PERSPECTIVE DASHBOARD
// ============================================================================
function Dashboard3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring animation for scroll-based rotation
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [12, 0]),
    springConfig
  );
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0.95, 1]),
    springConfig
  );

  return (
    <motion.div
      ref={containerRef}
      variants={fadeInScale}
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6"
      style={{
        perspective: "1500px",
      }}
    >
      {/* Glow behind dashboard */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        style={{
          rotateX,
          scale,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "bg-white/80 dark:bg-zinc-950/80",
          "border border-slate-200 dark:border-white/10",
          "shadow-2xl shadow-violet-500/10 dark:shadow-violet-500/20",
          "backdrop-blur-xl"
        )}
      >
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-white/50 font-medium">enhancenix.ai/studio</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: "API Calls", value: "2.4M", change: "+12%" },
              { label: "Active Users", value: "18K", change: "+8%" },
              { label: "Revenue", value: "$124K", change: "+24%" },
              { label: "Uptime", value: "99.9%", change: "" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: customEase }}
                className="p-3 sm:p-4 rounded-xl bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5"
              >
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-white/40 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                  {stat.change && (
                    <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* AI Generation Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: customEase }}
              className="sm:col-span-2 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/20">
                    <Sparkles className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Generation</h3>
                    <p className="text-xs text-slate-500 dark:text-white/40">Real-time processing</p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  Live
                </div>
              </div>
              
              {/* Animated generation preview */}
              <div className="aspect-video rounded-lg bg-slate-200/50 dark:bg-black/40 border border-slate-300 dark:border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center animate-pulse">
                    <ImageIcon className="w-8 h-8 text-violet-500 dark:text-violet-400" />
                  </div>
                </div>
                {/* Animated scan line */}
                <div 
                  className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                  style={{
                    animation: 'scan-line 2s ease-in-out infinite',
                    top: '50%',
                  }}
                />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: customEase }}
              className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3 sm:gap-0"
            >
              {[
                { icon: ImageIcon, label: "Image Gen", color: "violet" },
                { icon: Video, label: "Video AI", color: "blue" },
                { icon: MessageSquare, label: "Chat Bot", color: "emerald" },
                { icon: Bot, label: "Assistants", color: "orange" },
              ].map((action, i) => (
                <div
                  key={action.label}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl",
                    "bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5",
                    "hover:bg-slate-200/50 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/10 transition-all cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    action.color === "violet" && "bg-violet-500/20",
                    action.color === "blue" && "bg-blue-500/20",
                    action.color === "emerald" && "bg-emerald-500/20",
                    action.color === "orange" && "bg-orange-500/20",
                  )}>
                    <action.icon className={cn(
                      "w-4 h-4",
                      action.color === "violet" && "text-violet-500 dark:text-violet-400",
                      action.color === "blue" && "text-blue-500 dark:text-blue-400",
                      action.color === "emerald" && "text-emerald-500 dark:text-emerald-400",
                      action.color === "orange" && "text-orange-500 dark:text-orange-400",
                    )} />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-white/70">{action.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// FLOATING PARTICLES
// ============================================================================
// Pre-computed particle positions to avoid hydration mismatch
const particlePositions = [
  { left: 12, top: 8, duration: 6.2, delay: 0.5 },
  { left: 85, top: 15, duration: 7.8, delay: 1.2 },
  { left: 45, top: 22, duration: 5.5, delay: 2.8 },
  { left: 78, top: 35, duration: 8.1, delay: 0.3 },
  { left: 23, top: 42, duration: 6.9, delay: 3.5 },
  { left: 92, top: 55, duration: 7.2, delay: 1.8 },
  { left: 8, top: 68, duration: 5.8, delay: 4.2 },
  { left: 67, top: 75, duration: 8.5, delay: 2.1 },
  { left: 35, top: 82, duration: 6.4, delay: 0.9 },
  { left: 55, top: 90, duration: 7.6, delay: 3.3 },
  { left: 18, top: 28, duration: 5.3, delay: 1.5 },
  { left: 72, top: 48, duration: 8.8, delay: 4.7 },
  { left: 42, top: 62, duration: 6.1, delay: 2.4 },
  { left: 88, top: 78, duration: 7.4, delay: 0.7 },
  { left: 5, top: 45, duration: 5.9, delay: 3.9 },
  { left: 62, top: 12, duration: 8.3, delay: 1.1 },
  { left: 28, top: 58, duration: 6.7, delay: 4.4 },
  { left: 95, top: 32, duration: 7.1, delay: 2.6 },
  { left: 15, top: 88, duration: 5.6, delay: 0.2 },
  { left: 82, top: 95, duration: 8.0, delay: 3.1 },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particlePositions.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-500/20 dark:bg-violet-500/30"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// TRUSTED BY LOGOS
// ============================================================================
function TrustedBy({ 
  enabled = true, 
  title = "Trusted by teams at", 
  companies = ["Vercel", "Linear", "Raycast", "Notion", "Figma", "Stripe"] 
}: { 
  enabled?: boolean; 
  title?: string; 
  companies?: string[]; 
}) {
  if (!enabled) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: customEase }}
      className="flex flex-col items-center gap-6 pt-16"
    >
      <p className="text-sm text-slate-400 dark:text-white/30 uppercase tracking-wider">
        {title}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {companies.map((company) => (
          <div
            key={company}
            className="text-lg font-semibold text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-white/40 transition-colors cursor-default"
          >
            {company}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// DEMO MODAL - Popup for video/image demo (Portal-based for proper centering)
// ============================================================================
function DemoModal({ 
  isOpen, 
  onClose, 
  mediaUrl, 
  mediaType 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  mediaUrl?: string | null; 
  mediaType?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const scrollYRef = useRef(0);

  // Ensure we only render portal on client + set dvh variable
  useEffect(() => {
    setMounted(true);
    
    // Set --dvh CSS variable for proper mobile viewport height
    const setDvh = () => {
      const dvh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
    };
    setDvh();
    window.addEventListener('resize', setDvh);
    return () => window.removeEventListener('resize', setDvh);
  }, []);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Save scroll position and lock body
    scrollYRef.current = window.scrollY;
    const scrollY = scrollYRef.current;
    
    document.documentElement.style.setProperty('--scroll-y', `-${scrollY}px`);
    document.body.style.position = 'fixed';
    document.body.style.top = `var(--scroll-y)`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      // Restore body
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  // Check if it's a YouTube URL
  const isYouTube = mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be');
  const isVimeo = mediaUrl?.includes('vimeo.com');
  
  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/);
    return match ? match[1] : null;
  };

  const renderMedia = () => {
    if (!mediaUrl || mediaType === 'none') {
      return (
        <div className="flex items-center justify-center h-64 text-slate-400 dark:text-white/40">
          <p>No demo media available</p>
        </div>
      );
    }

    if (mediaType === 'video') {
      if (isYouTube) {
        const videoId = getYouTubeId(mediaUrl);
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
      if (isVimeo) {
        const videoId = getVimeoId(mediaUrl);
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
            className="w-full aspect-video rounded-lg"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }
      return (
        <video 
          src={mediaUrl} 
          controls 
          autoPlay 
          className="w-full rounded-lg"
          style={{ maxHeight: '75vh' }}
        />
      );
    }

    if (mediaType === 'image') {
      return (
        <img 
          src={mediaUrl} 
          alt="Demo" 
          className="w-full object-contain rounded-lg"
          style={{ maxHeight: '75vh' }}
        />
      );
    }

    return null;
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(var(--dvh, 1vh) * 100)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      } as React.CSSProperties}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* Modal box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '56rem',
          maxHeight: 'calc(var(--dvh, 1vh) * 85)',
          borderRadius: '1rem',
          overflow: 'hidden',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        } as React.CSSProperties}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 20,
            padding: '8px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.3)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          aria-label="Close demo"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Media container */}
        <div style={{ padding: '16px', overflow: 'auto', maxHeight: '85vh' }}>
          {renderMedia()}
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// ============================================================================
// MAIN HERO SECTION 2026
// ============================================================================
export function HeroSection2026({ branding }: HeroSection2026Props) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
    <section className="relative min-h-[100dvh] bg-slate-50 dark:bg-black overflow-hidden">
      {/* Background layers */}
      <GeometricGrid />
      <AmbientGlows />
      <FloatingParticles />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <PulsingBadge 
            text={branding.heroBadge || "v2.0 Now Live"} 
            font={branding.heroBadgeFont}
            fontSize={branding.heroBadgeFontSize}
          />

          {/* Main Title with gradient */}
          <motion.h1
            variants={itemVariants}
            className={cn(
              "mt-6 sm:mt-8 font-bold font-heading",
              "tracking-tight leading-[1.1]",
              "bg-clip-text text-transparent",
              "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-white dark:to-white/40"
            )}
            style={{
              fontFamily: branding.heroTitleFont || 'var(--font-space-grotesk), Space Grotesk, Inter',
              fontSize: `clamp(1.75rem, 6vw, ${branding.heroTitleFontSize || '48'}px)`
            }}
          >
            {branding.heroTitle || "Build AI Products"}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 dark:from-violet-400 dark:via-purple-400 dark:to-violet-400">
              {branding.heroHighlight || "Without Code"}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className={cn(
              "mt-4 sm:mt-6 max-w-2xl px-2 font-display",
              "text-slate-600 dark:text-white/50 leading-relaxed"
            )}
            style={{
              fontFamily: branding.heroSubtitleFont || 'var(--font-plus-jakarta), Plus Jakarta Sans, Inter',
              fontSize: `clamp(0.9375rem, 2.5vw, ${branding.heroSubtitleFontSize || '18'}px)`
            }}
          >
            {branding.heroDescription || "The complete no-code platform for launching AI-powered applications. Deploy image generation, video creation, and intelligent chatbots in minutes."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <ShinyButton href={branding.heroPrimaryButtonUrl || "/platform/studio"} variant="primary">
              {branding.heroPrimaryButtonText || "Start Building Free"}
            </ShinyButton>
            <button
              onClick={() => setShowDemo(true)}
              className={cn(
                "relative inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 w-full sm:w-auto",
                "text-sm sm:text-base font-semibold",
                "text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white",
                "bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10",
                "border border-slate-300 hover:border-slate-400 dark:border-white/10 dark:hover:border-white/20",
                "rounded-xl",
                "transition-all duration-300",
                "group"
              )}
            >
              <Play className="w-4 h-4 fill-current" />
              {branding.heroSecondaryButtonText || "Watch Demo"}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12"
          >
            {(branding.heroStats || [
              { value: "50K+", label: "Creators" },
              { value: "2M+", label: "AI Generations" },
              { value: "99.9%", label: "Uptime" },
            ]).map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-white/40">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* 3D Dashboard */}
          <motion.div
            variants={itemVariants}
            className="mt-12 sm:mt-16 md:mt-20 w-full"
          >
            <Dashboard3D />
          </motion.div>

          {/* Trusted By */}
          <TrustedBy 
            enabled={branding.trustedByEnabled !== false}
            title={branding.trustedByTitle}
            companies={branding.trustedByCompanies}
          />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-black to-transparent pointer-events-none" />

      {/* Add scan-line keyframe */}
      <style jsx global>{`
        @keyframes scan-line {
          0%, 100% {
            transform: translateY(-100px);
            opacity: 0;
          }
          50% {
            transform: translateY(100px);
            opacity: 1;
          }
        }
        
        /* CSS variable for grid fade based on theme */
        :root {
          --grid-fade-color: rgb(248 250 252);
        }
        .dark {
          --grid-fade-color: black;
        }
      `}</style>
    </section>

    {/* Demo Modal */}
    <DemoModal 
      isOpen={showDemo} 
      onClose={() => setShowDemo(false)}
      mediaUrl={branding.demoMediaUrl}
      mediaType={branding.demoMediaType}
    />
    </>
  );
}

export default HeroSection2026;
