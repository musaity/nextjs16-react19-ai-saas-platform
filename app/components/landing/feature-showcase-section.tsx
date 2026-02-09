"use client";

import { memo } from "react";
import { SectionHeader } from "./shared-components";
import { ToolsShowcaseCard, IntegrationsShowcaseCard } from "./feature-showcase-cards";
import { cn } from "@/lib/utils";

// ============================================================================
// FEATURE SHOWCASE SECTION
// ============================================================================
export const FeatureShowcaseSection = memo(function FeatureShowcaseSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div 
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge="Platform Highlights"
          title="Experience the Full Power"
          description="Explore our comprehensive suite of AI tools, seamless integrations, and powerful gallery features."
        />

        {/* Cards - Stacked Layout */}
        <div className="mt-16 space-y-16">
          {/* AI Tools Card - Full Width */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                AI Enhancement Tools
              </h3>
              <p className="text-muted-foreground">
                Professional-grade image tools powered by AI. Upscale, remove backgrounds, and restore faces.
              </p>
            </div>
            <ToolsShowcaseCard />
          </div>

          {/* Integrations Card - Full Width */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Multi-Platform Integrations
              </h3>
              <p className="text-muted-foreground">
                Connect your AI assistant to WhatsApp, Telegram, Discord, and Slack.
              </p>
            </div>
            <IntegrationsShowcaseCard />
          </div>
        </div>
      </div>
    </section>
  );
});
