import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Zap, Sparkles, ArrowRight, CreditCard, Image, Video, TrendingUp, LogIn } from "lucide-react";

// Daily free credits limit
const DAILY_FREE_CREDITS = 3; 

export default async function PlatformPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  // Guest mode - no user logged in
  const isGuest = !userId || !user;
  
  let dbUser: { credits: number; lastRefill: Date } | null = null;
  
  if (!isGuest) {
    dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Create user if not exists (First Registration)
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: user!.emailAddresses[0].emailAddress,
          credits: 5, // Welcome bonus
          lastRefill: new Date(),
        },
      });
    } else {
      // Daily free credits logic
      const now = new Date();
      const lastRefillDate = new Date(dbUser.lastRefill);
      
      const isDifferentDay = 
        now.getDate() !== lastRefillDate.getDate() ||
        now.getMonth() !== lastRefillDate.getMonth() ||
        now.getFullYear() !== lastRefillDate.getFullYear();

      if (isDifferentDay && dbUser.credits < 10) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: { increment: DAILY_FREE_CREDITS },
            lastRefill: now
          }
        });
        dbUser.credits += DAILY_FREE_CREDITS;
      }
    }
  }

  const userCredits = dbUser?.credits || 0;

  return (
    <div className="p-3 md:p-4 max-w-5xl mx-auto space-y-4 animate-fade-in">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b border-border/50">
            <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                    <div className="status-dot-success" />
                    <span>All systems operational</span>
                </div>
                <h1 className="text-base font-medium text-foreground">
                    {isGuest ? (
                      <>Welcome to <span className="text-primary">AI Platform</span></>
                    ) : (
                      <>Welcome back, <span className="text-primary">{user?.firstName || "User"}</span></>
                    )}
                </h1>
            </div>
            
            {isGuest ? (
              <Link href="/sign-in">
                <Button size="sm" className="gap-1.5">
                  <LogIn className="w-3 h-3" />
                  Sign In to Start
                </Button>
              </Link>
            ) : (
              <Link href="/platform/billing">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                    <Zap className="w-3 h-3 text-warning" />
                    <span className="font-medium text-foreground">{userCredits}</span>
                    <span>credits</span>
                </Button>
              </Link>
            )}
        </div>

        {/* Guest Banner */}
        {isGuest && (
          <div className="surface p-4 border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Start Creating with AI</h3>
                  <p className="text-xs text-muted-foreground">Sign up free and get 5 credits to start generating images, videos, and more.</p>
                </div>
              </div>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
                  Get Free Credits
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* Hero Feature Card - AI Studio */}
            <div className="lg:col-span-2 surface p-4 flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">AI Studio</span>
                </div>
                
                <div className="space-y-1">
                    <h2 className="text-sm font-medium text-foreground">Creative Studio</h2>
                    <p className="text-xs text-muted-foreground max-w-md">
                        Generate images with Gemini, videos with Kling AI, or chat with advanced models.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link href="/platform/studio">
                        <Button>
                            Launch Studio 
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>

                    <div className="flex gap-1.5">
                        <span className="badge-default">
                            <Image className="w-2.5 h-2.5 mr-0.5" /> Images
                        </span>
                        <span className="badge-default">
                            <Video className="w-2.5 h-2.5 mr-0.5" /> Videos
                        </span>
                    </div>
                </div>
            </div>

            {/* Subscription Card */}
            <div className="surface p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Your Plan</span>
                </div>
                
                <div className="p-2.5 rounded bg-muted/30">
                    <div className="text-2xs text-muted-foreground">Current</div>
                    <div className="text-sm font-medium text-foreground">{isGuest ? "Guest" : "Free Tier"}</div>
                    <div className="flex items-center gap-1 mt-1 text-2xs text-muted-foreground">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span>{userCredits} credits</span>
                    </div>
                </div>
                
                <div className="space-y-1 text-2xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <div className="status-dot-success" /> Daily Credits
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="status-dot-success" /> All AI Models
                    </div>
                </div>

                <Link href={isGuest ? "/sign-up" : "/platform/billing"} className="mt-auto">
                    <Button variant="secondary" size="sm" className="w-full">
                        {isGuest ? "Sign Up" : "Upgrade"}
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </Link>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Link href="/platform/studio" className="surface p-3 hover:bg-accent/50 transition-colors">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center mb-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <h4 className="text-xs font-medium text-foreground">Generate</h4>
                <p className="text-2xs text-muted-foreground">Create images</p>
            </Link>
            
            <Link href="/platform/gallery" className="surface p-3 hover:bg-accent/50 transition-colors">
                <div className="w-6 h-6 rounded bg-success/10 flex items-center justify-center mb-2">
                    <Image className="w-3 h-3 text-success" />
                </div>
                <h4 className="text-xs font-medium text-foreground">Gallery</h4>
                <p className="text-2xs text-muted-foreground">View creations</p>
            </Link>
            
            <Link href="/platform/billing" className="surface p-3 hover:bg-accent/50 transition-colors">
                <div className="w-6 h-6 rounded bg-warning/10 flex items-center justify-center mb-2">
                    <Zap className="w-3 h-3 text-warning" />
                </div>
                <h4 className="text-xs font-medium text-foreground">Credits</h4>
                <p className="text-2xs text-muted-foreground">Buy more</p>
            </Link>
            
            <Link href="/platform/studio" className="surface p-3 hover:bg-accent/50 transition-colors">
                <div className="w-6 h-6 rounded bg-destructive/10 flex items-center justify-center mb-2">
                    <Video className="w-3 h-3 text-destructive" />
                </div>
                <h4 className="text-xs font-medium text-foreground">Video</h4>
                <p className="text-2xs text-muted-foreground">Kling AI</p>
            </Link>
        </div>
    </div>
  );
}