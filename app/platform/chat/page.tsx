import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import ChatClient from "@/app/components/chat/chat-client";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const { userId } = await auth();

  // Guest mode - allow browsing without login
  const isGuest = !userId;

  // 1. Fetch user credits (only if logged in)
  let userCredits = 0;
  if (!isGuest) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    userCredits = user?.credits || 0;
  }

  // 2. Fetch active models
  const models = await prisma.aiModel.findMany({
    where: { 
      isActive: true,
      modelType: "LLM" // Only fetch chat models (exclude image models)
    },
    orderBy: { name: "asc" }
  });

  // Return empty list if no models to prevent errors
  return (
    <ChatClient 
      userCredits={userCredits} 
      models={models}
      isGuest={isGuest}
    />
  );
}