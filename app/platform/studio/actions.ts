"use server";

import { prisma } from "@/lib/db";
import { runAiModel } from "@/lib/ai-service";
import { auth } from "@clerk/nextjs/server";
import { safeDecrypt } from "@/lib/crypto";

export async function runUniversalAction({ modelId, input }: { modelId: string, input: any }) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // 1. Find model
  const model = await prisma.aiModel.findUnique({
    where: { id: modelId }
  });

  if (!model) return { error: "Model not found" };

  // 2. Credit validation
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.credits < model.creditCost) {
    return { error: `Insufficient credits. Need ${model.creditCost}` };
  }

  try {
    // 3. Run AI service
    // Merge input parameters (Prompt, Image, Config)
    // Note: Config from database, Input from user
    const output = await runAiModel(
      {
        provider: model.provider,
        apiIdentifier: model.apiIdentifier,
        // 🔐 Decrypt API key before sending to AI provider
        apiKey: safeDecrypt(model.apiKey),
        baseUrl: model.baseUrl,
        config: model.config,
        modelType: model.modelType
      },
      input // { prompt: "...", image: "base64...", aspectRatio: "..." }
    );

    // 4. Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: model.creditCost } }
    });

    // 5. Save to gallery (optional - for image models)
    if (model.modelType === "IMAGE") {
        await prisma.generatedImage.create({
            data: {
                userId,
                aiModelId: model.id,
                imageUrl: output as string,
                prompt: input.prompt || "Image Edit",
                status: "completed"
            }
        });
    }

    return { success: true, output };

  } catch (error: any) {
    console.error("Studio Action Error:", error);
    return { error: error.message || "Failed to process request" };
  }
}