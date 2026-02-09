"use client";

import { memo, useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Wand2,
  Scissors,
  ScanFace,
  MessageSquare,
  Send,
  Bot,
  Zap,
  ArrowRight,
  Sparkles,
  ImageIcon,
  Layers,
  History,
  Download,
  Play,
  Check,
} from "lucide-react";

// ============================================================================
// AI TOOLS SHOWCASE CARD
// ============================================================================
const tools = [
  {
    id: "upscale",
    label: "Image Upscaler",
    icon: ScanFace,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    description: "Enhance low-resolution images to 4K quality with AI super-resolution.",
    before: "480p",
    after: "4K Ultra HD",
  },
  {
    id: "remove-bg",
    label: "Background Remover",
    icon: Scissors,
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-500/20 via-rose-500/10 to-red-500/20",
    description: "Remove backgrounds from products or portraits with one click precision.",
    before: "With BG",
    after: "Transparent",
  },
  {
    id: "restore",
    label: "Face Restore",
    icon: Wand2,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/20 via-orange-500/10 to-red-500/20",
    description: "Fix blurry faces and restore old family photos to pristine quality.",
    before: "Damaged",
    after: "Restored",
  },
];

export const ToolsShowcaseCard = memo(function ToolsShowcaseCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tools.length);
      setIsProcessing(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => setIsProcessing(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, isProcessing]);

  const currentTool = tools[activeIndex];
  const Icon = currentTool.icon;

  return (
    <div className="relative w-full animate-fade-in-up">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "bg-white dark:bg-white/[0.04]",
          "border border-gray-200 dark:border-white/[0.05]",
          "shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground">AI Tools</span>
          </div>
          <div className="w-20" />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-gray-200 dark:border-white/[0.04]">
          {tools.map((tool, index) => {
            const TabIcon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveIndex(index);
                  setIsProcessing(true);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                  activeIndex === index
                    ? cn("bg-gradient-to-r text-white", tool.gradient)
                    : "text-gray-600 dark:text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                )}
              >
                <TabIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-5 md:p-8">
          {/* Tool Description */}
          <div
            className={cn(
              "flex items-start gap-4 p-4 rounded-2xl mb-5",
              "bg-gray-50 dark:bg-white/[0.03]",
              "border border-gray-200 dark:border-white/[0.05]"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 p-3 rounded-xl bg-gradient-to-br shadow-lg",
                currentTool.gradient
              )}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">
                {currentTool.label}
              </div>
              <div className="text-foreground text-sm md:text-base leading-relaxed">
                {currentTool.description}
              </div>
            </div>
          </div>

          {/* Preview Area - Before/After */}
          <div className="relative rounded-2xl overflow-hidden">
            <div
              className={cn(
                "aspect-[16/9] bg-gradient-to-br transition-colors duration-300",
                currentTool.bgGradient
              )}
            >
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, currentColor 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              {/* Before/After UI */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 md:gap-8 p-6">
                {/* Before */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center",
                      "bg-black/20 border-2 border-dashed border-white/20"
                    )}
                  >
                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-white/40" />
                  </div>
                  <span className="text-xs font-medium text-white/60 px-3 py-1 rounded-full bg-black/20">
                    {currentTool.before}
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-2">
                  {isProcessing ? (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r",
                        currentTool.gradient
                      )}
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">
                    {isProcessing ? "Processing..." : "Enhanced"}
                  </span>
                </div>

                {/* After */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isProcessing
                        ? "bg-black/20 border-2 border-dashed border-white/20"
                        : cn("bg-gradient-to-br border-2 border-white/30 shadow-2xl", currentTool.gradient)
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-8 h-8 md:w-10 md:h-10 transition-all duration-500",
                        isProcessing ? "text-white/40" : "text-white"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-3 py-1 rounded-full transition-all duration-500",
                      isProcessing ? "text-white/60 bg-black/20" : "text-white bg-emerald-500/80"
                    )}
                  >
                    {currentTool.after}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              {!isProcessing && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/90">
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">Completed in 1.2s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/platform/tools"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
            "bg-gradient-to-r from-amber-500 to-orange-600",
            "text-white shadow-lg shadow-amber-500/25",
            "hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02]",
            "transition-all duration-200"
          )}
        >
          <Wand2 className="w-4 h-4" />
          Try AI Tools Free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
});

// ============================================================================
// INTEGRATIONS SHOWCASE CARD
// ============================================================================
const integrations = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-500/20 via-emerald-500/10 to-teal-500/20",
  },
  {
    id: "telegram",
    name: "Telegram",
    color: "#0088cc",
    gradient: "from-blue-400 to-blue-500",
    bgGradient: "from-blue-400/20 via-cyan-500/10 to-sky-500/20",
  },
  {
    id: "discord",
    name: "Discord",
    color: "#5865F2",
    gradient: "from-indigo-500 to-indigo-600",
    bgGradient: "from-indigo-500/20 via-violet-500/10 to-purple-500/20",
  },
  {
    id: "slack",
    name: "Slack",
    color: "#E01E5A",
    gradient: "from-purple-500 to-fuchsia-500",
    bgGradient: "from-purple-500/20 via-fuchsia-500/10 to-pink-500/20",
  },
];

