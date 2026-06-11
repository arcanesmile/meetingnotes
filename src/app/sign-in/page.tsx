"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Registration failed")
          setLoading(false)
          return
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      window.location.href = "/dashboard"
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">

      <Card className="w-full max-w-md sm:max-w-lg">

        <CardHeader className="text-center space-y-2">

          <Link href="/" className="flex justify-center">
            <Brain className="h-8 w-8 text-primary" />
          </Link>

          <CardTitle className="text-xl sm:text-2xl">
            {isRegister ? "Create Account" : "Welcome Back"}
          </CardTitle>

          <CardDescription className="text-sm sm:text-base">
            {isRegister
              ? "Start your free trial today"
              : "Sign in to your account"}
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-6">

          {/* OAuth */}
          <div className="space-y-3">

            <Button
              variant="outline"
              className="w-full text-sm sm:text-base"
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard" })
              }
            >
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full text-sm sm:text-base"
              onClick={() =>
                signIn("github", { callbackUrl: "/dashboard" })
              }
            >
              Continue with GitHub
            </Button>

          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {isRegister && (
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  className="w-full mt-1 h-10 rounded-md border bg-transparent px-3 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                className="w-full mt-1 h-10 rounded-md border bg-transparent px-3 text-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                className="w-full mt-1 h-10 rounded-md border bg-transparent px-3 text-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button className="w-full" disabled={loading}>
              {loading
                ? "Loading..."
                : isRegister
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-sm text-center text-muted-foreground">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              className="text-primary underline underline-offset-4"
              onClick={() => {
                setIsRegister(!isRegister)
                setError("")
              }}
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>

        </CardContent>

      </Card>
    </div>
  )
}