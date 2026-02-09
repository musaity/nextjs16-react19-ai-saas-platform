"use client";

import { useState, useEffect, useCallback, memo, Suspense } from "react";
import dynamic from "next/dynamic";
import { ArrowUp } from "lucide-react";
import { Navbar } from "./navbar";
import { HeroSection2026 } from "./hero-section-2026";
import { ScrollReveal } from "./shared-components";
import { cn } from "@/lib/utils";

// Lazy load below-the-fold components for faster initial load
const ModelsShowcase = dynamic(() => import("./models-showcase").then(mod => ({ default: mod.ModelsShowcase })), {
  loading: () => <SectionSkeleton />,
  ssr: true
});

const FeaturesSection2026 = dynamic(() => import("./features-section-2026").then(mod => ({ default: mod.FeaturesSection2026 })), {
  loading: () => <SectionSkeleton />,
  ssr: true
});

const IntegrationsSection = dynamic(() => import("./integrations-section").then(mod => ({ default: mod.IntegrationsSection })), {
  loading: () => <SectionSkeleton />,
  ssr: true
});

const PricingSection = dynamic(() => import("./pricing-section").then(mod => ({ default: mod.PricingSection })), {
  loading: () => <SectionSkeleton />,
  ssr: true
});

const GallerySection = dynamic(() => import("./gallery-section").then(mod => ({ default: mod.GallerySection })), {
  loading: () => <SectionSkeleton />,
  ssr: true
});

const CTASection = dynamic(() => import("./cta-section").then(mod => ({ default: mod.CTASection })), {
  loading: () => <SectionSkeleton />,
  ssr: true
});

const Footer = dynamic(() => import("./footer").then(mod => ({ default: mod.Footer })), {
  ssr: true
});

// Loading skeleton for sections
function SectionSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted/50 rounded-lg w-48 mx-auto mb-4" />
          <div className="h-6 bg-muted/30 rounded-lg w-96 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted/20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BrandingData {
  logoUrl: string | null;
  darkLogoUrl: string | null;
  brandName: string;
  siteDescription: string;
  heroTitle: string;
  heroHighlight?: string;
  heroDescription: string;
  heroBadge: string;
  heroBadgeFont: string;
  heroBadgeFontSize: string;
  heroTitleFont: string;
  heroTitleFontSize: string;
  heroSubtitleFont: string;
  heroSubtitleFontSize: string;
  featureTitle: string;
  featureTitleFont: string;
  featureTitleFontSize: string;
  demoMediaUrl: string | null;
  demoMediaType: string;
  // Hero CTA & Stats
  heroPrimaryButtonText?: string;
  heroPrimaryButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroStats?: { value: string; label: string }[];
  trustedByEnabled?: boolean;
  trustedByTitle?: string;
  trustedByCompanies?: string[];
}

interface LandingFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  badge: string | null;
  imageUrl: string | null;
  mediaType?: string;
  order: number;
  category: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  credits: number;
  features: string[];
  isPopular: boolean;
}

// Footer data types
interface FooterLink {
  id: string;
  name: string;
  href: string;
  isExternal: boolean;
  order: number;
  isActive: boolean;
}

interface FooterLinkCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  icon: string | null;
  href: string | null;
  isActive: boolean;
  order: number;
}

interface FooterData {
  categories: FooterLinkCategory[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo[];
}

// Gallery and Testimonials types
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

// Section Data interfaces
interface ModelsShowcaseData {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  footerText: string;
}

interface IntegrationsData {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  comingSoon: string;
}

interface PricingSectionData {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  buttonText: string;
  guaranteeText: string;
  enterpriseTitle: string;
  enterpriseDescription: string;
}

interface GallerySectionData {
  badge: string;
  title: string;
  highlight: string;
  description: string;
}

// Navigation Items from database
interface NavItemChild {
  id: string;
  name: string;
  href: string;
  icon: string | null;
  target: string | null;
  order: number;
}

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string | null;
  target: string | null;
  order: number;
  children: NavItemChild[];
}

interface LandingPageClientProps {
  branding: BrandingData;
  features: LandingFeature[];
  pricingPlans: PricingPlan[];
  footerData?: FooterData;
  galleryData?: GalleryItem[];
  testimonialData?: Testimonial[];
  contactSalesUrl?: string;
  ctaData?: CtaData;
  modelsShowcaseData?: ModelsShowcaseData;
  integrationsData?: IntegrationsData;
  pricingSectionData?: PricingSectionData;
  gallerySectionData?: GallerySectionData;
  navItems?: NavItem[];
}

// ============================================================================
// SCROLL TO TOP BUTTON - Optimized with throttle
// ============================================================================
const ScrollToTopButton = memo(function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-12 h-12 rounded-full",
        "flex items-center justify-center",
        "bg-gradient-to-br from-violet-600 to-purple-600",
        "shadow-lg shadow-violet-500/25",
        "border border-violet-400/30 dark:border-white/20",
        "hover:scale-105 active:scale-95",
        "transition-all duration-200",
        "cursor-pointer"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </button>
  );
});

export function LandingPageClient({ 
  branding, 
  features, 
  pricingPlans, 
  footerData, 
  galleryData, 
  testimonialData, 
  contactSalesUrl, 
  ctaData,
  modelsShowcaseData,
  integrationsData,
  pricingSectionData,
  gallerySectionData,
  navItems
}: LandingPageClientProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      <Navbar branding={branding} navItems={navItems} />
      <main className="scroll-smooth">
        {/* Hero Section - Immediate visibility with subtle animation */}
        <ScrollReveal variant="blur" duration={0.8}>
          <HeroSection2026 branding={branding} />
        </ScrollReveal>
        
        {/* Features Section - Slide up with spring effect */}
        <ScrollReveal variant="spring" delay={0.1}>
          <FeaturesSection2026 
            features={features} 
            featureTitle={branding.featureTitle}
            featureTitleFont={branding.featureTitleFont}
            featureTitleFontSize={branding.featureTitleFontSize}
          />
        </ScrollReveal>
        
        {/* Models Showcase - Fade from right */}
        <ScrollReveal variant="fadeRight" delay={0.15}>
          <ModelsShowcase sectionData={modelsShowcaseData} />
        </ScrollReveal>
        
        {/* Integrations Section - Fade from left */}
        <ScrollReveal variant="fadeLeft" delay={0.15}>
          <IntegrationsSection sectionData={integrationsData} />
        </ScrollReveal>
        
        {/* Gallery Section - Scale up effect */}
        <ScrollReveal variant="scale" delay={0.1}>
          <GallerySection 
            galleryData={galleryData} 
            testimonialData={testimonialData} 
            sectionData={gallerySectionData}
          />
        </ScrollReveal>
        
        {/* Pricing Section - Slide up */}
        <ScrollReveal variant="slideUp" delay={0.1}>
          <PricingSection 
            plans={pricingPlans} 
            contactSalesUrl={contactSalesUrl} 
            sectionData={pricingSectionData}
          />
        </ScrollReveal>
        
        {/* CTA Section - Spring bounce effect */}
        <ScrollReveal variant="spring" delay={0.1}>
          <CTASection ctaData={ctaData} />
        </ScrollReveal>
      </main>
      <ScrollReveal variant="fadeUp" delay={0.05}>
        <Footer branding={branding} footerData={footerData} />
      </ScrollReveal>
      <ScrollToTopButton />
    </div>
  );
}
