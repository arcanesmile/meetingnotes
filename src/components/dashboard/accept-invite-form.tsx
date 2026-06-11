"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Loader2 } from "lucide-react"

export function AcceptInviteForm({
  token,
  teamName,
}: {
  token: string
  teamName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAccept() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/teams/invite/${token}`, {
        method: "POST",
      })

      const data = await res.json()

      if (res.ok) {
        router.push(`/dashboard/teams/${data.teamId}`)
        router.refresh()
      } else {
        setError(data.error || "Failed to accept invite")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">

      <Card className="w-full max-w-sm sm:max-w-md text-center">

        <CardHeader className="space-y-3">

          <div className="flex justify-center">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>

          <CardTitle className="text-xl sm:text-2xl">
            Join {teamName}
          </CardTitle>

          <CardDescription className="text-sm sm:text-base">
            You’ve been invited to join this team.
            <br />
            Accept to start collaborating on meeting notes.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* CTA */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}

            {loading ? "Joining..." : "Accept Invite"}
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}