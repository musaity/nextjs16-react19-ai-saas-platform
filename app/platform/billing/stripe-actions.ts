"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { getAppUrlFromHeaders } from "@/lib/config";

// CHANGED: Accepts planId instead of generic string
export async function createCheckoutSession(planId: string) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { error: "Unauthorized" };
  }
  
  // 1. FETCH PLAN FROM DB (SECURITY)
  // We trust the DB, not the client-side price
  const plan = await prisma.pricingPlan.findUnique({
    where: { id: planId }
  });

  if (!plan) {
    return { error: "Plan not found or no longer active." };
  }

  // 2. FETCH SETTINGS
  const settings = await prisma.globalSettings.findFirst();
  // URL Priority: ENV (Vercel auto-detected) -> Request Headers -> fallback
  const baseUrl = await getAppUrlFromHeaders();

  // 3. INIT STRIPE
  const stripe = await getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.credits} AI Credits (${plan.name})`,
              description: `Instant credits purchase on ${settings?.siteName || "AI SaaS"}`,
            },
            // Stripe expects amount in cents (e.g. 19.99 becomes 1999)
            unit_amount: Math.round(plan.price * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/platform/billing?success=true`,
      cancel_url: `${baseUrl}/platform/billing?canceled=true`,
      customer_email: user.emailAddresses[0].emailAddress,
      metadata: {
        userId: userId,
        credits: plan.credits.toString(), // Important for webhook
        planId: plan.id
      },
    });

    if (!session.url) throw new Error("Stripe session failed");
    
    return { url: session.url };

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return { error: error.message || "Payment initiation failed." };
  }
}