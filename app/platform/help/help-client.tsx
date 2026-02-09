"use client";

import {
  HelpCircle,
  ChevronRight,
  Mail,
  Sparkles,
  Image,
  Video,
  CreditCard,
  MessageCircle,
  User,
  Shield,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useState, useMemo } from "react";

interface HelpContent {
  id: string;
  title: string;
  content: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
}

interface ContactOption {
  title: string;
  description: string;
  iconName: string;
  action: string;
  href: string;
}

interface FAQ {
  category: string;
  iconName: string;
  questions: Array<{
    q: string;
    a: string;
  }>;
}

interface HelpCenterClientProps {
  faqs: FAQ[];
  contactOptions: ContactOption[];
  dbContent: HelpContent[];
  categories: string[];
}

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
};

const iconComponentMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HelpCircle,
  Mail,
  Sparkles,
  Image,
  Video,
  CreditCard,
  MessageCircle,
  User,
  Shield,
};

export default function HelpCenterClient({
  faqs,
  contactOptions,
  dbContent,
  categories,
}: HelpCenterClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Search and filter content
  const filteredFaqs = useMemo(() => {
    return faqs
      .map((section) => ({
        ...section,
        questions: section.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((section) => section.questions.length > 0);
  }, [searchQuery, faqs]);

  // Merge DB content with FAQs
  const allCategories = useMemo(() => {
    const faqCategories = filteredFaqs.map((f) => f.category);
    const dbCategories = dbContent
      .filter((item) =>
        !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((item) => item.category);
    return [...new Set([...faqCategories, ...dbCategories])];
  }, [filteredFaqs, dbContent, searchQuery]);

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4 pb-8 border-b border-border">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
              <HelpCircle className="w-10 h-10 text-violet-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Help Center</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass border border-border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-4">
          {contactOptions.map((option) => {
            const IconComponent = iconComponentMap[option.iconName];
            return (
              <a
                key={option.title}
                href={option.href}
                className="surface rounded-2xl border border-border p-5 hover:border-violet-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-violet-400 transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                    <span className="text-sm text-violet-400 font-medium">{option.action}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* FAQ & DB Content Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            {searchQuery ? "Search Results" : "Help Articles"}
          </h2>

          {allCategories.length === 0 ? (
            <div className="glass rounded-2xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          ) : (
            allCategories.map((category) => {
              const faqSection = filteredFaqs.find((f) => f.category === category);
              const dbItems = dbContent.filter((item) => item.category === category);

              if (!faqSection && dbItems.length === 0) return null;

              const IconComponent = faqSection?.iconName 
                ? iconComponentMap[faqSection.iconName] 
                : HelpCircle;

              return (
                <div key={category} className="surface rounded-2xl border border-border overflow-hidden">
                  {/* Category Header */}
                  <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-muted/30">
                    <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <IconComponent className="w-4 h-4 text-violet-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">{category}</h3>
                  </div>

                  {/* Questions */}
                  <div className="divide-y divide-border">
                    {faqSection?.questions.map((item, index) => (
                      <details key={`faq-${index}`} className="group">
                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors list-none">
                          <span className="font-medium text-foreground/90 group-hover:text-foreground transition-colors pr-4">
                            {item.q}
                          </span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
                        </summary>
                        <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">
                          {item.a}
                        </div>
                      </details>
                    ))}

                    {/* DB Articles */}
                    {dbItems.map((item) => (
                      <details key={item.id} className="group">
                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/50 transition-colors list-none">
                          <span className="font-medium text-foreground/90 group-hover:text-foreground transition-colors pr-4">
                            {item.title}
                          </span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
                        </summary>
                        <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Still Need Help? */}
        <div className="surface rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is here to help you.
          </p>
          <a href="mailto:support@aistudio.com">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-primary-foreground shadow-glow">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