export const IntegrationsShowcaseCard = memo(function IntegrationsShowcaseCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const conversations = [
    { user: "Generate an image of a sunset over mountains", ai: "Here's your AI-generated sunset image! Created with DALL-E 3 in 2.3 seconds." },
    { user: "Summarize this article for me", ai: "Here's a concise summary of the key points from the article..." },
    { user: "Help me write a professional email", ai: "I've drafted a professional email for you. Feel free to customize it!" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % integrations.length);
      setMessages([]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMessages([]);
    const conv = conversations[activeIndex % conversations.length];

    // User message
    const userTimer = setTimeout(() => {
      setMessages([{ role: "user", text: conv.user }]);
      setIsTyping(true);
    }, 500);

    // AI response
    const aiTimer = setTimeout(() => {
      setMessages([
        { role: "user", text: conv.user },
        { role: "ai", text: conv.ai },
      ]);
      setIsTyping(false);
    }, 2500);

    return () => {
      clearTimeout(userTimer);
      clearTimeout(aiTimer);
    };
  }, [activeIndex]);

  const currentPlatform = integrations[activeIndex];

  return (
    <div className="relative w-full animate-fade-in-up">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "bg-white dark:bg-white/[0.04]",
          "border border-gray-200 dark:border-white/[0.05]",
          "shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">Multi-Platform AI</span>
          </div>
          <div className="w-20" />
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-gray-200 dark:border-white/[0.04] overflow-x-auto">
          {integrations.map((platform, index) => (
            <button
              key={platform.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                activeIndex === index
                  ? cn("bg-gradient-to-r text-white", platform.gradient)
                  : "text-gray-600 dark:text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/[0.04]"
              )}
            >
              <span className="hidden sm:inline">{platform.name}</span>
            </button>
          ))}
        </div>

        {/* Chat Preview */}
        <div className="p-5 md:p-8">
          <div
            className={cn(
              "rounded-2xl overflow-hidden transition-colors duration-300",
              "bg-gradient-to-br",
              // Light mode: darker gradients for visibility
              activeIndex === 0 ? "from-green-600 via-green-500 to-emerald-600" :
              activeIndex === 1 ? "from-blue-600 via-blue-500 to-cyan-600" :
              activeIndex === 2 ? "from-indigo-600 via-indigo-500 to-violet-600" :
              "from-purple-600 via-fuchsia-500 to-pink-600"
            )}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
                  currentPlatform.gradient
                )}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white text-sm">AI Assistant</div>
                <div className="text-xs text-white/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online on {currentPlatform.name}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3 min-h-[180px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                    msg.role === "user"
                      ? "ml-auto bg-white/20 text-white rounded-br-md"
                      : "bg-white/10 text-white/90 rounded-bl-md"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/10 w-fit">
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
                  disabled
                />
                <button
                  className={cn(
                    "p-2 rounded-lg bg-gradient-to-r",
                    currentPlatform.gradient
                  )}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/docs/integrations"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
            "bg-gradient-to-r from-indigo-500 to-purple-600",
            "text-white shadow-lg shadow-indigo-500/25",
            "hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]",
            "transition-all duration-200"
          )}
        >
          <Zap className="w-4 h-4" />
          Setup Integrations
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
});

// ============================================================================
// GALLERY & HISTORY SHOWCASE CARD
// ============================================================================
const galleryImages = [
  { id: 1, gradient: "from-violet-500 to-purple-600", title: "Cosmic Nebula", model: "DALL-E 3", time: "2h ago" },
  { id: 2, gradient: "from-blue-500 to-cyan-600", title: "Ocean Sunset", model: "Midjourney", time: "4h ago" },
  { id: 3, gradient: "from-pink-500 to-rose-600", title: "Cherry Blossom", model: "Stable Diffusion", time: "6h ago" },
  { id: 4, gradient: "from-amber-500 to-orange-600", title: "Golden Hour", model: "DALL-E 3", time: "8h ago" },
  { id: 5, gradient: "from-emerald-500 to-teal-600", title: "Forest Path", model: "Midjourney", time: "12h ago" },
  { id: 6, gradient: "from-indigo-500 to-blue-600", title: "Northern Lights", model: "Imagen", time: "1d ago" },
];

export const GalleryShowcaseCard = memo(function GalleryShowcaseCard() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full animate-fade-in-up">
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "bg-white dark:bg-white/[0.04]",
          "border border-gray-200 dark:border-white/[0.05]",
          "shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
            <Layers className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-xs font-medium text-muted-foreground">Your Gallery</span>
          </div>
          <div className="w-20" />
        </div>

        {/* Gallery Content */}
        <div className="p-5 md:p-8">
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/[0.05]">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">248</div>
                <div className="text-xs text-muted-foreground">Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-xs text-muted-foreground">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">56</div>
                <div className="text-xs text-muted-foreground">Chats</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors">
                <History className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(index)}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                  "bg-gradient-to-br",
                  img.gradient,
                  selectedImage === index
                    ? "ring-2 ring-violet-500 dark:ring-white scale-105 shadow-xl z-10"
                    : "hover:scale-[1.02] hover:shadow-lg"
                )}
              >
                {/* Image Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-white/60" />
                </div>
                
                {/* Hover Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-200",
                  isHovering === index || selectedImage === index ? "opacity-100" : "opacity-0"
                )}>
                  <span className="text-white text-xs font-medium text-center px-2">{img.title}</span>
                  <span className="text-white/60 text-[10px] mt-1">{img.model}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Image Info */}
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                  galleryImages[selectedImage].gradient
                )}
              >
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground text-sm">{galleryImages[selectedImage].title}</div>
                <div className="text-xs text-muted-foreground">Created with {galleryImages[selectedImage].model} • {galleryImages[selectedImage].time}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                <Download className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors">
                <Play className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/platform/gallery"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
            "bg-gradient-to-r from-violet-500 to-purple-600",
            "text-white shadow-lg shadow-violet-500/25",
            "hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02]",
            "transition-all duration-200"
          )}
        >
          <Layers className="w-4 h-4" />
          Explore Gallery
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
});
