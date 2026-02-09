"use client";

import { useRef, useEffect, useCallback } from "react";
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
  type LucideIcon
} from "lucide-react";
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

interface SidebarNavProps {
  menuItems: MenuItem[];
}

export function SidebarNav({ menuItems }: SidebarNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => {
    if (href === "/platform") {
      return pathname === "/platform";
    }
    return pathname.startsWith(href);
  };

  // Restore scroll position
  useEffect(() => {
    const savedScroll = localStorage.getItem("platform-sidebar-scroll");
    if (savedScroll && navRef.current) {
      navRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // Save scroll position
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    localStorage.setItem("platform-sidebar-scroll", String(scrollTop));
  }, []);

  return (
    <nav 
      ref={navRef}
      className="flex-1 px-2 py-1 space-y-px overflow-y-auto custom-scrollbar"
      onScroll={handleScroll}
    >
      <p className="nav-section-title">{sidebarLabels.platform}</p>
      
      {menuItems.map((item) => {
        const IconComponent = iconMap[item.iconName];
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "nav-item",
              item.highlight && "text-primary",
              isActive(item.href) && "bg-accent text-foreground"
            )}
          >
            {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
            <span>{sidebarLabels[item.labelKey] || item.name}</span>
          </Link>
        );
      })}

      {/* Divider */}
      <div className="my-2 h-px bg-border/50" />

      <p className="nav-section-title">{sidebarLabels.support}</p>
      
      <Link 
        href="/platform/help" 
        className={cn(
          "nav-item",
          isActive("/platform/help") && "bg-accent text-foreground"
        )}
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>{sidebarLabels.help}</span>
      </Link>

      <Link 
        href="/platform/settings" 
        className={cn(
          "nav-item",
          isActive("/platform/settings") && "bg-accent text-foreground"
        )}
      >
        <Settings className="w-3.5 h-3.5" />
        <span>{sidebarLabels.settings}</span>
      </Link>

      {/* Divider */}
      <div className="my-2 h-px bg-border/50" />

      <Link href="/" className="nav-item text-muted-foreground hover:text-foreground">
        <Home className="w-3.5 h-3.5" />
        <span>{sidebarLabels.backToHome}</span>
      </Link>
    </nav>
  );
}
