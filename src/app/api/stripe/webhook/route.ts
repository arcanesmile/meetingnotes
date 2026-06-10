import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

async function getSubscription(id: string): Promise<Stripe.Subscription> {
  const result = await stripe.subscriptions.retrieve(id)
  return result as unknown as Stripe.Subscription
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const subscriptionId = session.subscription as string | undefined

      if (userId && subscriptionId) {
        const sub = await getSubscription(subscriptionId)

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeId: subscriptionId,
            status: sub.status,
            priceId: sub.items.data[0]?.price.id,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
          update: {
            stripeId: subscriptionId,
            status: sub.status,
            priceId: sub.items.data[0]?.price.id,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        })
      }
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice & { subscription: string }
      const subscriptionId = invoice.subscription

      if (subscriptionId) {
        const sub = await getSubscription(subscriptionId)
        const customerId = invoice.customer as string
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              stripeId: subscriptionId,
              status: sub.status,
              priceId: sub.items.data[0]?.price.id,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
            update: {
              status: sub.status,
              priceId: sub.items.data[0]?.price.id,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          })
        }
      }
      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      })

      if (user) {
        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
