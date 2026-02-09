import { headers } from "next/headers";

/**
 * Get the application base URL dynamically
 * Priority: NEXT_PUBLIC_APP_URL env > VERCEL_URL > Request Headers > localhost
 * This ensures correct URLs in production deployments
 */
export function getAppUrl(): string {
  // 1. Explicit app URL from environment (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""); // Remove trailing slash
  }
  
  // 2. Vercel deployment URL (auto-set by Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 3. Vercel production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  // 4. Fallback to localhost for development
  return "http://localhost:3000";
}

/**
 * Get the application base URL dynamically from request headers (for server actions/API routes)
 * This is the preferred method when called from server actions
 */
export async function getAppUrlFromHeaders(): Promise<string> {
  // 1. Explicit app URL from environment (highest priority) - but skip localhost in production
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""); // Remove trailing slash
  }
  
  // 2. Vercel production URL (prefer this for stable URLs)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  // 3. Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 3. Vercel production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  // 4. Try to get from request headers (works in server actions)
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "https";
    
    if (host && !host.includes("localhost")) {
      return `${protocol}://${host}`;
    }
  } catch (e) {
    // headers() might fail outside of request context
  }
  
  // 5. Fallback to localhost for development
  return "http://localhost:3000";
}

export const SiteConfig = {
  name: "AI SaaS Platform",
  description: "Transform your photos into masterpieces with next-gen AI technology.",
  url: getAppUrl(),
};