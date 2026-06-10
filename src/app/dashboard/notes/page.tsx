import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users } from "lucide-react"
import { formatDateRelative } from "@/lib/utils"
import { DeleteNoteButton } from "@/components/dashboard/delete-note-button"

export default async function NotesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const userId = session.user.id

  const userTeamIds = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  })

  const teamIds = userTeamIds.map((t) => t.teamId)

  const notes = await prisma.note.findMany({
    where: {
      OR: [
        { userId },
        { teamId: { in: teamIds } },
      ],
    },
    include: {
      user: { select: { name: true, email: true } },
      team: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Notes</h1>
          <p className="text-muted-foreground mt-1">{notes.length} total notes</p>
        </div>
        <Link href="/dashboard/notes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No notes yet</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first note and let AI summarize it</p>
            <Link href="/dashboard/notes/new">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const isTeamNote = note.teamId && note.team
            return (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{note.title}</p>
                        {isTeamNote && (
                          <Badge variant="secondary" className="shrink-0 text-xs flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {note.team!.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDateRelative(note.createdAt)}</span>
                        {note.userId !== userId && note.user && (
                          <span>by {note.user.name || note.user.email}</span>
                        )}
                        {note.summary && <span className="text-primary">AI processed</span>}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100" onClick={(e) => e.preventDefault()}>
                      {note.userId === userId && <DeleteNoteButton noteId={note.id} />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
