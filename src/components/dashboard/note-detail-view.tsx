"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Calendar, Users, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface NoteDetailProps {
  note: {
    id: string
    title: string
    content: string
    summary: string | null
    actionItems: string | null
    tags: string | null
    teamId: string | null
    createdAt: Date
    user?: { name: string | null; email: string | null }
    team?: { id: string; name: string } | null
  }
  currentUserId?: string
}

export function NoteDetailView({ note, currentUserId }: NoteDetailProps) {
  const isOwnNote = !currentUserId || !note.user || currentUserId === note.user.email

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{note.title}</h1>
            {note.team && (
              <Link href={`/dashboard/teams/${note.team.id}`}>
                <Badge variant="secondary" className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80">
                  <Users className="h-3 w-3" />
                  {note.team.name}
                </Badge>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(note.createdAt)}</span>
            {note.user && !isOwnNote && (
              <>
                <span>&middot;</span>
                <User className="h-3 w-3" />
                <span>{note.user.name || note.user.email}</span>
              </>
            )}
            {note.tags && <span>&middot; {note.tags}</span>}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Original Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
        </CardContent>
      </Card>

      {note.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.summary}</p>
          </CardContent>
        </Card>
      )}

      {note.actionItems && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="secondary" className="rounded-sm">TODO</Badge>
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.actionItems}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
