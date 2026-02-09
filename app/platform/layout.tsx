import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { 
  Zap, 
  Sparkles,
  ChevronRight,
  Home
} from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";
import { PlatformSidebar } from "./platform-sidebar";
import { FormFeedback } from "@/app/admin/components/form-feedback";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  // Check maintenance mode
  const settings = await prisma.globalSettings.findFirst();
  if (settings?.isMaintenance) {
    redirect("/maintenance");
  }

  // Only fetch user data if logged in
  let user: { credits: number; isBlocked: boolean } | null = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, isBlocked: true }
    });

    // Block access for suspended users
    if (user?.isBlocked) {
      redirect("/maintenance?reason=blocked");
    }
  }

  const menuItems = [
    { name: "Dashboard", href: "/platform", iconName: "LayoutDashboard", labelKey: "dashboard" },
    { name: "AI Studio", href: "/platform/studio", iconName: "Palette", highlight: true, labelKey: "aiStudio" },
    { name: "AI Chat", href: "/platform/chat", iconName: "MessageSquare", labelKey: "aiChat" },
    { name: "My Creations", href: "/platform/gallery", iconName: "GalleryHorizontalEnd", labelKey: "myCreations" },
    { name: "Billing", href: "/platform/billing", iconName: "CreditCard", labelKey: "billing" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">

      {/* ═══════════════════════════════════════════════════════════════════════
          SIDEBAR - Mouse-sensitive, collapsible (Client Component)
          ═══════════════════════════════════════════════════════════════════════ */}
      <PlatformSidebar menuItems={menuItems} />

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-h-screen transition-[margin] duration-300 md:ml-[var(--platform-sidebar-width,192px)]">
        
        {/* Top Header */}
        <header className="h-12 bg-card border-b border-border/50 sticky top-0 z-40 px-4 flex items-center justify-between">
          
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-2 md:hidden">
            <MobileSidebar menuItems={menuItems} userCredits={user?.credits || 0} />
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-medium text-sm">AI Studio</span>
          </div>
          
          {/* Breadcrumb - Desktop */}
          <div className="hidden md:flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">Platform</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-foreground">Dashboard</span>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5">
            {/* Credit Display */}
            <Link href="/platform/billing" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50 hover:bg-accent transition-colors">
              <Zap className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-medium">{user?.credits || 0}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">Credits</span>
            </Link>
            
            {/* Theme Toggle - Visible in header */}
            <ThemeToggle size="default" />
            
            {/* Home Link */}
            <Link href="/" className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Ana Sayfa">
              <Home className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          <Suspense fallback={null}>
            <FormFeedback />
          </Suspense>
          {children}
        </div>
      </main>
    </div>
  );
}