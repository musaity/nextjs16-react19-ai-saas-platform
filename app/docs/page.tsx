import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  BookOpen, 
  Code, 
  Puzzle, 
  Zap, 
  ArrowRight,
  ArrowLeft,
  FileText,
  Terminal,
  Key,
  Webhook,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Home
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

// Dynamic SEO metadata for Docs page
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Documentation",
    description: `Complete API documentation and integration guides for ${siteName}. Learn to integrate AI image generation, video creation, and chat into your applications.`,
    keywords: ["API documentation", "AI API", "integration guide", "developer docs", "REST API", "webhooks", siteName],
    openGraph: {
      title: `Documentation | ${siteName}`,
      description: "Complete API documentation and integration guides.",
      url: `${baseUrl}/docs`,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-docs.png`,
          width: 1200,
          height: 630,
          alt: `${siteName} Documentation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Documentation | ${siteName}`,
      description: "Complete API documentation and integration guides.",
    },
    alternates: {
      canonical: `${baseUrl}/docs`,
    },
  };
}

const docSections = [
  {
    title: "Getting Started",
    description: "Learn the basics and set up your first project",
    icon: <Zap className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
    links: [
      { title: "Quick Start Guide", href: "/docs/quickstart" },
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Credits & Billing", href: "/docs/billing" },
    ],
  },
  {
    title: "Integrations",
    description: "Connect AI to WhatsApp, Telegram, Discord & more",
    icon: <Puzzle className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
    links: [
      { title: "WhatsApp Integration", href: "/docs/integrations/whatsapp" },
      { title: "Telegram Bot", href: "/docs/integrations/telegram" },
      { title: "Discord Bot", href: "/docs/integrations/discord" },
      { title: "Slack Integration", href: "/docs/integrations/slack" },
    ],
  },
  {
    title: "API Reference",
    description: "Complete API documentation for developers",
    icon: <Code className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    links: [
      { title: "Image Generation API", href: "/docs/api/images" },
      { title: "Video Generation API", href: "/docs/api/videos" },
      { title: "Chat Completion API", href: "/docs/api/chat" },
      { title: "Webhooks", href: "/docs/api/webhooks" },
    ],
  },
  {
    title: "AI Models",
    description: "Learn about available AI models and capabilities",
    icon: <Terminal className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    links: [
      { title: "Image Models", href: "/docs/models/image" },
      { title: "Video Models", href: "/docs/models/video" },
      { title: "LLM Models", href: "/docs/models/llm" },
      { title: "Model Comparison", href: "/docs/models/comparison" },
    ],
  },
];

const quickLinks = [
  { title: "API Keys", icon: <Key className="w-5 h-5" />, href: "/platform/settings" },
  { title: "Webhooks", icon: <Webhook className="w-5 h-5" />, href: "/docs/api/webhooks" },
  { title: "Chat API", icon: <MessageSquare className="w-5 h-5" />, href: "/docs/api/chat" },
  { title: "Image API", icon: <ImageIcon className="w-5 h-5" />, href: "/docs/api/images" },
  { title: "Video API", icon: <Video className="w-5 h-5" />, href: "/docs/api/videos" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Back Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">Documentation</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 border-b border-border bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Creative Studio Docs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Everything you need to integrate AI creativity into your applications. 
            From quick start guides to complete API references.
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-5 py-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pl-12"
            />
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-6 border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border hover:border-primary/50 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {docSections.map((section, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white mb-4`}>
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {section.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {section.description}
                </p>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-16 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Popular Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/docs/integrations"
              className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group"
            >
              <Puzzle className="w-8 h-8 text-violet-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Integration Guides
              </h3>
              <p className="text-sm text-muted-foreground">
                Step-by-step guides for connecting AI to messaging platforms.
              </p>
            </Link>
            <Link
              href="/docs/api/images"
              className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group"
            >
              <ImageIcon className="w-8 h-8 text-emerald-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Image Generation
              </h3>
              <p className="text-sm text-muted-foreground">
                Generate images programmatically with our API.
              </p>
            </Link>
            <Link
              href="/docs/api/chat"
              className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group"
            >
              <MessageSquare className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                Chat Completions
              </h3>
              <p className="text-sm text-muted-foreground">
                Build AI chat experiences with multiple LLM models.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help?
          </h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
            <Link href="/platform/help">
              <Button>Visit Help Center</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Back Link */}
      <div className="py-8 px-6 text-center border-t border-border">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
