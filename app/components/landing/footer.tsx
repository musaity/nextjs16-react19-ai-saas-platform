"use client";

import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin, Github, Twitter, Linkedin, Youtube, Facebook, Instagram, Globe, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LegalPopup, useLegalPopup } from "./legal-popup";

type LegalType = "terms" | "privacy" | "cookies" | "refund" | "gdpr";

// ============================================================================
// TYPES
// ============================================================================
interface FooterLink {
  id: string;
  name: string;
  href: string;
  isExternal: boolean;
  order: number;
  isActive: boolean;
}

interface FooterLinkCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  icon: string | null;
  href: string | null;
  isActive: boolean;
  order: number;
}

// Icon mapping for social links
const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter: Twitter,
  Linkedin: Linkedin,
  Github: Github,
  Youtube: Youtube,
  Facebook: Facebook,
  Instagram: Instagram,
  Globe: Globe,
};

// Icon mapping for contact info
const contactIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  phone: Phone,
  address: MapPin,
};

// ============================================================================
// LEGAL LINKS (These are special - they open popups)
// ============================================================================
const legalLinks = [
  { name: "Privacy Policy", type: "privacy" as LegalType },
  { name: "Terms of Service", type: "terms" as LegalType },
  { name: "Cookie Policy", type: "cookies" as LegalType },
  { name: "GDPR", type: "gdpr" as LegalType },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface FooterProps {
  branding: {
    logoUrl: string | null;
    darkLogoUrl: string | null;
    brandName: string;
    siteDescription?: string;
  };
  footerData?: {
    categories: FooterLinkCategory[];
    socialLinks: SocialLink[];
    contactInfo: ContactInfo[];
  };
}

export function Footer({ branding, footerData }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isOpen, type, openPopup, closePopup } = useLegalPopup();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to show based on theme
  const currentLogo = mounted && (resolvedTheme === "dark" && branding.darkLogoUrl) 
    ? branding.darkLogoUrl 
    : branding.logoUrl;

  // Use data from props or empty arrays
  // Filter out "Legal" category from database to avoid duplicate with built-in legal links
  const categories = (footerData?.categories || []).filter(
    (cat) => cat.slug.toLowerCase() !== 'legal' && cat.name.toLowerCase() !== 'legal'
  );
  const socialLinks = footerData?.socialLinks || [];
  const contactInfo = footerData?.contactInfo || [];

  // Calculate grid columns based on number of categories + brand section + legal section
  const totalColumns = categories.length + 2; // brand (2 cols) + categories + legal
  const gridCols = totalColumns <= 4 ? "md:grid-cols-4" : totalColumns <= 5 ? "md:grid-cols-5" : "md:grid-cols-6";

  return (
    <>
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className={`py-8 sm:py-12 md:py-16 grid grid-cols-2 ${gridCols} gap-6 sm:gap-8`}>
          {/* Brand Section - Dynamic Logo */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-3 sm:mb-4">
              {currentLogo ? (
                <img 
                  src={currentLogo} 
                  alt={branding.brandName}
                  className="h-7 sm:h-8 md:h-10 w-auto object-contain max-w-[120px] sm:max-w-[140px]"
                />
              ) : (
                <>
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-foreground">
                    {branding.brandName.includes(" ") ? (
                      branding.brandName
                    ) : (
                      <>
                        {branding.brandName.slice(0, 2)}
                        <span className="text-primary">{branding.brandName.slice(2)}</span>
                      </>
                    )}
                  </span>
                </>
              )}
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-xs">
              {branding.siteDescription || "AI-powered image generation, video creation and smart chat solutions. All AI tools in one platform."}
            </p>

            {/* Contact Info - Dynamic from Database */}
            {contactInfo.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                {contactInfo.map((contact) => {
                  const IconComponent = contactIconMap[contact.type] || Mail;
                  return (
                    <div key={contact.id} className="flex items-center gap-2">
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {contact.href ? (
                        <a href={contact.href} className="hover:text-foreground transition-colors">
                          {contact.value}
                        </a>
                      ) : (
                        <span>{contact.value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Link Categories from Database */}
          {categories.map((category) => (
            <div key={category.id}>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{category.name}</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {category.links.map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                      >
                        {link.name}
                        <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal Links - Opens in Popup (Always shown) */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => openPopup(link.type)}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 sm:py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} {branding.brandName}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Social Links - Dynamic from Database */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const IconComponent = socialIconMap[social.icon] || Globe;
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Divider - only show if there are social links */}
            {socialLinks.length > 0 && <div className="w-px h-5 bg-border" />}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
    
    {/* Legal Popup */}
    <LegalPopup isOpen={isOpen} onClose={closePopup} type={type} />
    </>
  );
}
