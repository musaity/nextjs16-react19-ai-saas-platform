import { Metadata } from "next";
import { getContactSettings } from "@/lib/contact-actions";
import { ContactClient } from "./contact-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

// Dynamic SEO metadata for Contact page
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Contact Us",
    description: `Get in touch with ${siteName} team. We're here to help with questions, support, enterprise solutions, and partnership inquiries.`,
    keywords: ["contact", "support", "help", "enterprise", "partnership", siteName],
    openGraph: {
      title: `Contact Us | ${siteName}`,
      description: "Get in touch with our team for support and inquiries.",
      url: `${baseUrl}/contact`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Contact Us | ${siteName}`,
      description: "Get in touch with our team for support and inquiries.",
    },
    alternates: {
      canonical: `${baseUrl}/contact`,
    },
  };
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  // If contact form is disabled, redirect to home
  if (!settings.isActive) {
    redirect("/");
  }

  return (
    <ContactClient 
      settings={{
        pageTitle: settings.pageTitle,
        pageDescription: settings.pageDescription,
        successTitle: settings.successTitle,
        successMessage: settings.successMessage,
        salesEmail: settings.salesEmail,
        requireCompany: settings.requireCompany,
        maxMessageLength: settings.maxMessageLength,
        isActive: settings.isActive,
      }}
    />
  );
}
