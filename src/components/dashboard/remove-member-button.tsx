"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

interface RemoveMemberButtonProps {
  memberId: string
  teamId: string
}

export function RemoveMemberButton({
  memberId,
  teamId,
}: RemoveMemberButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    const confirmed = window.confirm(
      "Remove this member from the team?"
    )

    if (!confirmed) return

    try {
      setLoading(true)

      const response = await fetch(
        `/api/teams/${teamId}/members`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to remove member.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleRemove}
      disabled={loading}
      aria-label="Remove member"
      className="
        h-8
        w-8
        shrink-0
        sm:h-9
        sm:w-9
      "
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 text-destructive" />
      )}
    </Button>
  )
}