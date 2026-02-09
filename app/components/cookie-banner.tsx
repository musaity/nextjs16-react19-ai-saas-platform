"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart3, Target, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

interface CookieSettings {
  isEnabled: boolean;
  title: string;
  message: string;
  acceptAllLabel: string;
  acceptNecessaryLabel: string;
  customizeLabel: string;
  savePreferencesLabel: string;
  privacyPolicyUrl: string;
  privacyPolicyLabel: string;
  enableAnalytics: boolean;
  enableMarketing: boolean;
  enableFunctional: boolean;
  analyticsDescription: string;
  marketingDescription: string;
  functionalDescription: string;
  necessaryDescription: string;
  position: string;
  theme: string;
  consentExpireDays: number;
}

interface CookieBannerProps {
  settings: CookieSettings;
}

const COOKIE_CONSENT_KEY = "cookie-consent";

export function CookieBanner({ settings }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    analytics: true,
    marketing: true,
    functional: true,
  });

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent && settings.isEnabled) {
      // Small delay for smoother appearance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [settings.isEnabled]);

  const saveConsent = (type: "all" | "necessary" | "custom") => {
    const consentData = {
      type,
      preferences: type === "all" 
        ? { necessary: true, analytics: true, marketing: true, functional: true }
        : type === "necessary"
        ? { necessary: true, analytics: false, marketing: false, functional: false }
        : preferences,
      timestamp: new Date().toISOString(),
      expiry: new Date(Date.now() + settings.consentExpireDays * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setIsVisible(false);

    // Trigger analytics if accepted
    if (consentData.preferences.analytics && typeof window !== "undefined") {
      // Enable Google Analytics or other tracking
      window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consentData }));
    }
  };

  if (!settings.isEnabled || !isVisible) return null;

  const positionClasses = {
    "bottom": "bottom-0 left-0 right-0 mx-auto max-w-4xl",
    "bottom-left": "bottom-4 left-4 max-w-md",
    "bottom-right": "bottom-4 right-4 max-w-md",
  }[settings.position] || "bottom-0 left-0 right-0 mx-auto max-w-4xl";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed ${positionClasses} z-[9999] p-4`}
        >
          <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
                    <Cookie className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{settings.title}</h3>
                </div>
                <button
                  onClick={() => saveConsent("necessary")}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {settings.message}{" "}
                <Link 
                  href={settings.privacyPolicyUrl} 
                  className="text-primary hover:underline font-medium"
                >
                  {settings.privacyPolicyLabel}
                </Link>
              </p>
            </div>

            {/* Customize Section */}
            <AnimatePresence>
              {showCustomize && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 space-y-3">
                    {/* Necessary - Always On */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                          <Shield className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Necessary</p>
                          <p className="text-xs text-muted-foreground">{settings.necessaryDescription}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                        Always On
                      </div>
                    </div>

                    {/* Analytics */}
                    {settings.enableAnalytics && (
                      <label className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-500/10 rounded-lg">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Analytics</p>
                            <p className="text-xs text-muted-foreground">{settings.analyticsDescription}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </label>
                    )}

                    {/* Marketing */}
                    {settings.enableMarketing && (
                      <label className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-pink-500/10 rounded-lg">
                            <Target className="w-4 h-4 text-pink-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Marketing</p>
                            <p className="text-xs text-muted-foreground">{settings.marketingDescription}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </label>
                    )}

                    {/* Functional */}
                    {settings.enableFunctional && (
                      <label className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-violet-500/10 rounded-lg">
                            <Sparkles className="w-4 h-4 text-violet-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Functional</p>
                            <p className="text-xs text-muted-foreground">{settings.functionalDescription}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </label>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="p-4 pt-2 border-t border-border bg-muted/30">
              <div className="flex flex-wrap items-center gap-3">
                {!showCustomize ? (
                  <>
                    <Button
                      onClick={() => saveConsent("all")}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {settings.acceptAllLabel}
                    </Button>
                    <Button
                      onClick={() => saveConsent("necessary")}
                      variant="outline"
                      className="flex-1 border-border hover:bg-muted"
                    >
                      {settings.acceptNecessaryLabel}
                    </Button>
                    <Button
                      onClick={() => setShowCustomize(true)}
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {settings.customizeLabel}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => saveConsent("custom")}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {settings.savePreferencesLabel}
                    </Button>
                    <Button
                      onClick={() => setShowCustomize(false)}
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Collapse
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
