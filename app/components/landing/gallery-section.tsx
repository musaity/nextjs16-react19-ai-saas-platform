"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./shared-components";

// ============================================================================
// TYPES
// ============================================================================
interface GalleryItem {
  id: string;
  title: string | null;
  imageUrl: string;
  prompt: string;
  model: string;
  order: number;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string | null;
  company: string | null;
  avatarUrl: string | null;
  rating: number;
  order: number;
  isActive: boolean;
}

interface GallerySectionData {
  badge?: string;
  title?: string;
  highlight?: string;
  description?: string;
}

interface GallerySectionProps {
  galleryData?: GalleryItem[];
  testimonialData?: Testimonial[];
  sectionData?: GallerySectionData;
}

// ============================================================================
// FALLBACK DATA
// ============================================================================
const fallbackGallery: GalleryItem[] = [
  {
    id: "1",
    title: "Cyberpunk City",
    imageUrl: "/placeholder.svg",
    prompt: "A futuristic cyberpunk city at night",
    model: "DALL·E 3",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    title: "Mountain Landscape",
    imageUrl: "/placeholder.svg",
    prompt: "Majestic mountain landscape at sunrise",
    model: "Stable Diffusion",
    order: 2,
    isActive: true,
  },
  {
    id: "3",
    title: "Abstract Art",
    imageUrl: "/placeholder.svg",
    prompt: "Colorful abstract fluid art",
    model: "Midjourney",
    order: 3,
    isActive: true,
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    content: "This platform has completely transformed how I create content. The AI models are incredibly powerful and easy to use.",
    author: "Sarah Johnson",
    role: "Creative Director",
    company: "Design Studio",
    avatarUrl: null,
    rating: 5,
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    content: "The best AI platform I've used. Fast, reliable, and the quality of outputs is consistently impressive.",
    author: "Michael Chen",
    role: "Product Designer",
    company: "Tech Startup",
    avatarUrl: null,
    rating: 5,
    order: 2,
    isActive: true,
  },
  {
    id: "3",
    content: "Having access to multiple AI models in one place is a game-changer. Highly recommend for any creative professional.",
    author: "Emily Davis",
    role: "Marketing Lead",
    company: "Agency Inc",
    avatarUrl: null,
    rating: 5,
    order: 3,
    isActive: true,
  },
];

// ============================================================================
// GALLERY GRID
// ============================================================================
const GalleryGrid = memo(function GalleryGrid({ 
  items 
}: { 
  items: GalleryItem[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
      {items.slice(0, 6).map((item, idx) => (
        <div
          key={item.id}
          className={cn(
            "group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer",
            "bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08]",
            "hover:border-violet-500/30",
            "transition-all duration-300",
            idx === 0 && "sm:col-span-2 sm:row-span-2"
          )}
        >
          {item.imageUrl && item.imageUrl !== "/placeholder.svg" ? (
            <Image
              src={item.imageUrl}
              alt={item.title || "AI Generated"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-purple-500/20">
              <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-violet-500/50" />
            </div>
          )}

          {/* Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )}>
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <p className="text-white text-xs sm:text-sm font-medium truncate">
                {item.title || item.prompt}
              </p>
              <p className="text-white/60 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{item.model}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================================
// TESTIMONIALS CAROUSEL
// ============================================================================
const TestimonialsCarousel = memo(function TestimonialsCarousel({ 
  testimonials 
}: { 
  testimonials: Testimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[activeIndex];

  return (
    <div 
      className={cn(
        "relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 overflow-hidden",
        "bg-slate-100/80 dark:bg-white/[0.02]",
        "border border-slate-200 dark:border-white/[0.05]"
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quote Icon */}
      <Quote className="w-8 h-8 sm:w-12 sm:h-12 text-violet-500/20 mb-4 sm:mb-6" />

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Content */}
          <blockquote className="text-base sm:text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5 sm:mb-8">
            &ldquo;{current.content}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-violet-500 to-purple-600",
                "text-white font-bold text-sm sm:text-base"
              )}>
                {current.author[0]}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">{current.author}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {current.role}{current.company ? ` at ${current.company}` : ""}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-0.5 sm:gap-1">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-between mt-6 sm:mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center",
                "bg-white/5 border border-white/10",
                "hover:bg-violet-500/20 hover:border-violet-500/30",
                "transition-all duration-200"
              )}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={next}
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center",
                "bg-white/5 border border-white/10",
                "hover:bg-violet-500/20 hover:border-violet-500/30",
                "transition-all duration-200"
              )}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                  idx === activeIndex 
                    ? "w-4 sm:w-6 bg-violet-500" 
                    : "w-1.5 sm:w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================================
// MAIN GALLERY SECTION
// ============================================================================
export function GallerySection({ 
  galleryData,
  testimonialData,
  sectionData,
}: GallerySectionProps) {
  const gallery = galleryData?.filter(g => g.isActive) || fallbackGallery;
  const testimonials = testimonialData?.filter(t => t.isActive) || fallbackTestimonials;

  return (
    <section id="gallery" className="py-16 sm:py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={sectionData?.badge || "Gallery"}
          badgeIcon={<ImageIcon className="w-4 h-4" />}
          title={sectionData?.title || "Created by Our"}
          highlightedText={sectionData?.highlight || "Community"}
          description={sectionData?.description || "Explore stunning creations made by users like you with our AI platform."}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Gallery Grid */}
          <GalleryGrid items={gallery} />

          {/* Testimonials */}
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
