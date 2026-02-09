import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  Sparkles, 
  Users, 
  Globe, 
  Shield, 
  Heart,
  ArrowRight
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

// Dynamic SEO metadata for About page
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "About Us",
    description: `Learn about ${siteName}'s mission to democratize AI creativity. Discover our story, values, team, and commitment to making AI tools accessible to everyone.`,
    keywords: ["about us", "AI company", "AI creativity", "mission", "team", siteName],
    openGraph: {
      title: `About Us | ${siteName}`,
      description: `Discover ${siteName}'s mission to empower creativity through artificial intelligence.`,
      url: `${baseUrl}/about`,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-about.png`,
          width: 1200,
          height: 630,
          alt: `About ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `About Us | ${siteName}`,
      description: `Learn about our mission to democratize AI creativity for everyone.`,
    },
    alternates: {
      canonical: `${baseUrl}/about`,
    },
  };
}

export default async function AboutPage() {
  const settings = await prisma.globalSettings.findFirst();
  const brandName = settings?.siteName || "AI Creative Studio";

  const values = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible with AI technology.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User-Centric",
      description: "Every feature we build starts with understanding our users' needs.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy & Security",
      description: "Your data and creations are protected with enterprise-grade security.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Accessibility",
      description: "AI creativity should be accessible to everyone, regardless of technical skill.",
    },
  ];

  const stats = [
    { value: "1M+", label: "Images Generated" },
    { value: "50K+", label: "Happy Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const team = [
    { name: "Alex Chen", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    { name: "Sarah Kim", role: "CTO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
    { name: "Michael Lee", role: "Head of AI", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
    { name: "Emily Wang", role: "Head of Design", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Empowering Creativity with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {brandName} is on a mission to democratize AI-powered creativity, making professional-grade 
            tools accessible to everyone from hobbyists to enterprises.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/platform/studio">
              <Button size="lg" className="gap-2">
                Start Creating <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Founded in 2024, {brandName} started with a simple idea: AI creativity tools shouldn&apos;t 
              require a PhD to use. We saw how powerful AI models were becoming, but also how 
              inaccessible they were to everyday creators.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our team of AI researchers, designers, and engineers came together to build a platform 
              that puts the power of cutting-edge AI into the hands of everyone. From generating 
              stunning images to creating videos and having intelligent conversations, we've made 
              it all possible with just a few clicks.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, we serve thousands of creators, marketers, designers, and businesses worldwide. 
              But we&apos;re just getting started. Our vision is to become the go-to platform for all 
              AI-powered creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Our Values
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            These core principles guide everything we do
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            The passionate people behind {brandName}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-border">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using {brandName} to bring their ideas to life.
          </p>
          <Link href="/platform/studio">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
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
