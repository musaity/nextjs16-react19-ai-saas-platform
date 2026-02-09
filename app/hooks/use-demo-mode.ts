"use client";

import { useUser } from "@clerk/nextjs";
import { useMemo, useCallback } from "react";
import { toast } from "@/app/hooks/use-toast";

const DEMO_EMAIL = "demo@aicreativestudio.com";

export function useDemoMode() {
  const { user, isLoaded } = useUser();

  const isDemo = useMemo(() => {
    if (!isLoaded || !user) return false;
    
    const primaryEmail = user.emailAddresses.find(
      e => e.id === user.primaryEmailAddressId
    )?.emailAddress;
    
    return primaryEmail === DEMO_EMAIL || user.publicMetadata?.isDemo === true;
  }, [user, isLoaded]);

  const showDemoWarning = useCallback((action?: string) => {
    toast({
      title: "🔒 Demo Mode",
      description: action 
        ? `"${action}" is disabled in demo mode. Purchase the full license to unlock all features.`
        : "This action is disabled in demo mode. Purchase the full license to unlock all features.",
      variant: "destructive",
    });
  }, []);

  const guardAction = useCallback(<T,>(
    action: () => T | Promise<T>,
    actionName?: string
  ): T | Promise<T> | undefined => {
    if (isDemo) {
      showDemoWarning(actionName);
      return undefined;
    }
    return action();
  }, [isDemo, showDemoWarning]);

  return {
    isDemo,
    isLoaded,
    showDemoWarning,
    guardAction
  };
}
