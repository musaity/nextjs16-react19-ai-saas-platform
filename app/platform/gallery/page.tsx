import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import GalleryClient from "@/app/components/gallery/gallery-client";
import { ImageIcon, Layers, Sparkles, LogIn } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // Ensure gallery stays up-to-date

export default async function GalleryPage() {
  const { userId } = await auth();
  
  // Guest mode - show empty state with sign-in prompt
  const isGuest = !userId;

  // 1. Fetch user's images from database (only if logged in)
  let images: any[] = [];
  if (!isGuest) {
    const rawImages = await prisma.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // Newest first
      include: {
        AiModel: { 
          select: { 
            name: true,
            provider: true 
          } 
        } 
      }
    });

    // Transform to camelCase for client component
    images = rawImages.map(({ AiModel, ...rest }) => ({
      ...rest,
      aiModel: AiModel
    }));
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                <Layers className="w-6 h-6 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                My Creations
              </h1>
            </div>
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              A collection of your AI-generated masterpieces. Download, manage, or reuse your prompts.
            </p>
          </div>
          
          {/* Stats Badge */}
          <div className="flex items-center gap-4 surface rounded-2xl px-6 py-4 border border-border">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-glow">
              <ImageIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Total Images</p>
              <p className="text-2xl font-bold text-foreground">{images.length}</p>
            </div>
          </div>
        </div>

        {/* Empty State or Gallery */}
        {images.length === 0 ? (
          <div className="surface rounded-3xl border border-border p-16 text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-violet-400" />
            </div>
            {isGuest ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Sign in to save your creations</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Create an account to save and manage your AI-generated images. Your creations will be stored securely.
                </p>
                <Link 
                  href="/sign-in" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-primary-foreground font-medium shadow-glow hover:shadow-glow-lg transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">No creations yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Start generating amazing images in the Studio and they'll appear here.
                </p>
                <Link 
                  href="/platform/studio" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-primary-foreground font-medium shadow-glow hover:shadow-glow-lg transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Your First Image
                </Link>
              </>
            )}
          </div>
        ) : (
          <GalleryClient initialImages={images} />
        )}
      </div>
    </div>
  );
}