import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import HelpCenterClient from "./help-client";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HelpCenterPage() {
  // Fetch published help center content from database
  const helpContent = await prisma.helpCenterContent.findMany({
    where: { isPublished: true },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  // Get unique categories from database
  const categories = Array.from(new Set(helpContent.map(item => item.category)));

  // Transform database content into FAQ format grouped by category
  const faqs = categories.map(category => {
    const items = helpContent.filter(item => item.category === category);
    return {
      category,
      iconName: getCategoryIcon(category),
      questions: items.map(item => ({
        q: item.title,
        a: item.content,
      })),
    };
  });

  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      iconName: "Mail",
      action: "support@aistudio.com",
      href: "mailto:support@aistudio.com"
    },
    {
      title: "Documentation",
      description: "Browse our detailed guides",
      iconName: "HelpCircle",
      action: "View Docs",
      href: "#"
    }
  ];

  return (
    <HelpCenterClient 
      faqs={faqs}
      contactOptions={contactOptions}
      dbContent={[]} // All content is now in faqs
      categories={categories}
    />
  );
}

// Helper function to get icon based on category name
function getCategoryIcon(category: string): string {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('start') || categoryLower.includes('getting')) return 'Sparkles';
  if (categoryLower.includes('image')) return 'Image';
  if (categoryLower.includes('video')) return 'Video';
  if (categoryLower.includes('billing') || categoryLower.includes('credit') || categoryLower.includes('payment')) return 'CreditCard';
  if (categoryLower.includes('account') || categoryLower.includes('profile')) return 'User';
  if (categoryLower.includes('security')) return 'Shield';
  return 'HelpCircle';
}
