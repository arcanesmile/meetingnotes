"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Delete this note?")) return
    await fetch(`/api/notes/${noteId}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}
