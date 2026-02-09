"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Building2, 
  Zap,
  CheckCircle2,
  ArrowLeft,
  Handshake,
  Headphones
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/lib/contact-actions";

const contactReasons = [
  { id: "enterprise", label: "Enterprise Plan", icon: Building2 },
  { id: "custom", label: "Custom Solution", icon: Zap },
  { id: "support", label: "Support", icon: Headphones },
  { id: "partnership", label: "Partnership", icon: Handshake },
  { id: "other", label: "Other Inquiry", icon: MessageSquare },
];

interface ContactPageClientProps {
  settings: {
    pageTitle: string;
    pageDescription: string;
    successTitle: string;
    successMessage: string;
    salesEmail: string;
    requireCompany: boolean;
    maxMessageLength: number;
    isActive: boolean;
  };
}

export function ContactClient({ settings }: ContactPageClientProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    reason: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use settings values directly
  const pageTitle = settings.pageTitle;
  const pageDescription = settings.pageDescription;
  const successTitle = settings.successTitle;
  const successMessage = settings.successMessage;
  const salesEmail = settings.salesEmail;
  const requireCompany = settings.requireCompany;
  const maxMessageLength = settings.maxMessageLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await submitContactForm({
        name: formState.name,
        email: formState.email,
        company: formState.company || undefined,
        reason: formState.reason || "other",
        message: formState.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {successTitle}
          </h1>
          <p className="text-muted-foreground mb-8">
            {successMessage}
          </p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Contact Sales
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {pageTitle}
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {pageDescription}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12",
              "bg-card border border-border/50",
              "shadow-xl"
            )}
          >
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Contact Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3 sm:mb-4">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {contactReasons.map((reason) => (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, reason: reason.id }))}
                      className={cn(
                        "p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left",
                        formState.reason === reason.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                    >
                      <reason.icon className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2",
                        formState.reason === reason.id ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-xs sm:text-sm font-medium",
                        formState.reason === reason.id ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {reason.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    required
                    placeholder="John Doe"
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    className="h-11 sm:h-12"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Work Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11 sm:h-12"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company Name {requireCompany && "*"}
                </label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  required={requireCompany}
                  value={formState.company}
                  onChange={(e) => setFormState(prev => ({ ...prev, company: e.target.value }))}
                  className="h-12"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Tell us about your needs *
                </label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  maxLength={maxMessageLength}
                  placeholder="Describe your requirements, team size, expected usage, or any specific features you need..."
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {formState.message.length}/{maxMessageLength}
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-14 text-base font-semibold gap-2",
                  "bg-gradient-to-r from-primary to-purple-600",
                  "hover:opacity-90 transition-opacity"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By submitting this form, you agree to our{" "}
                <Link href="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Prefer email? Reach us directly at{" "}
              <a 
                href={`mailto:${salesEmail}`} 
                className="text-primary hover:underline font-medium"
              >
                {salesEmail}
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
