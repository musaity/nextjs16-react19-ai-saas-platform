import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  Code, 
  ArrowLeft, 
  ArrowRight,
  Home,
  ChevronRight,
  Key,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Webhook,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "API Reference",
    description: `Complete REST API documentation for ${siteName}. Generate images, videos, and chat completions programmatically.`,
    openGraph: {
      title: `API Reference | ${siteName}`,
      description: "Complete REST API documentation for developers.",
      url: `${baseUrl}/docs/api`,
    },
  };
}

const apiEndpoints = [
  {
    title: "Image Generation",
    description: "Generate images from text prompts using DALL-E 3, Stable Diffusion, and more.",
    href: "/docs/api/images",
    icon: <ImageIcon className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
    methods: ["POST"],
    endpoint: "/api/generate/image",
  },
  {
    title: "Video Generation",
    description: "Create videos from images or text using Kling AI video generation.",
    href: "/docs/api/videos",
    icon: <Video className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    methods: ["POST", "GET"],
    endpoint: "/api/kling/*",
  },
  {
    title: "Chat Completions",
    description: "Generate AI chat responses with GPT-4o, Claude, and Gemini models.",
    href: "/docs/api/chat",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
    methods: ["POST"],
    endpoint: "/api/chat",
  },
  {
    title: "Webhooks",
    description: "Receive real-time notifications for generation events.",
    href: "/docs/api/webhooks",
    icon: <Webhook className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    methods: ["POST"],
    endpoint: "/api/webhooks/*",
  },
];

const features = [
  { icon: <Key className="w-5 h-5" />, title: "API Keys", description: "Secure authentication with API keys" },
  { icon: <Zap className="w-5 h-5" />, title: "Rate Limiting", description: "Fair usage with intelligent rate limits" },
  { icon: <Shield className="w-5 h-5" />, title: "HTTPS Only", description: "All requests encrypted in transit" },
  { icon: <Clock className="w-5 h-5" />, title: "Low Latency", description: "Global edge network for fast responses" },
];

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">API Reference</span>
          </div>
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 border-b border-border bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Code className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-blue-500">API Reference</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            REST API Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Integrate AI generation capabilities into your applications with our simple REST API.
            Generate images, videos, and chat completions programmatically.
          </p>

          {/* Base URL */}
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-muted border border-border font-mono text-sm">
            <span className="text-muted-foreground">Base URL:</span>
            <code className="text-foreground">https://your-domain.com/api</code>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 px-6 border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border">
                <div className="text-primary">{feature.icon}</div>
                <div>
                  <div className="font-medium text-sm text-foreground">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Available Endpoints</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {apiEndpoints.map((endpoint, i) => (
              <Link
                key={i}
                href={endpoint.href}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${endpoint.color} flex items-center justify-center text-white mb-4`}>
                  {endpoint.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {endpoint.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {endpoint.description}
                </p>
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                    {endpoint.endpoint}
                  </code>
                  <div className="flex gap-1">
                    {endpoint.methods.map((method) => (
                      <span
                        key={method}
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          method === "POST" ? "bg-emerald-500/10 text-emerald-500" :
                          method === "GET" ? "bg-blue-500/10 text-blue-500" :
                          "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="py-16 px-6 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Authentication</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4">
              All API requests require authentication using an API key. Include your API key in the request headers:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`curl -X POST https://your-domain.com/api/generate/image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A beautiful sunset"}'`}</code>
            </pre>
            <p className="text-muted-foreground mt-4">
              You can generate API keys from your{" "}
              <Link href="/platform/settings" className="text-primary hover:underline">
                account settings
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
