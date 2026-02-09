import { Construction, Clock, Mail, ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

async function getMaintenanceContent() {
  try {
    const settings = await prisma.globalSettings.findFirst();
    return {
      title: settings?.maintenanceTitle || "Under Maintenance",
      message: settings?.maintenanceMessage || "We're performing scheduled maintenance to improve your experience.",
      estimate: settings?.maintenanceEstimate || "Shortly",
      supportEmail: settings?.supportEmail || "support@example.com",
    };
  } catch {
    return {
      title: "Under Maintenance",
      message: "We're performing scheduled maintenance to improve your experience.",
      estimate: "Shortly",
      supportEmail: "support@example.com",
    };
  }
}

export default async function MaintenancePage({
  searchParams
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const resolvedParams = await searchParams;
  const isBlocked = resolvedParams.reason === "blocked";
  const content = await getMaintenanceContent();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className={`absolute inset-0 rounded-full animate-pulse ${isBlocked ? 'bg-destructive/20' : 'bg-warning/20'}`} />
          <div className={`relative w-full h-full rounded-full flex items-center justify-center border-2 ${isBlocked ? 'bg-destructive/10 border-destructive/30' : 'bg-warning/10 border-warning/30'}`}>
            {isBlocked ? (
              <ShieldX className="w-12 h-12 text-destructive" />
            ) : (
              <Construction className="w-12 h-12 text-warning" />
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            {isBlocked ? "Account Suspended" : content.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isBlocked 
              ? "Your account has been suspended. Please contact support for more information."
              : content.message
            }
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {!isBlocked && (
            <div className="surface border border-border rounded-xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Estimated Time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Expected to be back: <span className="font-medium text-foreground">{content.estimate}</span>
              </p>
            </div>
          )}

          <div className={`surface border border-border rounded-xl p-4 text-left ${isBlocked ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-info" />
              </div>
              <span className="font-medium text-foreground">Need Help?</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isBlocked 
                ? "If you believe this is an error, please contact our support team."
                : `Contact us at ${content.supportEmail} for urgent matters.`
              }
            </p>
          </div>
        </div>

        {/* Progress Bar (only for maintenance) */}
        {!isBlocked && (
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-warning to-primary rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground">Maintenance in progress...</p>
          </div>
        )}

        {/* Links */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
          {!isBlocked && (
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Access
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
