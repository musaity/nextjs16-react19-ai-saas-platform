import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { FileText, Calendar, Shield, Cookie, CreditCard, ScrollText } from "lucide-react";
import Link from "next/link";

type LegalType = "terms" | "privacy" | "refund" | "cookies";

const legalMeta: Record<LegalType, { title: string; icon: React.ReactNode; description: string }> = {
  terms: {
    title: "Terms of Service",
    icon: <ScrollText className="w-6 h-6" />,
    description: "Please read these terms carefully before using our services.",
  },
  privacy: {
    title: "Privacy Policy",
    icon: <Shield className="w-6 h-6" />,
    description: "How we collect, use, and protect your personal information.",
  },
  refund: {
    title: "Refund Policy",
    icon: <CreditCard className="w-6 h-6" />,
    description: "Our policy regarding refunds and cancellations.",
  },
  cookies: {
    title: "Cookie Policy",
    icon: <Cookie className="w-6 h-6" />,
    description: "How we use cookies and similar technologies.",
  },
};

export async function generateStaticParams() {
  return [
    { type: "terms" },
    { type: "privacy" },
    { type: "refund" },
    { type: "cookies" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const meta = legalMeta[type as LegalType];
  
  if (!meta) {
    return { title: "Legal" };
  }
  
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function LegalPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const legalType = type.toUpperCase();
  const meta = legalMeta[type as LegalType];

  if (!meta) {
    notFound();
  }

  const content = await prisma.legalContent.findUnique({
    where: { type: legalType },
  });

  if (!content || !content.isPublished) {
    notFound();
  }

  const formattedDate = new Date(content.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            Version {content.version}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            {meta.icon}
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{meta.title}</h1>
          <p className="text-muted-foreground mb-4">{meta.description}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {formattedDate}</span>
          </div>
        </div>

        {/* Legal Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div 
            className="text-foreground leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br />') }}
          />
        </article>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Other Legal Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(legalMeta)
              .filter(([key]) => key !== type)
              .map(([key, value]) => (
                <Link
                  key={key}
                  href={`/legal/${key}`}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    {value.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{value.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
