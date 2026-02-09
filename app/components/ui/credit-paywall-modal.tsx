"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { 
  Zap, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  LogIn,
  Loader2,
  CreditCard
} from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";

// Types
type PricingPlan = {
  id: string;
  name: string;
  credits: number;
  price: number;
  features: string[];
  isPopular: boolean;
};

interface CreditPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  currentCredits?: number;
  actionType?: "image" | "video" | "chat" | "generation";
}

export function CreditPaywallModal({
  isOpen,
  onClose,
  requiredCredits = 1,
  currentCredits = 0,
  actionType = "generation"
}: CreditPaywallModalProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  // Fetch plans when modal opens
  useEffect(() => {
    if (isOpen && isSignedIn) {
      fetchPlans();
    }
  }, [isOpen, isSignedIn]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        // Filter only active plans
        setPlans(data.filter((p: PricingPlan & { isActive?: boolean }) => p.isActive !== false));
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    setPurchaseLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setPurchaseLoading(null);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getActionLabel = () => {
    switch (actionType) {
      case "image": return "generate images";
      case "video": return "create videos";
      case "chat": return "chat with AI";
      default: return "use AI features";
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Not signed in - Show auth prompt
  if (!isSignedIn) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-full sm:max-w-md border-violet-500/20 bg-gradient-to-b from-card to-card/95 p-6">
          <div className="relative overflow-hidden">
            {/* Ambient glow - proportional to smaller modal */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <DialogHeader className="text-center space-y-4 relative">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Sign in to Continue
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Create an account or sign in to {getActionLabel()} and unlock all AI features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4 relative">
            {/* Features list */}
            <div className="grid grid-cols-2 gap-3 py-4">
              {[
                "AI Image Generation",
                "AI Video Creation", 
                "Chat with AI Models",
                "Save Your Creations"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Welcome bonus badge */}
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">
                Get <span className="text-violet-400 font-bold">5 free credits</span> when you sign up!
              </span>
            </div>
            
            {/* Auth buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <SignInButton mode="modal">
                <Button className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-glow">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In / Sign Up
                </Button>
              </SignInButton>
              
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Signed in but insufficient credits - Show pricing plans
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl border-violet-500/20 bg-gradient-to-b from-card to-card/95 p-4 sm:p-6">
        <div className="relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 sm:w-60 h-40 sm:h-60 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 sm:w-60 h-40 sm:h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="text-center space-y-2 sm:space-y-3 relative">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow">
            <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Get More Credits
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            {currentCredits < requiredCredits ? (
              <>You need <span className="text-violet-400 font-semibold">{requiredCredits} credits</span> for this action. 
              You have <span className="text-foreground font-semibold">{currentCredits}</span>.</>
            ) : (
              <>Purchase credits to continue using AI features.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-3 sm:pt-4 relative">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-sm sm:text-base">No credit plans available at the moment.</p>
              <Button 
                variant="outline" 
                onClick={() => router.push("/platform/billing")}
                className="mt-3 sm:mt-4"
              >
                Go to Billing Page
              </Button>
            </div>
          ) : (
            <>
              {/* Plans Grid - Stack on mobile, 3 cols on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                {plans.slice(0, 3).map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl sm:rounded-2xl flex flex-col transition-all duration-300 hover:scale-[1.02] border-2 ${
                      plan.isPopular
                        ? "bg-gradient-to-br from-violet-500/5 to-purple-500/5 border-violet-500 pt-8 sm:pt-10 p-4 sm:p-5"
                        : "bg-muted/30 border-border hover:border-violet-500/50 p-4 sm:p-5"
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1.5 rounded-b-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3" fill="currentColor" />
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1.5 sm:mt-2">
                        <span className="text-2xl sm:text-3xl font-bold text-foreground">${plan.price}</span>
                      </div>
                      <p className="text-violet-400 font-medium text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                        {formatNumber(plan.credits)} Credits
                      </p>
                    </div>

                    <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 flex-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePurchase(plan.id)}
                      disabled={purchaseLoading !== null}
                      size="sm"
                      className={`w-full ${
                        plan.isPopular 
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white" 
                          : "bg-muted hover:bg-muted/80 border border-border"
                      }`}
                    >
                      {purchaseLoading === plan.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Purchase"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* View all plans link */}
              <div className="text-center pt-3 sm:pt-4">
                <Button 
                  variant="link" 
                  onClick={() => {
                    onClose();
                    router.push("/platform/billing");
                  }}
                  className="text-sm text-muted-foreground hover:text-violet-400"
                >
                  View all plans →
                </Button>
              </div>
            </>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
