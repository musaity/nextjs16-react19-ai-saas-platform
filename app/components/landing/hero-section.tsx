"use client";

import { useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  Star, 
  Zap, 
  Image as ImageIcon,
  Video,
  MessageSquare,
  Check,
  MousePointer2,
  Wand2,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
interface BrandingData {
  logoUrl: string | null;
  darkLogoUrl: string | null;
  brandName: string;
  heroTitle: string;
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
}

interface HeroSectionProps {
  branding: BrandingData;
}

// ============================================================================
// ANIMATED COUNTER
// ============================================================================
const AnimatedCounter = memo(function AnimatedCounter({ 
  value, 
  suffix = "" 
}: { 
  value: string; 
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    const numericPart = value.replace(/[^0-9.]/g, "");
    const target = parseFloat(numericPart) || 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        const formatted = current >= 1000 
          ? `${(current / 1000).toFixed(1)}K` 
          : Math.floor(current).toString();
        setDisplayValue(formatted + suffix);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, suffix]);
  
  return <span>{displayValue}</span>;
});

// ============================================================================
// LIVE DEMO CARD - Interactive showcase with real-time simulation
// ============================================================================
const LiveDemoCard = memo(function LiveDemoCard() {
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");
  
  const demos = [
    {
      id: "image",
      label: "Image",
      icon: ImageIcon,
      prompt: "A futuristic city at sunset with flying cars and neon lights",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-500/20",
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
      prompt: "Explain quantum computing in simple terms",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/20",
    },
    {
      id: "video",
      label: "Video",
      icon: Video,
      prompt: "Create a cinematic product showcase animation",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/20",
    },
  ];

  // Auto-rotate tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % demos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [demos.length]);

  // Typing effect
  useEffect(() => {
    const prompt = demos[activeTab].prompt;
    setTypedText("");
    setIsGenerating(false);
    setProgress(0);
    
    let charIndex = 0;
    const typingTimer = setInterval(() => {
      if (charIndex < prompt.length) {
        setTypedText(prompt.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingTimer);
        setIsGenerating(true);
      }
    }, 40);
    
    return () => clearInterval(typingTimer);
  }, [activeTab]);

  // Progress simulation
  useEffect(() => {
    if (isGenerating) {
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsGenerating(false);
            clearInterval(progressTimer);
            return 100;
          }
          return prev + 4;
        });
      }, 80);
      return () => clearInterval(progressTimer);
    }
  }, [isGenerating]);

  const currentDemo = demos[activeTab];
  const Icon = currentDemo.icon;

  return (
    <div className={cn(
      "relative w-full max-w-3xl mx-auto",
      "rounded-3xl overflow-hidden",
      "bg-gray-950/90",
      "border border-white/10",
      "shadow-2xl shadow-violet-500/10",
      "backdrop-blur-xl"
    )}>
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-white/60 font-medium">AI Studio Live</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-3 border-b border-white/5">
        {demos.map((demo, idx) => {
          const TabIcon = demo.icon;
          return (
            <button
              key={demo.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === idx
                  ? cn("bg-gradient-to-r text-white", demo.color)
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              )}
            >
              <TabIcon className="w-4 h-4" />
              {demo.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Prompt Input */}
        <div className={cn(
          "relative flex items-start gap-4 px-5 py-4 rounded-2xl mb-6",
          "bg-white/5 border border-white/10"
        )}>
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br",
            currentDemo.color
          )}>
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-h-[48px]">
            <p className="text-white/90 text-sm leading-relaxed">
              {typedText}
              <span className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 animate-pulse" />
            </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className={cn(
          "relative aspect-[16/9] rounded-2xl overflow-hidden",
          currentDemo.bgColor
        )}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50",
              currentDemo.color
            )} />
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 40%)
                `,
              }}
            />
          </div>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-24 h-24 rounded-3xl flex items-center justify-center",
              "bg-white/10 backdrop-blur-xl border border-white/20",
              "shadow-2xl",
              isGenerating && "animate-pulse"
            )}>
              <Icon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          {(isGenerating || progress > 0) && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
                <Cpu className={cn(
                  "w-5 h-5 text-violet-400",
                  isGenerating && "animate-spin"
                )} />
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-100",
                        "bg-gradient-to-r",
                        currentDemo.color
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-white/60 font-medium min-w-[3rem] text-right">
                  {progress}%
                </span>
              </div>
            </div>
          )}

          {/* Complete Badge */}
          {!isGenerating && progress === 100 && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 shadow-lg">
              <Check className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">Generated!</span>
            </div>
          )}

          {/* Model Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-xl border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-white/80 font-medium">
              {activeTab === 0 ? "DALL·E 3" : activeTab === 1 ? "GPT-4o" : "Kling AI"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// STATS BAR - Animated statistics
// ============================================================================
const StatsBar = memo(function StatsBar() {
  const stats = [
    { value: "2M+", label: "Creations", icon: Sparkles },
    { value: "50K+", label: "Creators", icon: Star },
    { value: "15", label: "AI Models", icon: Cpu },
    { value: "99.9%", label: "Uptime", icon: Zap },
  ];

  return (
    <div className="mt-16 lg:mt-24">
      <div className={cn(
        "relative mx-auto max-w-4xl rounded-2xl p-[1px]",
        "bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-fuchsia-500/50"
      )}>
        <div className={cn(
          "rounded-2xl p-8 md:p-10",
          "bg-background/95 backdrop-blur-xl"
        )}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4",
                    "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
                    "border border-violet-500/20",
                    "group-hover:scale-110 group-hover:border-violet-500/40",
                    "transition-all duration-300"
                  )}>
                    <StatIcon className="w-6 h-6 text-violet-500" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
        {[
          { icon: Star, label: "4.9/5 on Product Hunt", stars: true },
          { icon: Zap, label: "No Credit Card Required" },
          { icon: Check, label: "Cancel Anytime" },
        ].map((badge) => (
          <div
            key={badge.label}
            className={cn(
              "flex items-center gap-2.5 px-5 py-2.5 rounded-full",
              "bg-white/5 border border-white/10",
              "hover:bg-white/10 hover:border-white/20",
              "transition-all duration-200"
            )}
          >
            {badge.stars ? (
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            ) : (
              <badge.icon className="w-4 h-4 text-violet-500" />
            )}
            <span className="text-sm text-muted-foreground font-medium">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN HERO COMPONENT - 2026 Vision
// ============================================================================
export function HeroSection({ branding }: HeroSectionProps) {
  const heroTitleLines = branding.heroTitle.split("\n").filter(Boolean);
  const mainTitle = heroTitleLines[0] || "Create with AI";
  const subWords = heroTitleLines.length > 1 
    ? heroTitleLines.slice(1).join(" ").split(" ").filter(Boolean)
    : ["Images", "Videos", "Conversations"];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-28 md:pt-36 pb-20 overflow-hidden">
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8",
              "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
              "border border-violet-500/20",
              "animate-fade-in"
            )}
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span 
              className="font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent"
              style={{
                fontFamily: branding.heroBadgeFont || 'Inter',
                fontSize: `${branding.heroBadgeFontSize || '14'}px`
              }}
            >
              {branding.heroBadge || "Next-Generation AI Platform"}
            </span>
          </div>

          {/* Main Title */}
          <h1 
            className="font-bold tracking-tight mb-8"
            style={{
              fontFamily: branding.heroTitleFont || 'Inter',
              fontSize: `clamp(1.875rem, 5vw, ${branding.heroTitleFontSize || '48'}px)`
            }}
          >
            <span className="block text-foreground mb-3">{mainTitle}</span>
            <span className="block">
              {subWords.map((word, idx) => (
                <span
                  key={`${word}-${idx}`}
                  className={cn(
                    "inline-block",
                    idx < subWords.length - 1 && "mr-4 md:mr-6",
                    idx === 0 && "bg-gradient-to-r from-violet-600 to-violet-500 dark:from-violet-400 dark:to-violet-500 bg-clip-text text-transparent",
                    idx === 1 && "bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent",
                    idx === 2 && "bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-fuchsia-500 bg-clip-text text-transparent"
                  )}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Description */}
          <p 
            className="text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{
              fontFamily: branding.heroSubtitleFont || 'Inter',
              fontSize: `${branding.heroSubtitleFontSize || '18'}px`
            }}
          >
            {branding.heroDescription || "The most powerful AI creative suite. Generate stunning images, create videos, and have intelligent conversations - all in one beautiful platform."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/platform/studio"
              className={cn(
                "group relative inline-flex items-center gap-3 px-8 py-4 text-base font-semibold rounded-2xl",
                "bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-[length:200%_100%]",
                "text-white shadow-xl shadow-violet-500/25",
                "hover:shadow-2xl hover:shadow-violet-500/30",
                "hover:bg-[position:100%_0]",
                "active:scale-[0.98]",
                "transition-all duration-300"
              )}
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#features"
              className={cn(
                "group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold rounded-2xl",
                "bg-white/5 border border-white/10",
                "text-foreground",
                "hover:bg-white/10 hover:border-violet-500/30",
                "active:scale-[0.98]",
                "transition-all duration-200"
              )}
            >
              <Play className="w-5 h-5 text-violet-500" />
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Live Demo Card */}
        <div className="mt-20 lg:mt-24">
          <LiveDemoCard />
        </div>

        {/* Stats Bar */}
        <StatsBar />
      </div>
    </section>
  );
}
