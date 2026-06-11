"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

export function DeleteTeamButton({
  teamId,
  teamName,
}: {
  teamId: string
  teamName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = confirm(
      `Are you sure you want to delete "${teamName}"?\n\nThis will permanently delete all team notes and cannot be undone.`
    )

    if (!confirmed) return

    setLoading(true)

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete team")
      }

      router.push("/dashboard/teams")
      router.refresh()
    } catch {
      alert("Could not delete team. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
      className="w-full sm:w-auto"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 mr-2" />
      )}

      {loading ? "Deleting..." : "Delete Team"}
    </Button>
  )
}