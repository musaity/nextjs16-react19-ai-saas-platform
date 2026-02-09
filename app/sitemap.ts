import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";

/**
 * Dynamic Sitemap Generation
 * Generates a comprehensive sitemap including all public pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppUrl();
  const now = new Date();

  // Fetch dynamic content from database
  const [legalPages, blogPosts, helpContent] = await Promise.all([
    prisma.legalContent.findMany({
      where: { isPublished: true },
      select: { type: true, updatedAt: true },
    }),
    // If you have a BlogPost model, uncomment this:
    // prisma.blogPost.findMany({
    //   where: { isPublished: true },
    //   select: { slug: true, updatedAt: true },
    // }),
    Promise.resolve([]), // Placeholder for blog posts
    prisma.helpCenterContent.findMany({
      where: { isPublished: true },
      select: { id: true, category: true, updatedAt: true },
    }),
  ]);

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Legal pages from database
  const legalSitemapEntries: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: `${baseUrl}/legal/${page.type}`,
    lastModified: page.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  // Blog posts (if available)
  const blogSitemapEntries: MetadataRoute.Sitemap = blogPosts.map((post: { slug: string; updatedAt: Date }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Help center pages
  const helpSitemapEntries: MetadataRoute.Sitemap = helpContent.map((help) => ({
    url: `${baseUrl}/docs/help/${help.category}/${help.id}`,
    lastModified: help.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Platform pages (public marketing pages only, not authenticated routes)
  const platformPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/platform`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [
    ...staticPages,
    ...legalSitemapEntries,
    ...blogSitemapEntries,
    ...helpSitemapEntries,
    ...platformPages,
  ];
}
