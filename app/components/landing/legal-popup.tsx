"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { X, Shield, ScrollText, Cookie, CreditCard, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type LegalType = "terms" | "privacy" | "cookies" | "refund" | "gdpr";

interface LegalContent {
  title: string;
  content: string;
  version: string;
  updatedAt: string;
}

const legalMeta: Record<LegalType, { title: string; icon: React.ReactNode; color: string }> = {
  terms: {
    title: "Terms of Service",
    icon: <ScrollText className="w-5 h-5" />,
    color: "from-blue-500 to-indigo-600",
  },
  privacy: {
    title: "Privacy Policy",
    icon: <Shield className="w-5 h-5" />,
    color: "from-green-500 to-emerald-600",
  },
  cookies: {
    title: "Cookie Policy",
    icon: <Cookie className="w-5 h-5" />,
    color: "from-amber-500 to-orange-600",
  },
  refund: {
    title: "Refund Policy",
    icon: <CreditCard className="w-5 h-5" />,
    color: "from-purple-500 to-violet-600",
  },
  gdpr: {
    title: "GDPR Compliance",
    icon: <Shield className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-600",
  },
};

interface LegalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalType;
}

export function LegalPopup({ isOpen, onClose, type }: LegalPopupProps) {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const meta = legalMeta[type];

  useEffect(() => {
    if (isOpen && type) {
      setLoading(true);
      setError(null);
      
      fetch(`/api/legal/${type}`)
        .then(res => {
          if (!res.ok) throw new Error("Content not found");
          return res.json();
        })
        .then(data => {
          setContent(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load content");
          setLoading(false);
        });
    }
  }, [isOpen, type]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
      />

      {/* Modal Container - clicking outside modal closes it */}
      <div
        onClick={onClose}
        className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center animate-fade-in-up"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-full bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
        >
              {/* Header */}
              <div className={cn(
                "sticky top-0 z-10 px-6 py-4 border-b border-border",
                "bg-gradient-to-r", meta.color,
                "text-white"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      {meta.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{meta.title}</h2>
                      {content && (
                        <p className="text-sm text-white/80">
                          Version {content.version} • Updated {new Date(content.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/legal/${type}`}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      title="Open in new page"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">{error}</p>
                    <Link
                      href={`/legal/${type}`}
                      className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      View full page <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ) : content ? (
                  <div 
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                      prose-headings:font-semibold prose-headings:text-foreground
                      prose-p:text-muted-foreground prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                      prose-li:marker:text-primary
                      whitespace-pre-wrap"
                  >
                    {content.content}
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-muted/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    By using our service, you agree to these terms.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    I Understand
                  </button>
                </div>
              </div>
        </div>
      </div>
    </>
  );
}

// Hook for managing legal popup state
export function useLegalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<LegalType>("terms");

  const openPopup = (legalType: LegalType) => {
    setType(legalType);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return { isOpen, type, openPopup, closePopup };
}
