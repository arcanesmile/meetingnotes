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
  <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 lg:px-8 space-y-6 md:space-y-8">

    {/* Header */}
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">
        Settings
      </h1>

      <p className="text-sm md:text-base text-muted-foreground mt-1">
        Manage your account and subscription
      </p>
    </div>

    {/* Profile Card */}
    <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md" style={{ animationDelay: "0ms" }}>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">
          Profile
        </CardTitle>
        <CardDescription>
          Your account information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs md:text-sm font-medium">
            Name
          </label>
          <p className="text-sm text-muted-foreground">
            {user?.name || "Not set"}
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs md:text-sm font-medium">
            Email
          </label>
          <p className="text-sm text-muted-foreground break-all">
            {user?.email}
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Subscription Card */}
    <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md" style={{ animationDelay: "100ms" }}>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">
          Subscription
        </CardTitle>

        <CardDescription>
          You are currently on the {planInfo.name} plan
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Plan badge row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

          <Badge
            variant={plan === "free" ? "outline" : "default"}
            className="w-fit"
          >
            {planInfo.name}
          </Badge>

          {plan !== "free" && user?.subscription?.status && (
            <span className="text-sm text-muted-foreground capitalize">
              {user.subscription.status}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {plan === "free" ? (
          <Link href="/pricing" className="block sm:inline-block w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Upgrade Plan
            </Button>
          </Link>
        ) : (
          <form action="/api/stripe/portal" method="POST" className="w-full sm:w-auto">
            <Button
              type="submit"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Manage Subscription
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  </div>
)
}
