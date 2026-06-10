"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserPlus, Loader2, Check, Copy } from "lucide-react"

export function InviteMemberButton({ teamId }: { teamId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ message: string; inviteLink?: string } | null>(null)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    try {
      const res = await fetch(`/api/teams/${teamId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setEmail("")
        router.refresh()
      } else {
        setResult({ message: data.error || "Failed to invite" })
      }
    } catch {
      setResult({ message: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4 mr-2" />
        Invite Member
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-xl border shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Invite Member</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the email address of the person you want to invite.
            </p>

            {result && (
              <div className="mb-4 p-3 rounded-md bg-muted text-sm">
                <p>{result.message}</p>
                {result.inviteLink && (
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs bg-background p-1 rounded flex-1 truncate">
                      {result.inviteLink}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(result.inviteLink!)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-3">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setOpen(false); setResult(null) }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !email.trim()} className="flex-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {loading ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
