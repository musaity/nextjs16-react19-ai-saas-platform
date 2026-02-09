import { Metadata } from "next";
import { getAppUrl } from "./config";

/**
 * SEO Configuration & Utilities
 * Centralized SEO management for the entire application
 */

export interface SEOConfig {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  twitterHandle?: string;
  facebookAppId?: string;
  locale: string;
  themeColor: string;
  keywords: string[];
}

// Default SEO configuration
export const defaultSEOConfig: SEOConfig = {
  siteName: "AI SaaS Platform",
  siteDescription: "Create stunning visuals, write compelling copy, and bring your ideas to life with AI-powered tools.",
  siteUrl: getAppUrl(),
  locale: "en_US",
  themeColor: "#8B5CF6",
  keywords: [
    "AI",
    "artificial intelligence",
    "image generation",
    "video generation",
    "AI chat",
    "creative tools",
    "machine learning",
    "DALL-E",
    "Midjourney alternative",
    "AI art",
    "AI video",
    "text to image",
    "text to video",
  ],
};

/**
 * Generate comprehensive metadata for a page
 */
export function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  config = defaultSEOConfig,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  config?: Partial<SEOConfig>;
}): Metadata {
  const seoConfig = { ...defaultSEOConfig, ...config };
  const pageUrl = url || seoConfig.siteUrl;
  const pageImage = image || `${seoConfig.siteUrl}/og-image.png`;
  const allKeywords = [...(keywords || []), ...seoConfig.keywords];

  return {
    title,
    description,
    keywords: allKeywords,
    authors: authors?.map((name) => ({ name })),
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
      canonical: pageUrl,
    },
    openGraph: {
      type,
      locale: seoConfig.locale,
      url: pageUrl,
      title,
      description,
      siteName: seoConfig.siteName,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [pageImage],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
      },
    },
    category: "technology",
  };
}

/**
 * JSON-LD Structured Data Types
 */
export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    email?: string;
    contactType: string;
  };
}

export interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  description: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface SoftwareApplicationSchema {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    ratingCount: string;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }[];
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(config: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  socialLinks?: string[];
  email?: string;
}): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name,
    description: config.description,
    url: config.url,
    ...(config.logo && { logo: config.logo }),
    ...(config.socialLinks && { sameAs: config.socialLinks }),
    ...(config.email && {
      contactPoint: {
        "@type": "ContactPoint",
        email: config.email,
        contactType: "customer service",
      },
    }),
  };
}

/**
 * Generate Website Schema with Search Action
 */
export function generateWebsiteSchema(config: {
  name: string;
  description: string;
  url: string;
  searchUrl?: string;
}): WebsiteSchema {
  const schema: WebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    description: config.description,
    url: config.url,
  };

  if (config.searchUrl) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${config.searchUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
}

/**
 * Generate Software Application Schema
 */
export function generateSoftwareAppSchema(config: {
  name: string;
  description: string;
  price?: string;
  currency?: string;
  rating?: number;
  ratingCount?: number;
}): SoftwareApplicationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.name,
    description: config.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    ...(config.price && {
      offers: {
        "@type": "Offer",
        price: config.price,
        priceCurrency: config.currency || "USD",
      },
    }),
    ...(config.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: config.rating.toString(),
        ratingCount: (config.ratingCount || 100).toString(),
      },
    }),
  };
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url?: string }[]
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article Schema
 */
export function generateArticleSchema(config: {
  headline: string;
  description: string;
  image: string;
  author: string;
  publisherName: string;
  publisherLogo?: string;
  datePublished: string;
  dateModified?: string;
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.headline,
    description: config.description,
    image: config.image,
    author: {
      "@type": "Person",
      name: config.author,
    },
    publisher: {
      "@type": "Organization",
      name: config.publisherName,
      ...(config.publisherLogo && {
        logo: {
          "@type": "ImageObject",
          url: config.publisherLogo,
        },
      }),
    },
    datePublished: config.datePublished,
    ...(config.dateModified && { dateModified: config.dateModified }),
  };
}

/**
 * JSON-LD Script Component Generator
 * Returns a string to be used in a script tag
 */
export function jsonLdScript(schema: object): string {
  return JSON.stringify(schema);
}
