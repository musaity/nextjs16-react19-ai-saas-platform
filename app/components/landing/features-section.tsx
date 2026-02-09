"use client";

import { memo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  MessageSquare, 
  Bot,
  Palette,
  Layers,
  ArrowRight,
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
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./shared-components";

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
  order: number;
  category: string;
}

interface FeaturesSectionProps {
  features: LandingFeature[];
  featureTitle?: string;
}

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
// BENTO FEATURE CARD - Individual feature card
// ============================================================================
const BentoFeatureCard = memo(function BentoFeatureCard({
  feature,
  size = "default",
}: {
  feature: LandingFeature;
  size?: "default" | "large" | "wide";
}) {
  const IconComponent = iconMap[feature.icon] || Sparkles;

  const sizeStyles = {
    default: "col-span-1 row-span-1",
    large: "col-span-1 md:col-span-2 row-span-2",
    wide: "col-span-1 md:col-span-2 row-span-1",
  };

  return (
    <div
      className={cn(
        "group relative rounded-3xl p-6 md:p-8 overflow-hidden",
        "bg-slate-100/80 dark:bg-white/[0.02]",
        "border border-slate-200 dark:border-white/[0.05]",
        "hover:bg-slate-200/80 dark:hover:bg-white/[0.04]",
        "hover:border-violet-500/30 dark:hover:border-violet-500/20",
        "transition-all duration-500",
        "cursor-pointer",
        sizeStyles[size]
      )}
    >
      {/* Gradient Overlay on Hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5"
      )} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Icon */}
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
          "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
          "border border-violet-500/20",
          "group-hover:scale-110 group-hover:border-violet-500/40",
          "transition-all duration-300"
        )}>
          <IconComponent className="w-7 h-7 text-violet-500" />
        </div>

        {/* Badge */}
        {feature.badge && (
          <div className={cn(
            "inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full mb-4",
            "bg-violet-500/10 border border-violet-500/20",
            "text-xs font-semibold text-violet-500"
          )}>
            <Zap className="w-3 h-3" />
            {feature.badge}
          </div>
        )}

        {/* Title & Description */}
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-violet-500 transition-colors">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed flex-1">
          {feature.description}
        </p>

        {/* Learn More Link */}
        <div className={cn(
          "mt-6 flex items-center gap-2 text-sm font-semibold",
          "text-violet-500 opacity-0 group-hover:opacity-100",
          "translate-y-2 group-hover:translate-y-0",
          "transition-all duration-300"
        )}>
          Learn more
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Decorative Elements */}
      {size === "large" && (
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-3xl pointer-events-none" />
      )}
    </div>
  );
});

// ============================================================================
// MAIN BENTO GRID - Feature layout
// ============================================================================
const BentoGrid = memo(function BentoGrid({ features }: { features: LandingFeature[] }) {
  // Use default features if none provided
  const displayFeatures = features.length > 0 ? features : [
    {
      id: "1",
      title: "AI Image Generation",
      description: "Create stunning, photorealistic images from text descriptions using state-of-the-art AI models.",
      icon: "Image",
      color: "violet",
      bgColor: "violet",
      badge: "Most Popular",
      imageUrl: null,
      order: 1,
      category: "creation",
    },
    {
      id: "2",
      title: "Intelligent Chat",
      description: "Have natural conversations with advanced AI assistants that understand context and nuance.",
      icon: "MessageSquare",
      color: "emerald",
      bgColor: "emerald",
      badge: null,
      imageUrl: null,
      order: 2,
      category: "chat",
    },
    {
      id: "3",
      title: "Video Creation",
      description: "Transform images and ideas into captivating videos with AI-powered motion and effects.",
      icon: "Video",
      color: "orange",
      bgColor: "orange",
      badge: "New",
      imageUrl: null,
      order: 3,
      category: "creation",
    },
    {
      id: "4",
      title: "Multi-Model Access",
      description: "Access 15+ AI models including GPT-4, DALL·E 3, Claude, Gemini, and more - all in one place.",
      icon: "Layers",
      color: "purple",
      bgColor: "purple",
      badge: null,
      imageUrl: null,
      order: 4,
      category: "platform",
    },
    {
      id: "5",
      title: "Enterprise Security",
      description: "Bank-grade encryption, SSO support, and compliance certifications for peace of mind.",
      icon: "Shield",
      color: "cyan",
      bgColor: "cyan",
      badge: null,
      imageUrl: null,
      order: 5,
      category: "platform",
    },
    {
      id: "6",
      title: "Global CDN",
      description: "Lightning-fast delivery worldwide with our distributed edge network infrastructure.",
      icon: "Globe",
      color: "pink",
      bgColor: "pink",
      badge: null,
      imageUrl: null,
      order: 6,
      category: "platform",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {displayFeatures.slice(0, 6).map((feature, idx) => (
        <BentoFeatureCard
          key={feature.id}
          feature={feature}
          size={idx === 0 ? "large" : "default"}
        />
      ))}
    </div>
  );
});

// ============================================================================
// CAPABILITIES STRIP - Quick feature highlights
// ============================================================================
const CapabilitiesStrip = memo(function CapabilitiesStrip() {
  const capabilities = [
    { icon: ImageIcon, label: "Image Generation" },
    { icon: Video, label: "Video Creation" },
    { icon: MessageSquare, label: "AI Chat" },
    { icon: Bot, label: "Custom Assistants" },
    { icon: Palette, label: "Style Transfer" },
    { icon: Layers, label: "Multi-Model" },
  ];

  return (
    <div className="mt-16 overflow-hidden">
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.label}
              className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-2xl",
                "bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]",
                "hover:bg-slate-200/80 dark:hover:bg-white/[0.06] hover:border-violet-500/30",
                "transition-all duration-300 cursor-pointer"
              )}
            >
              <Icon className="w-5 h-5 text-violet-500" />
              <span className="text-sm font-medium text-foreground">{cap.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN FEATURES SECTION
// ============================================================================
export function FeaturesSection({ features, featureTitle }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Features"
          badgeIcon={<Sparkles className="w-4 h-4" />}
          title={featureTitle?.split(" ")[0] || "Powerful"}
          highlightedText={featureTitle?.split(" ").slice(1).join(" ") || "AI Capabilities"}
          description="Everything you need to bring your creative visions to life, powered by the world's most advanced AI models."
        />

        <BentoGrid features={features} />

        <CapabilitiesStrip />

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/platform"
            className={cn(
              "inline-flex items-center gap-3 px-8 py-4 rounded-2xl",
              "bg-gradient-to-r from-violet-600 to-purple-600",
              "text-white font-semibold",
              "shadow-lg shadow-violet-500/25",
              "hover:shadow-xl hover:shadow-violet-500/30",
              "hover:scale-[1.02] active:scale-[0.98]",
              "transition-all duration-200"
            )}
          >
            Explore All Features
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
