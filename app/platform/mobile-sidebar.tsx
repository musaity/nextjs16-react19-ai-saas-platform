"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Sparkles, 
  Home, 
  HelpCircle, 
  Settings,
  Zap,
  LayoutDashboard,
  Palette,
  MessageSquare,
  Wand2,
  GalleryHorizontalEnd,
  CreditCard,
  Plus,
  PanelLeftClose,
  type LucideIcon
} from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Button } from "@/app/components/ui/button";
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

interface MobileSidebarProps {
  menuItems: MenuItem[];
  userCredits: number;
}

export function MobileSidebar({ menuItems, userCredits }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => {
    if (href === "/platform") {
      return pathname === "/platform";
    }
    return pathname.startsWith(href);
  };

  // Restore states from localStorage
  useEffect(() => {
    const savedExpanded = localStorage.getItem("platform-mobile-sidebar-expanded");
    if (savedExpanded !== null) {
      setIsExpanded(savedExpanded === "true");
    }
  }, []);

  // Save expanded state
  useEffect(() => {
    localStorage.setItem("platform-mobile-sidebar-expanded", String(isExpanded));
  }, [isExpanded]);

  // Restore scroll position
  useEffect(() => {
    if (isOpen && navRef.current) {
      const savedScroll = localStorage.getItem("platform-mobile-sidebar-scroll");
      if (savedScroll) {
        navRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, [isOpen]);

  // Save scroll position
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    localStorage.setItem("platform-mobile-sidebar-scroll", String(scrollTop));
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-md hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 bg-card border-r border-border z-50 transform transition-all duration-300 ease-out md:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isExpanded ? "w-64" : "w-[68px]"
        )}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-border/50">
          {isExpanded ? (
            <>
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-medium text-sm">AI Studio</span>
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between px-1">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  title="Expand sidebar"
                >
                  <PanelLeftClose size={16} className="rotate-180" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Create Button */}
        <div className="px-2 py-2">
          <Link href="/platform/studio" onClick={() => setIsOpen(false)}>
            <Button size="sm" className={cn("w-full", !isExpanded && "px-2")}>
              <Plus className="w-4 h-4" />
              {isExpanded && <span className="ml-1">Create</span>}
            </Button>
          </Link>
        </div>

        {/* Credits Display */}
        {isExpanded ? (
          <div className="px-2 pb-2">
            <Link 
              href="/platform/billing" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-accent transition-colors"
            >
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">{userCredits} Credits</span>
            </Link>
          </div>
        ) : (
          <div className="px-2 pb-2">
            <Link 
              href="/platform/billing" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center p-2 rounded-lg bg-muted/50 hover:bg-accent transition-colors"
              title={`${userCredits} Credits`}
            >
              <Zap className="w-4 h-4 text-warning" />
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav 
          ref={navRef}
          className="flex-1 px-2 py-2 space-y-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          {isExpanded && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {sidebarLabels.platform}
            </p>
          )}
          
          {menuItems.map((item) => {
            const IconComponent = iconMap[item.iconName];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  item.highlight && !isActive(item.href) && "text-primary",
                  !isExpanded && "justify-center px-2"
                )}
                title={!isExpanded ? (sidebarLabels[item.labelKey] || item.name) : undefined}
              >
                {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                {isExpanded && <span>{sidebarLabels[item.labelKey] || item.name}</span>}
              </Link>
            );
          })}

          <div className="my-3 h-px bg-border/50" />

          {isExpanded && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {sidebarLabels.support}
            </p>
          )}

          <Link
            href="/platform/help"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive("/platform/help")
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              !isExpanded && "justify-center px-2"
            )}
            title={!isExpanded ? sidebarLabels.help : undefined}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>{sidebarLabels.help}</span>}
          </Link>

          <Link
            href="/platform/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive("/platform/settings")
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              !isExpanded && "justify-center px-2"
            )}
            title={!isExpanded ? sidebarLabels.settings : undefined}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>{sidebarLabels.settings}</span>}
          </Link>

          <div className="my-3 h-px bg-border/50" />

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              !isExpanded && "justify-center px-2"
            )}
            title={!isExpanded ? sidebarLabels.backToHome : undefined}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {isExpanded && <span>{sidebarLabels.backToHome}</span>}
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50">
          <div className={cn(
            "flex items-center",
            isExpanded ? "justify-between" : "justify-center"
          )}>
            {isExpanded && <span className="text-xs text-muted-foreground">Theme</span>}
            <ThemeToggle size="default" />
          </div>
        </div>
      </div>
    </>
  );
}
