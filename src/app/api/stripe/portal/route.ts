import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  if (!user?.stripeCustomerId) {
    redirect("/dashboard/settings")
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })

  redirect(portalSession.url)
}
