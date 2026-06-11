import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals getting started",
    features: ["5 notes per month", "Basic AI summaries", "Export as text"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    description: "For professionals and small teams",
    features: [
      "50 notes per month",
      "Advanced AI summaries",
      "Action items extraction",
      "Team sharing (up to 3)",
      "Export as PDF & Markdown",
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    description: "For growing organizations",
    features: [
      "Unlimited notes",
      "Priority AI processing",
      "Advanced action items",
      "Unlimited team members",
      "API access",
      "Priority support",
    ],
    cta: "Subscribe",
    popular: false,
  },
]

export default function PricingPage() {
  return (
  <div className="min-h-screen py-10 md:py-16">

    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-10 md:mb-12">

        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
          Choose Your Plan
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Start free, upgrade when you need more. All plans include a 14-day free trial on Pro.
        </p>

      </div>

      {/* Pricing grid */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
          md:gap-8
          max-w-5xl
          mx-auto
        "
      >
          {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={`
              relative flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up
              ${plan.popular ? "border-primary shadow-lg scale-[1.02]" : ""}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >

            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center sm:text-left">

              <CardTitle className="text-xl md:text-2xl">
                {plan.name}
              </CardTitle>

              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>

            </CardHeader>

            <CardContent className="flex-1">

              {/* Price */}
              <div className="mb-6 text-center sm:text-left">

                <span className="text-3xl md:text-4xl font-bold">
                  {plan.price}
                </span>

                {plan.price !== "$0" && (
                  <span className="text-muted-foreground ml-1 text-sm">
                    /month
                  </span>
                )}

              </div>

              {/* Features */}
              <ul className="space-y-3">

                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">

                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />

                    <span className="text-sm text-muted-foreground">
                      {f}
                    </span>

                  </li>
                ))}

              </ul>

            </CardContent>

            {/* CTA */}
            <CardFooter>
              <Link href="/sign-in" className="w-full">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>

          </Card>
        ))}
      </div>
    </div>
  </div>
)
}
