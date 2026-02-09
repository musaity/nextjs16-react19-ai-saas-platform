import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, Zap, ShieldCheck, CreditCard, Sparkles, Star, LogIn } from "lucide-react";
import { createCheckoutSession } from "./stripe-actions"; // Import Server Action
import Link from "next/link";

// Force dynamic to ensure we always fetch the latest plans
export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  // Guest mode flag
  const isGuest = !userId || !user;

  // 1. FETCH USER DATA (only if signed in)
  let dbUser = null;
  if (!isGuest) {
    dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, stripeCustomerId: true }
    });
  }

  // 2. FETCH ACTIVE PLANS FROM DB
  const plans = await prisma.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" }
  });

  // Handle Success/Cancel messages from URL
  const isSuccess = searchParams.success === "true";
  const isCanceled = searchParams.canceled === "true";

  // Helper for number formatting (e.g., 10,000)
  const numberFormatter = new Intl.NumberFormat('en-US');

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8 animate-fade-in">
      
        {/* Header & Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                <CreditCard className="w-6 h-6 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Billing & Plans</h1>
            </div>
            <p className="text-muted-foreground">
              {isGuest ? "Sign in to purchase credits and start creating." : "Manage your subscription and credit balance."}
            </p>
          </div>
          <div className="flex items-center gap-4 surface rounded-2xl px-6 py-4 border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-violet-400 font-medium uppercase tracking-wider">
                {isGuest ? "Get Started" : "Available Credits"}
              </p>
              {isGuest ? (
                <Link href="/sign-in" className="text-lg font-bold text-foreground hover:text-violet-400 transition-colors flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {numberFormatter.format(dbUser?.credits || 0)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Guest Banner */}
        {isGuest && (
          <div className="surface p-6 border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Get 5 Free Credits</h3>
                  <p className="text-sm text-muted-foreground">Sign up now and start creating amazing AI content immediately.</p>
                </div>
              </div>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Notifications */}
        {isSuccess && (
          <div className="glass bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Payment successful!</p>
              <p className="text-sm text-emerald-400/70">Your credits have been added to your account.</p>
            </div>
          </div>
        )}
        {isCanceled && (
          <div className="glass bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Payment canceled</p>
              <p className="text-sm text-red-400/70">No charges were made to your account.</p>
            </div>
          </div>
        )}

        {/* PLANS GRID */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted border border-border">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Top Up Credits</h2>
          </div>
          
          {plans.length === 0 ? (
            <div className="text-center py-16 surface border border-border rounded-2xl text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No plans available at the moment.</p>
              <p className="text-sm mt-1 text-muted-foreground/50">Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                // Format credits for display (e.g. 10,000)
                const formattedPlanCredits = numberFormatter.format(plan.credits);

                return (
                  <div 
                    key={plan.id} 
                    className={`relative p-6 rounded-2xl flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                      plan.isPopular 
                      ? "surface border-2 border-violet-500/50 shadow-glow" 
                      : "surface border border-border hover:border-violet-500/30"
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-glow flex items-center gap-1">
                        <Star className="w-3 h-3" fill="currentColor" />
                        Best Value
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-foreground">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-3">
                        <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      </div>
                      <p className="text-violet-400 font-semibold text-sm mt-2 flex items-center gap-1.5">
                        <Zap className="w-4 h-4" />
                        {formattedPlanCredits} Credits
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isGuest ? (
                      <Link href="/sign-in">
                        <Button className={`w-full font-semibold h-12 rounded-xl ${
                          plan.isPopular 
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-glow" 
                          : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                        }`}>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign in to Purchase
                        </Button>
                      </Link>
                    ) : (
                      <form action={async () => {
                        "use server";
                        // 1. Create Checkout Session
                        const response = await createCheckoutSession(plan.id);
                        
                        // 2. Redirect if URL exists
                        if (response.url) {
                          redirect(response.url);
                        }
                      }}>
                        <Button className={`w-full font-semibold h-12 rounded-xl ${
                          plan.isPopular 
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-glow" 
                          : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                        }`}>
                          Purchase
                        </Button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}