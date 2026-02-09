import { LandingPageClient } from "@/app/components/landing/landing-page-client";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { getAppUrl } from "@/lib/config";
import { unstable_cache } from "next/cache";

// Revalidate every 60 seconds for near-realtime updates with caching
export const revalidate = 60;

// Cached database queries
const getCachedLandingData = unstable_cache(
  async () => {
    const [settings, features, pricingPlans, footerCategories, socialLinks, contactInfo, galleryItems, testimonials, navItems] = await Promise.all([
      prisma.globalSettings.findFirst(),
      prisma.landingFeature.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" }
      }),
      prisma.pricingPlan.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" }
      }),
      prisma.footerLinkCategory.findMany({
        where: { isActive: true },
        include: {
          links: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      }),
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.contactInfo.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.galleryItem.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.navItem.findMany({
        where: { 
          isActive: true,
          location: { in: ["header", "both"] },
          parentId: null
        },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { order: "asc" }
          }
        },
        orderBy: { order: "asc" }
      }),
    ]);
    
    return { settings, features, pricingPlans, footerCategories, socialLinks, contactInfo, galleryItems, testimonials, navItems };
  },
  ["landing-page-data"],
  { revalidate: 60, tags: ["landing"] }
);

// Cached settings for metadata
const getCachedSettings = unstable_cache(
  async () => prisma.globalSettings.findFirst(),
  ["landing-settings"],
  { revalidate: 60, tags: ["landing"] }
);

