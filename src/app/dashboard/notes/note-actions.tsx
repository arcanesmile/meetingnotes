"use client"

import { DeleteNoteButton } from "@/components/dashboard/delete-note-button"

interface NoteActionsProps {
  noteId: string
}

export function NoteActions({ noteId }: NoteActionsProps) {
  return (
    <div
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      onClick={(e) => e.preventDefault()}
    >
      <DeleteNoteButton noteId={noteId} />
    </div>
  )
}