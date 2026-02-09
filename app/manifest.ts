import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

/**
 * Web App Manifest (PWA Support)
 * Defines how the app appears when installed on a device
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Fetch branding from database
  const settings = await prisma.globalSettings.findFirst();

  const siteName = settings?.siteName || "AI SaaS Platform";
  const siteDescription = settings?.siteDescription || "AI-powered creative tools for image generation, video creation, and intelligent chat.";

  return {
    name: siteName,
    short_name: settings?.brandName || "AI SaaS",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#8B5CF6",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities", "entertainment"],
    icons: [
      {
        src: settings?.faviconUrl || "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "AI SaaS Platform Homepage",
      },
      {
        src: "/screenshots/mobile-home.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "AI SaaS Platform Mobile View",
      },
    ],
    shortcuts: [
      {
        name: "Create Image",
        short_name: "Image",
        description: "Generate AI images",
        url: "/platform/studio",
        icons: [{ src: "/icons/shortcut-image.png", sizes: "96x96" }],
      },
      {
        name: "AI Chat",
        short_name: "Chat",
        description: "Start AI conversation",
        url: "/platform/chat",
        icons: [{ src: "/icons/shortcut-chat.png", sizes: "96x96" }],
      },
      {
        name: "Gallery",
        short_name: "Gallery",
        description: "View your creations",
        url: "/platform/gallery",
        icons: [{ src: "/icons/shortcut-gallery.png", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
