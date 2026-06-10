"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function RemoveMemberButton({ memberId, teamId }: { memberId: string; teamId: string }) {
  const router = useRouter()

  async function handleRemove() {
    if (!confirm("Remove this member from the team?")) return

    await fetch(`/api/teams/${teamId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    })

    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemove}>
      <Trash2 className="h-3 w-3 text-destructive" />
    </Button>
  )
}
