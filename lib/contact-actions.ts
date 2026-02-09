"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ContactReason, ContactStatus } from "@prisma/client";

// ============================================================================
// CONTACT SUBMISSIONS
// ============================================================================

export async function getContactSubmissions(filters?: {
  status?: ContactStatus;
  reason?: ContactReason;
  search?: string;
}) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const where: Record<string, unknown> = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.reason) {
    where.reason = filters.reason;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { company: { contains: filters.search, mode: "insensitive" } },
      { message: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const submissions = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return submissions;
}

export async function getContactSubmission(id: string) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
  });

  return submission;
}

export async function updateContactSubmissionStatus(
  id: string,
  status: ContactStatus,
  notes?: string
) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  if (status === "REPLIED") {
    updateData.repliedAt = new Date();
  }

  if (status === "IN_PROGRESS") {
    updateData.assignedTo = user.id;
  }

  await prisma.contactSubmission.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/contact");
  return { success: true };
}

export async function deleteContactSubmission(id: string) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.contactSubmission.delete({
    where: { id },
  });

  revalidatePath("/admin/contact");
  return { success: true };
}

export async function bulkDeleteContactSubmissions(ids: string[]) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.contactSubmission.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/contact");
  return { success: true };
}

export async function bulkUpdateContactSubmissionStatus(
  ids: string[],
  status: ContactStatus
) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await prisma.contactSubmission.updateMany({
    where: { id: { in: ids } },
    data: { status, updatedAt: new Date() },
  });

  revalidatePath("/admin/contact");
  return { success: true };
}

// ============================================================================
// CONTACT SETTINGS
// ============================================================================

export async function getContactSettings() {
  let settings = await prisma.contactSettings.findFirst();

  if (!settings) {
    settings = await prisma.contactSettings.create({
      data: {},
    });
  }

  return settings;
}

export async function updateContactSettings(data: {
  pageTitle?: string;
  pageDescription?: string;
  successTitle?: string;
  successMessage?: string;
  salesEmail?: string;
  supportEmail?: string;
  phoneNumber?: string;
  notifyOnSubmission?: boolean;
  notificationEmails?: string[];
  autoReplyEnabled?: boolean;
  autoReplySubject?: string;
  autoReplyMessage?: string;
  requireCompany?: boolean;
  enableFileUpload?: boolean;
  maxMessageLength?: number;
  enableCaptcha?: boolean;
  blockDisposableEmails?: boolean;
  isActive?: boolean;
}) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  let settings = await prisma.contactSettings.findFirst();

  if (!settings) {
    settings = await prisma.contactSettings.create({
      data: {
        ...data,
      },
    });
  } else {
    settings = await prisma.contactSettings.update({
      where: { id: settings.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  revalidatePath("/admin/contact");
  revalidatePath("/contact");
  return { success: true, settings };
}

// ============================================================================
// PUBLIC: Submit Contact Form
// ============================================================================

export async function submitContactForm(data: {
  name: string;
  email: string;
  company?: string;
  reason: string;
  message: string;
}) {
  // Validate required fields
  if (!data.name || !data.email || !data.message) {
    throw new Error("Name, email, and message are required");
  }

  // Map reason string to enum
  const reasonMap: Record<string, ContactReason> = {
    enterprise: "ENTERPRISE",
    custom: "CUSTOM_SOLUTION",
    demo: "DEMO",
    support: "SUPPORT",
    partnership: "PARTNERSHIP",
    other: "OTHER",
  };

  const reason = reasonMap[data.reason] || "OTHER";

  // Create submission
  const submission = await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company || null,
      reason,
      message: data.message,
      status: "NEW",
    },
  });

  // Email notifications can be configured in admin settings

  return { success: true, id: submission.id };
}

// ============================================================================
// STATS
// ============================================================================

export async function getContactStats() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const [total, newCount, inProgress, replied, closed] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.contactSubmission.count({ where: { status: "IN_PROGRESS" } }),
    prisma.contactSubmission.count({ where: { status: "REPLIED" } }),
    prisma.contactSubmission.count({ where: { status: "CLOSED" } }),
  ]);

  // Get submissions from last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = await prisma.contactSubmission.count({
    where: { createdAt: { gte: weekAgo } },
  });

  return {
    total,
    new: newCount,
    inProgress,
    replied,
    closed,
    thisWeek,
  };
}
