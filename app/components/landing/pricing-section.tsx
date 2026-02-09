"use client";

import { memo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Check, 
  Zap, 
  Crown,
  Rocket,
  ArrowRight,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./shared-components";

// ============================================================================
// TYPES
// ============================================================================
interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  credits: number;
  features: string[];
  isPopular: boolean;
}

interface PricingSectionData {
  badge?: string;
  title?: string;
  highlight?: string;
  description?: string;
  buttonText?: string;
  guaranteeText?: string;
  enterpriseTitle?: string;
  enterpriseDescription?: string;
}

interface PricingSectionProps {
  plans: PricingPlan[];
  contactSalesUrl?: string;
  sectionData?: PricingSectionData;
}

// ============================================================================
// FALLBACK PLANS
// ============================================================================
const fallbackPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    description: "Perfect for trying out AI creation",
    price: 0,
    credits: 50,
    features: [
      "50 AI credits per month",
      "Access to basic models",
      "Standard image generation",
      "Community support",
    ],
    isPopular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious creators and professionals",
    price: 29,
    credits: 1000,
    features: [
      "1,000 AI credits per month",
      "All AI models included",
      "HD image generation",
      "Video creation access",
      "Priority support",
      "API access",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for teams",
    price: 99,
    credits: 5000,
    features: [
      "5,000+ AI credits per month",
      "Custom model training",
      "White-label options",
      "Dedicated support",
      "SLA guarantee",
      "Advanced analytics",
    ],
    isPopular: false,
  },
];

// ============================================================================
// PRICING CARD - Individual plan card
// ============================================================================
const PricingCard = memo(function PricingCard({ 
  plan,
  index,
  buttonText = "Get Started",
}: { 
  plan: PricingPlan;
  index: number;
  buttonText?: string;
}) {
  const isPopular = plan.isPopular;
  const icons = [Rocket, Crown, Star];
  const Icon = icons[index % icons.length];

  return (
    <div
      className={cn(
        "relative group rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 overflow-hidden transition-all duration-500",
        isPopular ? [
          "bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10",
          "dark:from-violet-500/[0.08] dark:via-purple-500/[0.04] dark:to-fuchsia-500/[0.08]",
          "border-2 border-violet-500/30 dark:border-violet-500/20",
          "lg:scale-105 z-10",
          "shadow-xl shadow-violet-500/10",
        ] : [
          "bg-slate-100/80 dark:bg-white/[0.02]",
          "border border-slate-200 dark:border-white/[0.05]",
          "hover:bg-slate-200/80 dark:hover:bg-white/[0.04]",
          "hover:border-violet-500/30",
        ]
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <div className={cn(
            "px-6 py-2 rounded-b-xl",
            "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
            "text-white text-sm font-bold",
            "shadow-lg shadow-violet-500/30"
          )}>
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className={cn("pt-2 sm:pt-4", isPopular && "pt-6 sm:pt-8")}>
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6",
          isPopular
            ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white"
            : "bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-500"
        )}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-1 sm:mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm font-display">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="my-5 sm:my-8">
        <div className="flex items-baseline gap-1 sm:gap-2">
          {plan.price === 0 ? (
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-foreground">Free</span>
          ) : (
            <>
              <span className={cn(
                "text-3xl sm:text-4xl md:text-5xl font-bold font-heading",
                isPopular
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent"
                  : "text-foreground"
              )}>
                ${plan.price}
              </span>
              <span className="text-muted-foreground text-sm">/month</span>
            </>
          )}
        </div>

        {/* Credits Badge */}
        <div className={cn(
          "inline-flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl",
          "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
          "border border-violet-500/20"
        )}>
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            {plan.credits.toLocaleString()} credits
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 sm:gap-3">
            <div className={cn(
              "flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mt-0.5",
              isPopular
                ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white"
                : "bg-violet-500/20 text-violet-500"
            )}>
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
            <span className="text-xs sm:text-sm text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href={plan.price === 0 ? "/platform/studio" : `/platform/billing?plan=${plan.id}`}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300",
          isPopular ? [
            "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
            "text-white shadow-lg shadow-violet-500/25",
            "hover:shadow-xl hover:shadow-violet-500/30",
            "hover:scale-[1.02]",
          ] : [
            "bg-white/5 border border-white/10",
            "text-foreground",
            "hover:bg-violet-500/10 hover:border-violet-500/30",
          ]
        )}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
});

// ============================================================================
// ENTERPRISE CTA - Bottom banner
// ============================================================================
const EnterpriseCTA = memo(function EnterpriseCTA({ 
  contactSalesUrl,
  title = "Need a custom solution?",
  description = "Get custom model training, dedicated support, white-label options, and enterprise-grade security.",
}: { 
  contactSalesUrl: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className={cn(
      "relative mt-10 sm:mt-16 p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-3xl overflow-hidden",
      "bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10",
      "border border-violet-500/20",
      "backdrop-blur-xl"
    )}>
      {/* Background decorations */}
      <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-lg">
            {description}
          </p>
        </div>
        <Link
          href={contactSalesUrl}
          className={cn(
            "flex-shrink-0 inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base",
            "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
            "text-white shadow-xl shadow-violet-500/25",
            "hover:shadow-2xl hover:shadow-violet-500/30",
            "hover:scale-[1.02] active:scale-[0.98]",
            "transition-all duration-200"
          )}
        >
          Contact Sales
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN PRICING SECTION
// ============================================================================
export function PricingSection({ 
  plans: dbPlans, 
  contactSalesUrl = "/contact",
  sectionData
}: PricingSectionProps) {
  const displayPlans = dbPlans.length > 0 ? dbPlans : fallbackPlans;

  return (
    <section id="pricing" className="py-16 sm:py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={sectionData?.badge || "Pricing"}
          badgeIcon={<Sparkles className="w-4 h-4" />}
          title={sectionData?.title || "Simple, Transparent"}
          highlightedText={sectionData?.highlight || "Pricing"}
          description={sectionData?.description || "Choose the plan that fits your needs. No hidden fees, cancel anytime."}
        />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {displayPlans.slice(0, 3).map((plan, idx) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              index={idx} 
              buttonText={sectionData?.buttonText}
            />
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {sectionData?.guaranteeText || "All plans include a 14-day money-back guarantee. No questions asked."}
          </p>
        </div>

        {/* Enterprise CTA */}
        <EnterpriseCTA 
          contactSalesUrl={contactSalesUrl} 
          title={sectionData?.enterpriseTitle}
          description={sectionData?.enterpriseDescription}
        />
      </div>
    </section>
  );
}
