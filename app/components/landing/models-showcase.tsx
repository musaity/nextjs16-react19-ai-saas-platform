"use client";

import { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles,
  Bot,
  Cpu,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./shared-components";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: customEase,
    },
  },
};

// ============================================================================
// AI MODELS DATA
// ============================================================================
const aiModels = [
  {
    name: "GPT-4o",
    provider: "OpenAI",
    category: "Chat",
    description: "Most advanced language model for natural conversations",
    color: "from-emerald-500 to-teal-600",
    icon: Bot,
  },
  {
    name: "DALL·E 3",
    provider: "OpenAI",
    category: "Image",
    description: "Create stunning images from text descriptions",
    color: "from-violet-500 to-purple-600",
    icon: Sparkles,
  },
  {
    name: "Claude 3.5",
    provider: "Anthropic",
    category: "Chat",
    description: "Thoughtful AI assistant for complex tasks",
    color: "from-orange-500 to-amber-600",
    icon: Bot,
  },
  {
    name: "Gemini 2.0",
    provider: "Google",
    category: "Multimodal",
    description: "Google's most capable multimodal AI model",
    color: "from-blue-500 to-cyan-600",
    icon: Cpu,
  },
  {
    name: "Kling AI",
    provider: "Kuaishou",
    category: "Video",
    description: "Transform images into captivating videos",
    color: "from-pink-500 to-rose-600",
    icon: Layers,
  },
  {
    name: "Stable Diffusion",
    provider: "Stability",
    category: "Image",
    description: "Open-source image generation powerhouse",
    color: "from-indigo-500 to-purple-600",
    icon: Sparkles,
  },
];

// ============================================================================
// MODEL CARD
// ============================================================================
const ModelCard = memo(function ModelCard({
  model,
  index,
}: {
  model: typeof aiModels[0];
  index: number;
}) {
  const Icon = model.icon;

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        transition: { duration: 0.3, ease: customEase }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden",
        "bg-white/80 dark:bg-white/[0.03]",
        "border border-slate-200 dark:border-white/[0.08]",
        "backdrop-blur-md",
        "shadow-lg shadow-slate-200/50 dark:shadow-none",
        "cursor-pointer"
      )}
    >
      {/* Gradient overlay on hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          "bg-gradient-to-br",
          model.color,
          "opacity-[0.08]"
        )} 
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${model.color.includes('emerald') ? 'rgba(16, 185, 129, 0.3)' : model.color.includes('violet') ? 'rgba(139, 92, 246, 0.3)' : model.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : model.color.includes('orange') ? 'rgba(249, 115, 22, 0.3)' : model.color.includes('pink') ? 'rgba(236, 72, 153, 0.3)' : 'rgba(139, 92, 246, 0.3)'}, transparent)`,
          mask: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      <div className="relative z-10">
        {/* Icon & Category */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center",
              "bg-gradient-to-br",
              model.color,
              "text-white"
            )}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
          <span className={cn(
            "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold",
            "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10",
            "text-slate-600 dark:text-muted-foreground"
          )}>
            {model.category}
          </span>
        </div>

        {/* Name & Provider */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-foreground mb-0.5 sm:mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-500 transition-colors">
          {model.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-muted-foreground mb-2 sm:mb-3">{model.provider}</p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground/80 leading-relaxed">
          {model.description}
        </p>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN MODELS SHOWCASE
// ============================================================================
interface ModelsShowcaseSectionData {
  badge?: string;
  title?: string;
  highlight?: string;
  description?: string;
  footerText?: string;
}

interface ModelsShowcaseProps {
  sectionData?: ModelsShowcaseSectionData;
}

export function ModelsShowcase({ sectionData }: ModelsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-30 dark:opacity-100"
          style={{
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={sectionData?.badge || "AI Models"}
          badgeIcon={<Cpu className="w-4 h-4" />}
          title={sectionData?.title || "Powered by"}
          highlightedText={sectionData?.highlight || "World-Class AI"}
          description={sectionData?.description || "Access the most advanced AI models from leading providers, all unified in one platform."}
        />

        {/* Models Grid with Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {aiModels.map((model, index) => (
            <ModelCard key={model.name} model={model} index={index} />
          ))}
        </motion.div>

        {/* Bottom Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6, ease: customEase }}
          className="mt-12 flex items-center justify-center"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl",
              "bg-white/80 dark:bg-white/[0.03]",
              "border border-slate-200 dark:border-white/[0.08]",
              "backdrop-blur-md",
              "shadow-lg shadow-slate-200/50 dark:shadow-none"
            )}
          >
            <div className="flex -space-x-2">
              {aiModels.slice(0, 4).map((model, idx) => (
                <motion.div
                  key={model.name}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.4, type: "spring" }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br border-2 border-background",
                    model.color,
                    "text-white text-xs font-bold"
                  )}
                  style={{ zIndex: 4 - idx }}
                >
                  {model.name[0]}
                </motion.div>
              ))}
            </div>
            <span className="text-sm text-slate-600 dark:text-muted-foreground">
              {sectionData?.footerText || "+15 more models available"}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
