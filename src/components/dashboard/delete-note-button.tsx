"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this note?")
    if (!confirmed) return

    setLoading(true)

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete")
      }

      router.refresh()
    } catch (err) {
      alert("Could not delete note. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="hover:bg-destructive/10 transition-colors"
      aria-label="Delete note"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
      ) : (
        <Trash2 className="h-4 w-4 text-destructive" />
      )}
    </Button>
  )
}