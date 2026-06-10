import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PLANS } from "@/lib/stripe"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  const plan = user?.subscription?.status || "free"
  const planInfo = PLANS[plan as keyof typeof PLANS] || PLANS.free

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and subscription</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{user?.name || "Not set"}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>You are currently on the {planInfo.name} plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant={plan === "free" ? "outline" : "default"}>{planInfo.name}</Badge>
            {plan !== "free" && user?.subscription?.status && (
              <span className="text-sm text-muted-foreground capitalize">{user.subscription.status}</span>
            )}
          </div>

          {plan === "free" ? (
            <Link href="/pricing">
              <Button>Upgrade Plan</Button>
            </Link>
          ) : (
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit" variant="outline">Manage Subscription</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
