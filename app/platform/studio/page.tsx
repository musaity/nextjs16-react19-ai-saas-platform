import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import StudioClient from "./studio-client";

export default async function StudioPage() {
  const { userId } = await auth();

  // Guest mode - allow browsing without login
  const isGuest = !userId;

  // 1. Get User Credits (only if logged in)
  let userCredits = 0;
  if (!isGuest) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });
    userCredits = user?.credits || 0;
  }

  // 2. Get Active AI Models (OpenAI & Gemini)
  const allModels = await prisma.aiModel.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  // 3. Get User's Gallery (Last 20 images for the sidebar) - only if logged in
  let userGallery: any[] = [];
  if (!isGuest) {
    userGallery = await prisma.generatedImage.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }

  return (
    <div className="h-[calc(100vh-3rem)] overflow-visible relative">
      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 60%)' }} />
      
      <StudioClient 
        userCredits={userCredits} 
        models={allModels} 
        initialGallery={userGallery}
        isGuest={isGuest}
      />
    </div>
  );
}