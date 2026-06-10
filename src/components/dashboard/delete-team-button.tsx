"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function DeleteTeamButton({ teamId, teamName }: { teamId: string; teamName: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${teamName}" and all its notes? This cannot be undone.`)) return

    const res = await fetch(`/api/teams/${teamId}`, { method: "DELETE" })

    if (res.ok) {
      router.push("/dashboard/teams")
      router.refresh()
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 mr-2" />
      Delete Team
    </Button>
  )
}
