import { Inter, Plus_Jakarta_Sans, Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedOut } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/app/components/theme-provider";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Wrench } from "lucide-react";
import { getAppUrl } from "@/lib/config";
import { 
  generateOrganizationSchema, 
  generateWebsiteSchema, 
  generateSoftwareAppSchema,
  jsonLdScript 
} from "@/lib/seo";
import { CookieBanner } from "@/app/components/cookie-banner";

// 2026 Modern Font Stack
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

// Plus Jakarta Sans - Premium geometric sans for headings
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

// Space Grotesk - Futuristic tech feel for display text
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

// Sora - Smooth modern font for accent text
const sora = Sora({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-sora',
  weight: ['400', '500', '600', '700'],
});

// 1. Fetch comprehensive SEO metadata from database
export async function generateMetadata() {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  
  const siteName = settings?.siteName || "AI SaaS Platform";
  const siteDescription = settings?.siteDescription || "AI-powered creative tools for image generation, video creation, and intelligent chat solutions.";
  const seoKeywords = settings?.seoKeywords?.split(",").map(k => k.trim()) || [
    "AI image generation",
    "AI video creation", 
    "AI chat",
    "artificial intelligence",
    "creative tools",
    "text to image",
    "DALL-E alternative",
    "Midjourney alternative",
  ];
  
  // Build icons object with dynamic favicon if available
  const icons: { icon?: string; shortcut?: string; apple?: string } = {};
  if (settings?.faviconUrl) {
    icons.icon = settings.faviconUrl;
    icons.shortcut = settings.faviconUrl;
    icons.apple = settings.faviconUrl;
  }

  // Social links for sameAs
  const socialLinks: string[] = [];
  if (settings?.socialFacebook) socialLinks.push(settings.socialFacebook);
  if (settings?.socialTwitter) socialLinks.push(settings.socialTwitter);
  if (settings?.socialInstagram) socialLinks.push(settings.socialInstagram);
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },
    description: siteDescription,
    keywords: seoKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: siteName,
      description: siteDescription,
      siteName: siteName,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [`${baseUrl}/og-image.png`],
      creator: settings?.socialTwitter ? `@${settings.socialTwitter.split("/").pop()}` : undefined,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
    category: "technology",
    ...(Object.keys(icons).length > 0 && { icons }),
    other: {
      "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 2. Fetch settings and user
  const settings = await prisma.globalSettings.findFirst();
  const user = await currentUser();
  const baseUrl = getAppUrl();

  // Generate JSON-LD structured data
  const siteName = settings?.siteName || "AI SaaS Platform";
  const siteDescription = settings?.siteDescription || "AI-powered creative tools.";
  
  const socialLinks: string[] = [];
  if (settings?.socialFacebook) socialLinks.push(settings.socialFacebook);
  if (settings?.socialTwitter) socialLinks.push(settings.socialTwitter);
  if (settings?.socialInstagram) socialLinks.push(settings.socialInstagram);

  const organizationSchema = generateOrganizationSchema({
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    logo: settings?.logoUrl || `${baseUrl}/logo.png`,
    socialLinks,
    email: settings?.supportEmail || undefined,
  });

  const websiteSchema = generateWebsiteSchema({
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    searchUrl: `${baseUrl}/docs`,
  });

  const softwareSchema = generateSoftwareAppSchema({
    name: siteName,
    description: siteDescription,
    price: "0",
    currency: "USD",
    rating: 4.8,
    ratingCount: 1250,
  });

  // Fetch cookie settings
  let cookieSettings = null;
  try {
    cookieSettings = await prisma.cookieSettings.findFirst();
  } catch {
    // Cookie settings table might not exist yet
  }

  // Admin check (role: "admin" in metadata?)
  const isAdmin = user?.publicMetadata?.role === "admin";
  const isMaintenance = settings?.isMaintenance === true;

  // Get current URL - exempt sign-in/sign-up pages from maintenance
  const headersList = await headers();
  const fullUrl = headersList.get("x-url") || headersList.get("referer") || "";
  const pathname = new URL(fullUrl, "http://localhost").pathname;
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // Maintenance mode screen (if maintenance AND user is not admin AND not auth page)
  if (isMaintenance && !isAdmin && !isAuthPage) {
    return (
      <ClerkProvider>
        <html lang="en" className={`dark theme-loaded ${inter.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} ${sora.variable}`} suppressHydrationWarning>
          <body className="font-sans bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4" suppressHydrationWarning>
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
            <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
            
            <div className="relative max-w-md text-center space-y-8">
              {/* Animated Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-3xl animate-pulse-glow" />
                <div className="relative w-28 h-28 bg-gradient-to-br from-violet-500/20 to-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-border">
                  <Wrench className="w-12 h-12 text-violet-400" />
                </div>
              </div>
              
              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/60">
                  System Under Maintenance
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We are currently upgrading our AI engines to bring you better results. 
                  Please check back in a few minutes.
                </p>
              </div>
              
              {/* Admin backdoor login */}
              <div className="pt-8 border-t border-border">
                <p className="text-xs text-muted-foreground/50 mb-3 uppercase tracking-wider font-medium">Admin Access</p>
                <SignedOut>
                   <SignInButton mode="modal">
                      <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors duration-200 font-medium">
                        Login as Staff →
                      </button>
                   </SignInButton>
                </SignedOut>
              </div>
            </div>
          </body>
        </html>
      </ClerkProvider>
    );
  }

  // NORMAL SITE FLOW
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} ${sora.variable}`}>
        <head>
          {/* Prevent theme flash - must be before any content renders */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var stored = localStorage.getItem('theme');
                    var theme = stored || 'dark';
                    var html = document.documentElement;
                    
                    if (theme === 'dark') {
                      html.classList.add('dark');
                      html.style.colorScheme = 'dark';
                    } else {
                      html.classList.remove('dark');
                      html.style.colorScheme = 'light';
                    }
                    
                    // Mark theme as loaded to show content
                    html.classList.add('theme-loaded');
                  } catch (e) {
                    document.documentElement.classList.add('theme-loaded');
                  }
                })();
              `,
            }}
          />
          {/* JSON-LD Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(softwareSchema) }}
          />
        </head>
        <body className="font-sans bg-background text-foreground antialiased overflow-x-hidden min-h-screen" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-center" 
              richColors 
              toastOptions={{
                style: {
                  background: 'hsl(224 47% 6% / 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'white',
                },
              }}
            />
            {/* Cookie Consent Banner */}
            {cookieSettings && (
              <CookieBanner 
                settings={{
                  isEnabled: cookieSettings.isEnabled,
                  title: cookieSettings.title,
                  message: cookieSettings.message,
                  acceptAllLabel: cookieSettings.acceptAllLabel,
                  acceptNecessaryLabel: cookieSettings.acceptNecessaryLabel,
                  customizeLabel: cookieSettings.customizeLabel,
                  savePreferencesLabel: cookieSettings.savePreferencesLabel,
                  privacyPolicyUrl: cookieSettings.privacyPolicyUrl,
                  privacyPolicyLabel: cookieSettings.privacyPolicyLabel,
                  enableAnalytics: cookieSettings.enableAnalytics,
                  enableMarketing: cookieSettings.enableMarketing,
                  enableFunctional: cookieSettings.enableFunctional,
                  analyticsDescription: cookieSettings.analyticsDescription,
                  marketingDescription: cookieSettings.marketingDescription,
                  functionalDescription: cookieSettings.functionalDescription,
                  necessaryDescription: cookieSettings.necessaryDescription,
                  position: cookieSettings.position,
                  theme: cookieSettings.theme,
                  consentExpireDays: cookieSettings.consentExpireDays,
                }}
              />
            )}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}