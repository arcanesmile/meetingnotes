"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateTeamPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create team")
        return
      }

      const team = await res.json()
      router.push(`/dashboard/teams/${team.id}`)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12">

    <div className="w-full max-w-md">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">

        <Link href="/dashboard/teams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <h1 className="text-xl md:text-2xl font-bold">
          Create Team
        </h1>
      </div>

      {/* Card */}
      <Card className="shadow-sm">

        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Team Name
          </CardTitle>

          <CardDescription>
            Give your team a name to get started
          </CardDescription>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Input */}
            <input
              className="
                flex h-11 w-full rounded-md
                border border-input bg-transparent
                px-3 py-2 text-sm
                outline-none
                focus:ring-2 focus:ring-primary/30
                focus:border-primary
                transition
              "
              placeholder="e.g. Marketing Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}

              {loading ? "Creating..." : "Create Team"}
            </Button>

          </form>

        </CardContent>
      </Card>
    </div>
  </div>
)
}
