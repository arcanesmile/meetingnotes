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
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. All plans include a 14-day free trial on Pro.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-muted-foreground ml-1">/month</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/sign-in" className="w-full">
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
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
