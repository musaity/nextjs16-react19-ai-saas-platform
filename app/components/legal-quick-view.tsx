"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/app/components/ui/dialog";
import { 
  ScrollText, 
  Shield, 
  CreditCard, 
  Cookie, 
  ExternalLink,
  X,
  Loader2
} from "lucide-react";

type LegalType = "terms" | "privacy" | "refund" | "cookies";

interface LegalQuickViewProps {
  type: LegalType;
  isOpen: boolean;
  onClose: () => void;
}

const legalMeta: Record<LegalType, { title: string; icon: React.ReactNode }> = {
  terms: { title: "Terms of Service", icon: <ScrollText className="w-5 h-5" /> },
  privacy: { title: "Privacy Policy", icon: <Shield className="w-5 h-5" /> },
  refund: { title: "Refund Policy", icon: <CreditCard className="w-5 h-5" /> },
  cookies: { title: "Cookie Policy", icon: <Cookie className="w-5 h-5" /> },
};

export function LegalQuickView({ type, isOpen, onClose }: LegalQuickViewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = legalMeta[type];

  useEffect(() => {
    if (isOpen && !content) {
      fetchContent();
    }
  }, [isOpen, type]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/legal/${type}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load content");
      }
      
      setContent(data.data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {meta.icon}
            </div>
            <div>
              <DialogTitle className="text-xl">{meta.title}</DialogTitle>
              <DialogDescription>Quick preview - scroll to read</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={fetchContent}>
                Try Again
              </Button>
            </div>
          ) : content ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No content available
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-border flex items-center justify-between">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href={`/legal/${type}`} target="_blank">
            <Button variant="outline" className="gap-2">
              Open Full Page
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Footer Links Component with Quick View
export function LegalFooterLinks() {
  const [activeModal, setActiveModal] = useState<LegalType | null>(null);

  const links: { type: LegalType; label: string }[] = [
    { type: "terms", label: "Terms" },
    { type: "privacy", label: "Privacy" },
    { type: "refund", label: "Refunds" },
    { type: "cookies", label: "Cookies" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <button
            key={link.type}
            onClick={() => setActiveModal(link.type)}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </div>

      {activeModal && (
        <LegalQuickView
          type={activeModal}
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
