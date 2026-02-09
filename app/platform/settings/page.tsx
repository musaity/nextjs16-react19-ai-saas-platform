import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import SettingsClient from "./settings-client";
import Link from "next/link";
import { Settings, LogIn, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  const clerkUser = userId ? await currentUser() : null;

  // Guest mode - show sign-in prompt
  if (!userId || !clerkUser) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center p-6">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="surface rounded-3xl border border-border p-12 text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mb-6">
            <Settings className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Sign in to access Settings</h2>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to manage your profile, security settings, and billing information.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/sign-in" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link 
              href="/platform/studio" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, email: true, createdAt: true }
  });

  // Extract only serializable user data needed for the client
  const userData = {
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    imageUrl: clerkUser.imageUrl || "",
    email: clerkUser.emailAddresses[0]?.emailAddress || "Not set",
  };

  const settingsSections = [
    {
      title: "Account",
      description: "Manage your personal information",
      iconName: "User",
      items: [
        { label: "Profile", description: "Update your name and photo", href: "/platform/settings/profile", external: false },
        { label: "Email", description: userData.email, href: "/platform/settings/profile", external: false },
      ]
    },
    {
      title: "Security",
      description: "Keep your account secure",
      iconName: "Shield",
      items: [
        { label: "Password", description: "Change your password", href: "/platform/settings/profile/security", external: false },
        { label: "Two-Factor Auth", description: "Add extra security to your account", href: "/platform/settings/profile/security", external: false },
      ]
    },
    {
      title: "Billing",
      description: "Manage your subscription",
      iconName: "CreditCard",
      items: [
        { label: "Current Credits", description: `${dbUser?.credits || 0} credits available`, href: "/platform/billing", external: false },
        { label: "Purchase History", description: "View your past purchases", href: "/platform/billing", external: false },
      ]
    },
  ];

  return (
    <SettingsClient 
      user={userData}
      dbUser={dbUser}
      settingsSections={settingsSections}
    />
  );
}
