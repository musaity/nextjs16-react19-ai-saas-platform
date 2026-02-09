"use client";

import { memo } from "react";
import { 
  Globe,
  Slack,
  MessageCircle,
  Webhook,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./shared-components";

// ============================================================================
// INTEGRATIONS DATA
// ============================================================================
const integrations = [
  {
    name: "Discord",
    description: "Deploy AI bots to your Discord server",
    icon: MessageCircle,
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Slack",
    description: "Integrate AI assistants into Slack",
    icon: Slack,
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Webhooks",
    description: "Connect with any service via webhooks",
    icon: Webhook,
    color: "from-orange-500 to-red-600",
  },
  {
    name: "REST API",
    description: "Full API access for custom integrations",
    icon: Code2,
    color: "from-cyan-500 to-blue-600",
  },
];

// ============================================================================
// INTEGRATION CARD
// ============================================================================
const IntegrationCard = memo(function IntegrationCard({
  integration,
}: {
  integration: typeof integrations[0];
}) {
  const Icon = integration.icon;

  return (
    <div className={cn(
      "group relative flex flex-col items-center p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-center",
      "bg-slate-100/80 dark:bg-white/[0.02]",
      "border border-slate-200 dark:border-white/[0.05]",
      "hover:bg-slate-200/80 dark:hover:bg-white/[0.04]",
      "hover:border-violet-500/30",
      "transition-all duration-300"
    )}>
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6",
        "bg-gradient-to-br",
        integration.color,
        "text-white",
        "group-hover:scale-110 transition-transform duration-300"
      )}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
      </div>

      {/* Name & Description */}
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-violet-500 transition-colors">
        {integration.name}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground">
        {integration.description}
      </p>
    </div>
  );
});

// ============================================================================
// MAIN INTEGRATIONS SECTION
// ============================================================================
interface IntegrationsSectionData {
  badge?: string;
  title?: string;
  highlight?: string;
  description?: string;
  comingSoon?: string;
}

interface IntegrationsSectionProps {
  sectionData?: IntegrationsSectionData;
}

export function IntegrationsSection({ sectionData }: IntegrationsSectionProps) {
  return (
    <section className="py-16 sm:py-24 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={sectionData?.badge || "Integrations"}
          badgeIcon={<Globe className="w-4 h-4" />}
          title={sectionData?.title || "Works With Your"}
          highlightedText={sectionData?.highlight || "Favorite Tools"}
          description={sectionData?.description || "Seamlessly integrate AI capabilities into your existing workflow and applications."}
        />

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.name} integration={integration} />
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {sectionData?.comingSoon || "More integrations coming soon: Zapier, Make, n8n, and more"}
          </p>
        </div>
      </div>
    </section>
  );
}