// Generate dynamic SEO metadata for landing page
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();
  const baseUrl = getAppUrl();
  
  const siteName = settings?.siteName || "AI SaaS Platform";
  const siteDescription = settings?.siteDescription || "AI-powered image generation, video creation and smart chat solutions. All AI tools in one platform.";
  const seoKeywords = settings?.seoKeywords?.split(",").map(k => k.trim()) || [
    "AI image generation",
    "AI video creation",
    "AI chat assistant",
    "text to image",
    "creative AI tools",
  ];

  return {
    title: siteName,
    description: siteDescription,
    keywords: seoKeywords,
    openGraph: {
      title: settings?.heroTitle || siteName,
      description: siteDescription,
      url: baseUrl,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.heroTitle || siteName,
      description: siteDescription,
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default async function LandingPage() {
  // Fetch cached branding/landing settings from database
  const { settings, features, pricingPlans, footerCategories, socialLinks, contactInfo, galleryItems, testimonials, navItems } = await getCachedLandingData();

  const brandingData = {
    logoUrl: settings?.logoUrl || null,
    darkLogoUrl: settings?.darkLogoUrl || null,
    brandName: settings?.brandName || "AI SaaS",
    siteDescription: settings?.siteDescription || "AI-powered image generation, video creation and smart chat solutions. All AI tools in one platform.",
    heroTitle: settings?.heroTitle || "Imagine. Generate. Inspire.",
    heroHighlight: settings?.heroHighlight || "Without Code",
    heroDescription: settings?.heroDescription || "Create stunning visuals with AI.",
    heroBadge: settings?.heroBadge || "v2.0 Now Available",
    heroBadgeFont: settings?.heroBadgeFont || "Inter",
    heroBadgeFontSize: settings?.heroBadgeFontSize || "14",
    heroTitleFont: settings?.heroTitleFont || "Inter",
    heroTitleFontSize: settings?.heroTitleFontSize || "48",
    heroSubtitleFont: settings?.heroSubtitleFont || "Inter",
    heroSubtitleFontSize: settings?.heroSubtitleFontSize || "18",
    featureTitle: settings?.featureTitle || "Everything you need to create magic.",
    featureTitleFont: settings?.featureTitleFont || "Inter",
    featureTitleFontSize: settings?.featureTitleFontSize || "36",
    demoMediaUrl: settings?.demoMediaUrl || null,
    demoMediaType: settings?.demoMediaType || "none",
    contactSalesUrl: settings?.contactSalesUrl || "/contact",
    // Hero CTA & Stats - Always go to studio without login
    heroPrimaryButtonText: settings?.heroPrimaryButtonText || "Start Building Free",
    heroPrimaryButtonUrl: "/platform/studio", // Always go directly to studio
    heroSecondaryButtonText: settings?.heroSecondaryButtonText || "Watch Demo",
    heroStats: (settings?.heroStats as any[]) || [
      { value: "50K+", label: "Creators" },
      { value: "2M+", label: "AI Generations" },
      { value: "99.9%", label: "Uptime" },
    ],
    trustedByEnabled: settings?.trustedByEnabled ?? true,
    trustedByTitle: settings?.trustedByTitle || "Trusted by teams at",
    trustedByCompanies: (settings?.trustedByCompanies as string[]) || ["Vercel", "Linear", "Raycast", "Notion", "Figma", "Stripe"],
  };

  const modelsShowcaseData = {
    badge: settings?.modelsShowcaseBadge || "AI Models",
    title: settings?.modelsShowcaseTitle || "Powered by",
    highlight: settings?.modelsShowcaseHighlight || "World-Class AI",
    description: settings?.modelsShowcaseDescription || "Access the most advanced AI models from leading providers, all unified in one platform.",
    footerText: settings?.modelsShowcaseFooterText || "+15 more models available",
  };

  const integrationsData = {
    badge: settings?.integrationsBadge || "Integrations",
    title: settings?.integrationsTitle || "Works With Your",
    highlight: settings?.integrationsHighlight || "Favorite Tools",
    description: settings?.integrationsDescription || "Seamlessly integrate AI capabilities into your existing workflow and applications.",
    comingSoon: settings?.integrationsComingSoon || "More integrations coming soon: Zapier, Make, n8n, and more",
  };

  const pricingSectionData = {
    badge: settings?.pricingBadge || "Pricing",
    title: settings?.pricingTitle || "Simple, Transparent",
    highlight: settings?.pricingHighlight || "Pricing",
    description: settings?.pricingDescription || "Choose the plan that fits your needs. No hidden fees, cancel anytime.",
    buttonText: settings?.pricingButtonText || "Get Started",
    guaranteeText: settings?.pricingGuaranteeText || "All plans include a 14-day money-back guarantee. No questions asked.",
    enterpriseTitle: settings?.pricingEnterpriseTitle || "Need a custom solution?",
    enterpriseDescription: settings?.pricingEnterpriseDesc || "Get custom model training, dedicated support, white-label options, and enterprise-grade security.",
  };

  const gallerySectionData = {
    badge: settings?.galleryBadge || "Gallery",
    title: settings?.galleryTitle || "Created by Our",
    highlight: settings?.galleryHighlight || "Community",
    description: settings?.galleryDescription || "Explore stunning creations made by users like you with our AI platform.",
  };

  const ctaData = {
    badge: settings?.ctaBadge || "Limited Time Offer",
    badgeEnabled: settings?.ctaBadgeEnabled ?? true,
    title: settings?.ctaTitle || "Start Creating Today",
    description: settings?.ctaDescription || "Join thousands of creators using AI to bring their ideas to life. No technical skills required.",
    buttonText: settings?.ctaButtonText || "Get Started Free",
    buttonUrl: "/platform/studio", // Always go directly to studio
    secondaryButtonText: settings?.ctaSecondaryButtonText || "View Documentation",
    secondaryButtonUrl: settings?.ctaSecondaryButtonUrl || "/docs",
    benefits: (settings?.ctaBenefits as any[]) || [
      { icon: "Gift", text: "50 free credits to start" },
      { icon: "Zap", text: "No credit card required" },
      { icon: "Shield", text: "Cancel anytime" },
      { icon: "Clock", text: "Setup in 30 seconds" },
    ],
  };

  const footerData = {
    categories: footerCategories,
    socialLinks: socialLinks,
    contactInfo: contactInfo,
  };

  return (
    <LandingPageClient 
      branding={brandingData} 
      features={features}
      pricingPlans={pricingPlans}
      footerData={footerData}
      galleryData={galleryItems}
      testimonialData={testimonials}
      contactSalesUrl={brandingData.contactSalesUrl}
      ctaData={ctaData}
      modelsShowcaseData={modelsShowcaseData}
      integrationsData={integrationsData}
      pricingSectionData={pricingSectionData}
      gallerySectionData={gallerySectionData}
      navItems={navItems}
    />
  );
}
