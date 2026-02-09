"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home,
  HelpCircle,
  Settings,
  LayoutDashboard,
  Palette,
  MessageSquare,
  GalleryHorizontalEnd,
  CreditCard,
  Wand2,
  Sparkles,
  Plus,
  PanelLeftClose,
  LogIn,
  type LucideIcon
} from "lucide-react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/app/components/ui/button";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { cn } from "@/lib/utils";

// Icon map for string-to-component conversion
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Palette,
  MessageSquare,
  Wand2,
  GalleryHorizontalEnd,
  CreditCard,
  HelpCircle,
  Settings,
  Home
};

// Static labels for sidebar items
const sidebarLabels: Record<string, string> = {
  platform: "Platform",
  support: "Support",
  dashboard: "Dashboard",
  aiStudio: "AI Studio",
  aiChat: "AI Chat",
  aiTools: "AI Tools",
  myCreations: "My Creations",
  billing: "Billing",
  help: "Help",
  settings: "Settings",
  backToHome: "Back to Home",
};

interface MenuItem {
  name: string;
  href: string;
  iconName: string;
  highlight?: boolean;
  labelKey: string;
}

interface PlatformSidebarProps {
  menuItems: MenuItem[];
}

export function PlatformSidebar({ menuItems }: PlatformSidebarProps) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Whether sidebar is expanded - based on pin or hover state
  const isExpanded = isPinned || isHovered;

  const isActive = (href: string) => {
    if (href === "/platform") {
      return pathname === "/platform";
    }
    return pathname.startsWith(href);
  };

  // Load pinned state from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("platform-sidebar-pinned");
    if (saved !== null) {
      setIsPinned(saved === "true");
    }
    
    // Restore scroll position
    const savedScroll = localStorage.getItem("platform-sidebar-scroll");
    if (savedScroll && navRef.current) {
      navRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // Save pinned state to localStorage and update main content margin
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("platform-sidebar-pinned", String(isPinned));
      // Update main content margin via CSS custom property (desktop only)
      const isMobileView = window.innerWidth < 768;
      if (!isMobileView) {
        document.documentElement.style.setProperty(
          "--platform-sidebar-width", 
          isPinned ? "192px" : "60px"
        );
      }
    }
  }, [isPinned, mounted]);

  // Handle window resize to reset margin on mobile
  useEffect(() => {
    if (!mounted) return;
    
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      if (isMobileView) {
        // Mobile: no margin needed, sidebar is overlay
        document.documentElement.style.setProperty("--platform-sidebar-width", "0px");
      } else {
        // Desktop: apply pinned state
        document.documentElement.style.setProperty(
          "--platform-sidebar-width", 
          isPinned ? "192px" : "60px"
        );
      }
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPinned, mounted]);

  // Save scroll position
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    localStorage.setItem("platform-sidebar-scroll", String(scrollTop));
  }, []);

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-card border-r border-border/50 hidden md:flex flex-col transition-all duration-300 ease-out",
        isExpanded ? "w-48" : "w-[60px]"
      )}
      onMouseEnter={() => !isPinned && setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      {/* Logo Area */}
      <div className="h-11 flex items-center px-3 border-b border-border/50 justify-between">
        {isExpanded ? (
          <>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-medium text-xs text-foreground">AI Studio</span>
            </Link>
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isPinned 
                  ? "text-primary bg-primary/10 hover:bg-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              title={isPinned ? "Unpin sidebar (will auto-hide)" : "Pin sidebar (keep open)"}
            >
              <PanelLeftClose size={14} className={cn(!isPinned && "rotate-180")} />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Create Button */}
      <div className="px-2 py-2">
        <Link href="/platform/studio">
          <Button size="sm" className={cn("w-full", !isExpanded && "px-2")}>
            <Plus className="w-3 h-3" />
            {isExpanded && "Create"}
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav 
        ref={navRef}
        className="flex-1 px-2 py-1 space-y-px overflow-y-auto custom-scrollbar"
        onScroll={handleScroll}
      >
        {isExpanded && <p className="nav-section-title">{sidebarLabels.platform}</p>}
        
        {menuItems.map((item) => {
          const IconComponent = iconMap[item.iconName];
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "nav-item",
                item.highlight && "text-primary",
                isActive(item.href) && "bg-accent text-foreground",
                !isExpanded && "justify-center px-2"
              )}
              title={!isExpanded ? (sidebarLabels[item.labelKey] || item.name) : undefined}
            >
              {IconComponent && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
              {isExpanded && <span>{sidebarLabels[item.labelKey] || item.name}</span>}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2 h-px bg-border/50" />

        {isExpanded && <p className="nav-section-title">{sidebarLabels.support}</p>}
        
        <Link 
          href="/platform/help" 
          className={cn(
            "nav-item",
            isActive("/platform/help") && "bg-accent text-foreground",
            !isExpanded && "justify-center px-2"
          )}
          title={!isExpanded ? sidebarLabels.help : undefined}
        >
          <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {isExpanded && <span>{sidebarLabels.help}</span>}
        </Link>

        <Link 
          href="/platform/settings" 
          className={cn(
            "nav-item",
            isActive("/platform/settings") && "bg-accent text-foreground",
            !isExpanded && "justify-center px-2"
          )}
          title={!isExpanded ? sidebarLabels.settings : undefined}
        >
          <Settings className="w-3.5 h-3.5 flex-shrink-0" />
          {isExpanded && <span>{sidebarLabels.settings}</span>}
        </Link>

        {/* Divider */}
        <div className="my-2 h-px bg-border/50" />

        <Link 
          href="/" 
          className={cn(
            "nav-item text-muted-foreground hover:text-foreground",
            !isExpanded && "justify-center px-2"
          )}
          title={!isExpanded ? sidebarLabels.backToHome : undefined}
        >
          <Home className="w-3.5 h-3.5 flex-shrink-0" />
          {isExpanded && <span>{sidebarLabels.backToHome}</span>}
        </Link>
      </nav>

      {/* User Footer */}
      <div className="p-2 border-t border-border/50">
        <div className={cn(
          "flex items-center gap-2",
          !isExpanded && "flex-col gap-1"
        )}>
          {isLoaded && isSignedIn ? (
            <>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 rounded-md"
                  }
                }}
              />
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">Account</p>
                </div>
              )}
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className={cn(
                  "flex items-center gap-2 p-1.5 rounded-md text-xs font-medium",
                  "bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
                  !isExpanded && "p-2"
                )}>
                  <LogIn className="w-4 h-4" />
                  {isExpanded && <span>Sign In</span>}
                </button>
              </SignInButton>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Guest</p>
                </div>
              )}
            </>
          )}
          <ThemeToggle size="sm" />
        </div>
      </div>
    </aside>
  );
}
