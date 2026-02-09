"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AiProvider, AiModelType } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

// ==========================================
// AI MODEL MANAGEMENT ACTIONS
// ==========================================

export async function createAiModel(formData: FormData) {

  const name = formData.get("name") as string;
  const apiIdentifier = formData.get("apiIdentifier") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const provider = (formData.get("provider") as AiProvider) || "OPENAI";
  
  // Model Capability Type
  const modelType = (formData.get("modelType") as AiModelType) || "LLM"; 

  const apiKey = formData.get("apiKey") as string;
  const baseUrl = formData.get("baseUrl") as string;
  
  // Handle Config JSON Parsing
  let config = {};
  try {
    const configStr = formData.get("config") as string;
    if (configStr && configStr.trim() !== "") {
      config = JSON.parse(configStr);
    }
  } catch (e) {
    console.error("Invalid JSON Config:", e);
    // In a real app, you might want to return an error here.
    // For now, we default to empty object to prevent crashes.
  }
  
  const rawCost = formData.get("creditCost");
  const creditCost = rawCost ? Number(rawCost) : 1;
  const isActive = formData.get("isActive") === "on";

  if (!name || !apiIdentifier) {
    return { error: "Name and Model Identifier are required fields." };
  }

  try {
    await prisma.aiModel.create({
      data: {
        name,
        apiIdentifier,
        provider,
        modelType,
        apiKey,
        baseUrl: baseUrl || null,
        config: config, // Save parsed JSON
        description,
        imageUrl,
        creditCost: isNaN(creditCost) ? 1 : creditCost,
        isActive,
      },
    });
    
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error: any) {
    console.error("[CREATE_MODEL_ERROR]:", error);
    return { error: "Failed to create model. Database error." };
  }
}

export async function updateAiModel(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const apiIdentifier = formData.get("apiIdentifier") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const provider = formData.get("provider") as AiProvider;
  
  const modelType = (formData.get("modelType") as AiModelType) || "LLM";

  const apiKey = formData.get("apiKey") as string;
  const baseUrl = formData.get("baseUrl") as string;

  // Handle Config JSON Parsing
  let config = {};
  try {
    const configStr = formData.get("config") as string;
    if (configStr && configStr.trim() !== "") {
      config = JSON.parse(configStr);
    }
  } catch (e) {
    console.error("Invalid JSON Config:", e);
  }

  const rawCost = formData.get("creditCost");
  const creditCost = rawCost ? Number(rawCost) : 1;
  const isActive = formData.get("isActive") === "on";

  try {
    await prisma.aiModel.update({
      where: { id },
      data: { 
        name, 
        apiIdentifier, 
        provider,
        modelType,
        apiKey,
        baseUrl: baseUrl || null,
        config: config, // Update JSON config
        creditCost,
        imageUrl,
        description,
        isActive 
      },
    });
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_MODEL_ERROR]:", error);
    return { error: "Failed to update the AI model." };
  }
}

export async function deleteAiModel(id: string) {
  try {
    await prisma.aiModel.delete({ where: { id } });
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error: any) {
    console.error("[DELETE_MODEL_ERROR]:", error);
    return { error: "Deletion failed. Ensure no styles are linked to this model." };
  }
}

export async function toggleAiModelStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.aiModel.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath("/admin/models");
    return { success: true };
  } catch (error) {
    console.error("[TOGGLE_STATUS_ERROR]:", error);
    return { success: false };
  }
}

export async function deleteImage(imageId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Authentication required." };
    const image = await prisma.generatedImage.findUnique({ where: { id: imageId } });
    if (!image || image.userId !== userId) return { success: false, error: "Unauthorized" };
    await prisma.generatedImage.delete({ where: { id: imageId } });
    revalidatePath("/platform/gallery");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateSettings(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const siteName = formData.get("siteName") as string;
  const siteDescription = formData.get("siteDescription") as string;
  const isMaintenance = formData.get("isMaintenance") === "on";
  try {
    const first = await prisma.globalSettings.findFirst();
    if (first) await prisma.globalSettings.update({ where: { id: first.id }, data: { siteName, siteDescription, isMaintenance } });
    else await prisma.globalSettings.create({ data: { siteName, siteDescription, isMaintenance } });
    revalidatePath("/");
    return { success: true };
  } catch (error) { return { error: "Failed to update" }; }
}