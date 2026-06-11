import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Users, FileText, Check, ArrowRight, Zap } from "lucide-react"

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
    features: ["50 notes per month", "Advanced AI summaries", "Action items extraction", "Team sharing (up to 3)", "Export as PDF & Markdown"],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    description: "For growing organizations",
    features: ["Unlimited notes", "Priority AI processing", "Advanced action items", "Unlimited team members", "API access", "Priority support"],
    cta: "Subscribe",
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl">
            <Brain className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            MeetNotes
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="md:size-default">
                Sign In
              </Button>
            </Link>

            <Link href="/sign-in">
              <Button size="sm" className="md:size-default">
                Get Started
              </Button>
            </Link>
          </div>

        </div>
      </header>

      <main className="flex-1">

        {/* HERO */}
        <section className="py-16 md:py-32">
          <div className="mx-auto max-w-4xl px-4 text-center animate-fade-in-up">

            <Badge className="mb-4 text-xs md:text-sm" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Meeting Intelligence
            </Badge>

            <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Your Meeting Notes,
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Supercharged by AI
              </span>
            </h1>

            <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Paste your meeting notes and get instant AI summaries, action items, and insights.
              Share with your team and never miss a task again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="w-full sm:w-auto transition-all duration-200 hover:scale-105">
                  Start Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>

              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto transition-all duration-200 hover:scale-105">
                  Learn More
                </Button>
              </Link>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-16 md:py-24 bg-muted/50">

          <div className="mx-auto max-w-7xl px-4">

            <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                Everything you need to master your meetings
              </h2>

              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Stop digging through messy notes. Let AI do the heavy lifting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

              {[
                {
                  icon: FileText,
                  title: "Smart Summaries",
                  desc: "AI instantly condenses your notes into clear summaries.",
                },
                {
                  icon: Zap,
                  title: "Action Items",
                  desc: "Automatically extract tasks, owners, and deadlines.",
                },
                {
                  icon: Users,
                  title: "Team Sharing",
                  desc: "Share processed notes with your team instantly.",
                },
              ].map((item, index) => (
                <Card key={item.title} className="border-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <item.icon className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                    <CardTitle className="text-base md:text-lg">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}

            </div>

          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-16 md:py-24">

          <div className="mx-auto max-w-7xl px-4">

            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                Simple, transparent pricing
              </h2>

              <p className="text-sm md:text-base text-muted-foreground">
                Start free, upgrade when you need more power.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={plan.name}
                  className={`
                    relative flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up
                    ${plan.popular ? "border-primary shadow-lg scale-[1.02]" : ""}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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
                    <div className="mb-6 text-center sm:text-left">
                      <span className="text-3xl md:text-4xl font-bold">
                        {plan.price}
                      </span>
                      {plan.price !== "$0" && (
                        <span className="text-muted-foreground ml-1 text-sm">/month</span>
                      )}
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
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs md:text-sm text-muted-foreground">
          © {new Date().getFullYear()} MeetNotes. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
