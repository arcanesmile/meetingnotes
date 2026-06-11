"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  UserPlus,
  Loader2,
  Check,
  Copy,
} from "lucide-react"

interface InviteMemberButtonProps {
  teamId: string
}

export function InviteMemberButton({
  teamId,
}: InviteMemberButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const [result, setResult] = useState<{
    message: string
    inviteLink?: string
  } | null>(null)

  // Close modal with Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    if (open) {
      window.addEventListener("keydown", handleEscape)
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  function closeModal() {
    setOpen(false)
    setResult(null)
    setEmail("")
    setLoading(false)
    setCopied(false)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/teams/${teamId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
        setEmail("")
        router.refresh()
      } else {
        setResult({
          message: data.error || "Failed to invite member.",
        })
      }
    } catch {
      setResult({
        message: "Something went wrong.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function copyInviteLink(link: string) {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      // Ignore clipboard errors
    }
  }

  return (
    <>
      {/* Invite Button */}
      <Button
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Invite Member
      </Button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
          onClick={closeModal}
        >
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="invite-title"
              className="
                w-full
                max-w-md
                rounded-xl
                border
                bg-card
                p-4
                sm:p-6
                shadow-xl
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <h3
                id="invite-title"
                className="mb-2 text-lg font-semibold"
              >
                Invite Member
              </h3>

              <p className="mb-4 text-sm text-muted-foreground">
                Enter the email address of the person you want
                to invite to your team.
              </p>

              {/* Result */}
              {result && (
                <div className="mb-4 rounded-md bg-muted p-3 text-sm">
                  <p>{result.message}</p>

                  {result.inviteLink && (
                    <div className="mt-3 flex items-center gap-2">
                      <code className="flex-1 truncate rounded bg-background p-2 text-xs">
                        {result.inviteLink}
                      </code>

                      <button
                        type="button"
                        onClick={() =>
                          copyInviteLink(
                            result.inviteLink!
                          )
                        }
                        className="shrink-0 rounded p-1 hover:bg-accent"
                        aria-label="Copy invite link"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleInvite}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoFocus
                  className="
                    h-11
                    w-full
                    rounded-md
                    border
                    border-input
                    bg-transparent
                    px-3
                    text-sm
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-primary
                  "
                />

                {/* Buttons */}
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      loading || !email.trim()
                    }
                    className="flex-1"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {loading
                      ? "Sending..."
                      : "Send Invite"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}