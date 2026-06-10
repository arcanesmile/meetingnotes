import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Users, FileText, Check, ArrowRight, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Brain className="h-6 w-6 text-primary" />
            MeetNotes
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Meeting Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your Meeting Notes,
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Supercharged by AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Paste your meeting notes and get instant AI summaries, action items, and insights.
              Share with your team and never miss a task again.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-base">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-base">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to master your meetings
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stop digging through messy notes. Let AI do the heavy lifting.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Smart Summaries</CardTitle>
                  <CardDescription>
                    AI instantly condenses your notes into clear, concise summaries.
                    Focus on what matters.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>
                    Automatically extract tasks, owners, and deadlines from your
                    meeting notes.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Team Sharing</CardTitle>
                  <CardDescription>
                    Share processed notes with your team. Collaborate and stay aligned
                    on next steps.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start free, upgrade when you need more power.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="relative flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>For individuals getting started</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-4xl font-bold mb-6">$0</p>
                  <ul className="space-y-3">
                    {["5 notes per month", "Basic AI summaries", "Export as text"].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-in" className="w-full">
                    <Button variant="outline" className="w-full">Get Started</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="relative flex flex-col border-primary shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For professionals and small teams</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-4xl font-bold mb-1">$15</p>
                  <p className="text-sm text-muted-foreground mb-6">per month</p>
                  <ul className="space-y-3">
                    {["50 notes per month", "Advanced AI summaries", "Action items extraction", "Team sharing (up to 3)", "Export as PDF & Markdown"].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-in" className="w-full">
                    <Button className="w-full">Subscribe</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="relative flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">Business</CardTitle>
                  <CardDescription>For growing organizations</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-4xl font-bold mb-1">$49</p>
                  <p className="text-sm text-muted-foreground mb-6">per month</p>
                  <ul className="space-y-3">
                    {["Unlimited notes", "Priority AI processing", "Advanced action items", "Unlimited team members", "API access", "Priority support"].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-in" className="w-full">
                    <Button variant="outline" className="w-full">Subscribe</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MeetNotes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
