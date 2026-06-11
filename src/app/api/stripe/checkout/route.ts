import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { priceId } = await req.json()

  if (!priceId) {
    return NextResponse.json({ error: "Price ID required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  if (!user?.email) {
    return NextResponse.json({ error: "User email not found" }, { status: 400 })
  }

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    })
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
    metadata: { userId: user.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
