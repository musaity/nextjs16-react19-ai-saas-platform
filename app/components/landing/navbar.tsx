"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Menu, X, Sparkles, ChevronDown, Zap, DollarSign, ImageIcon, Palette, MessageSquare, Wand2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";

// Database NavItem types
interface NavItemChild {
  id: string;
  name: string;
  href: string;
  icon: string | null;
  target: string | null;
  order: number;
}

interface DbNavItem {
  id: string;
  name: string;
  href: string;
  icon: string | null;
  target: string | null;
  order: number;
  children: NavItemChild[];
}

interface NavbarProps {
  branding: {
    logoUrl: string | null;
    darkLogoUrl: string | null;
    brandName: string;
  };
  navItems?: DbNavItem[];
}

interface NavItem {
  name: string;
  href: string;
  subItems?: { name: string; href: string; icon: React.ReactNode; description: string }[];
}

// Helper function to get Lucide icon by name
function getIconByName(iconName: string | null): React.ReactNode {
  if (!iconName) return null;
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  if (Icon) {
    return <Icon className="w-4 h-4" />;
  }
  return <LucideIcons.Circle className="w-4 h-4" />;
}

export function Navbar({ branding, navItems }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  
  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";
  
  // Default navigation items (fallback if no database items)
  const defaultNavigation: NavItem[] = [
    { 
      name: "AI Studio", 
      href: "/platform/studio",
      subItems: [
        { name: "Create Images", href: "/platform/studio", icon: <Palette className="w-4 h-4" />, description: "Generate stunning AI images" },
        { name: "My Creations", href: "/platform/gallery", icon: <ImageIcon className="w-4 h-4" />, description: "View your generated artwork" },
      ]
    },
    { 
      name: "AI Chat", 
      href: "/platform/chat",
      subItems: [
        { name: "Start Chatting", href: "/platform/chat", icon: <MessageSquare className="w-4 h-4" />, description: "Chat with advanced AI models" },
        { name: "Chat History", href: "/platform/history", icon: <Wand2 className="w-4 h-4" />, description: "View your conversation history" },
      ]
    },
    { 
      name: "Pricing", 
      href: "#pricing",
      subItems: [
        { name: "Free Plan", href: "#pricing", icon: <Zap className="w-4 h-4" />, description: "Get started for free" },
        { name: "Pro Plan", href: "#pricing", icon: <DollarSign className="w-4 h-4" />, description: "Advanced features for professionals" },
      ]
    },
    { 
      name: "Gallery", 
      href: "#gallery",
      subItems: [
        { name: "Browse Gallery", href: "#gallery", icon: <ImageIcon className="w-4 h-4" />, description: "Explore AI-generated artwork" },
      ]
    },
  ];

  // Convert database nav items to component format
  const navigation: NavItem[] = useMemo(() => {
    if (!navItems || navItems.length === 0) {
      return defaultNavigation;
    }
    
    return navItems.map(item => ({
      name: item.name,
      href: item.href,
      subItems: item.children.length > 0 
        ? item.children.map(child => ({
            name: child.name,
            href: child.href,
            icon: getIconByName(child.icon),
            description: "" // Description can be added to NavItem model later if needed
          }))
        : undefined
    }));
  }, [navItems]);

  useEffect(() => {
    setMounted(true);
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLogo = mounted && (resolvedTheme === "dark" && branding.darkLogoUrl) 
    ? branding.darkLogoUrl 
    : branding.logoUrl;

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md sm:backdrop-blur-none",
          isScrolled
            ? cn(
                "bg-gradient-to-r from-white/[0.7] via-white/[0.8] to-white/[0.7]",
                "dark:from-black/[0.6] dark:via-black/[0.7] dark:to-black/[0.6]",
                "border-b border-white/[0.12] dark:border-white/[0.06]",
                "shadow-sm !backdrop-blur-md"
              )
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {currentLogo ? (
                <img 
                  src={currentLogo} 
                  alt={branding.brandName}
                  className="h-8 md:h-10 w-auto object-contain max-w-[140px]"
                />
              ) : (
                <>
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-11 h-11 rounded-xl",
                      "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600",
                      "shadow-[0_8px_24px_rgba(139,92,246,0.35)]"
                    )}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold font-heading text-foreground">
                    {branding.brandName.includes(" ") ? (
                      branding.brandName
                    ) : (
                      <>
                        {branding.brandName.slice(0, 2)}
                        <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                          {branding.brandName.slice(2)}
                        </span>
                      </>
                    )}
                  </span>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-slate-100 dark:hover:bg-white/[0.04]",
                      activeDropdown === item.name && "text-foreground bg-slate-100 dark:bg-white/[0.04]"
                    )}
                  >
                    {item.name}
                    {item.subItems && item.subItems.length > 0 && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.name && "rotate-180"
                      )} />
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.subItems && item.subItems.length > 0 && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-2 w-72">
                      {/* Invisible bridge to prevent gap */}
                      <div className={cn(
                        "rounded-xl overflow-hidden",
                        "bg-white dark:bg-zinc-900",
                        "border border-gray-200 dark:border-white/10",
                        "shadow-xl shadow-black/10 dark:shadow-black/30",
                        "animate-in fade-in slide-in-from-top-2 duration-200"
                      )}>
                      <div className="p-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg transition-colors duration-150",
                              "hover:bg-gray-100 dark:hover:bg-white/5"
                            )}
                          >
                            <div className={cn(
                              "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                              "bg-violet-100 dark:bg-violet-500/20",
                              "text-violet-600 dark:text-violet-400"
                            )}>
                              {subItem.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-foreground">{subItem.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              <ThemeToggle />

              <SignedOut>
                <Link
                  href="/sign-in"
                  className="inline-flex px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/platform/studio"
                  className={cn(
                    "inline-flex px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl",
                    "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
                    "text-white",
                    "shadow-[0_8px_24px_rgba(139,92,246,0.35)]",
                    "hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)]",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "transition-all duration-200"
                  )}
                >
                  Get Started
                </Link>
              </SignedOut>

              <SignedIn>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      "inline-flex px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-violet-100 dark:hover:bg-violet-500/20",
                      "active:bg-violet-200 dark:active:bg-violet-500/30",
                      "active:scale-[0.98]"
                    )}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/platform"
                  className={cn(
                    "inline-flex px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl",
                    "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
                    "text-white",
                    "shadow-[0_8px_24px_rgba(139,92,246,0.35)]",
                    "hover:shadow-[0_12px_32px_rgba(139,92,246,0.5)]",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "transition-all duration-200"
                  )}
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2.5 rounded-xl transition-colors duration-200",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-slate-100 dark:hover:bg-white/[0.04]",
                  isMobileMenuOpen && "bg-slate-100 dark:bg-white/[0.04]"
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          <div
            className={cn(
              "fixed top-0 right-0 bottom-0 w-[min(280px,85vw)] bg-background border-l border-border z-50 lg:hidden shadow-2xl",
              "transform transition-transform duration-300"
            )}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold text-foreground">Menu</span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-border space-y-3">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-foreground rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/platform/studio"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Get Started
                  </Link>
                </SignedOut>
                <SignedIn>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className={cn(
                        "block w-full px-4 py-3 text-center text-foreground rounded-lg border border-border transition-all duration-200",
                        "hover:bg-violet-100 dark:hover:bg-violet-500/20",
                        "active:bg-violet-200 dark:active:bg-violet-500/30",
                        "active:scale-[0.98]"
                      )}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/platform"
                    onClick={closeMobileMenu}
                    className="block w-full px-4 py-3 text-center text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Dashboard
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
