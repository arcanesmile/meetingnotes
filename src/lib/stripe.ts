import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export const PRICE_IDS = {
  pro: "price_pro_monthly",
  business: "price_business_monthly",
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    notes: 5,
    teamMembers: 0,
    features: ["5 notes/month", "Basic AI summaries", "Export as text"],
  },
  pro: {
    name: "Pro",
    price: 15,
    notes: 50,
    teamMembers: 3,
    stripePriceId: PRICE_IDS.pro,
    features: [
      "50 notes/month",
      "Advanced AI summaries",
      "Action items extraction",
      "Team sharing (up to 3)",
      "Export as PDF/Markdown",
    ],
  },
  business: {
    name: "Business",
    price: 49,
    notes: -1,
    teamMembers: -1,
    stripePriceId: PRICE_IDS.business,
    features: [
      "Unlimited notes",
      "Priority AI processing",
      "Advanced action items",
      "Unlimited team members",
      "Export all formats",
      "API access",
      "Priority support",
    ],
  },
}

export type PlanType = keyof typeof PLANS
