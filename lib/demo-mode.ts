import { NextResponse } from "next/server";

// ============================================================================
// DEMO MODE - DISABLED FOR PRODUCTION
// ============================================================================
// This file has been disabled for production deployment.
// All demo restrictions have been removed.
// ============================================================================

// Demo mode is completely disabled - always returns false
export async function isDemoMode(): Promise<boolean> {
  return false;
}

// Demo status - always returns not demo
export async function getDemoStatus() {
  return { isDemo: false, user: null };
}

// Legacy exports for backwards compatibility (not used in production)
export const DEMO_EMAIL = "";
export const DEMO_ALLOWED_ACTIONS: string[] = [];
export const DEMO_BLOCKED_ACTIONS: string[] = [];
export const DEMO_ERROR_MESSAGE = "";

// API route protection - always allows access in production
export async function checkDemoRestriction(): Promise<NextResponse | null> {
  return null;
}

// Demo protection wrapper - always executes handler in production
export async function withDemoProtection<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  return handler();
}
