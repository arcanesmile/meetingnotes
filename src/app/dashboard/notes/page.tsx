import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users } from "lucide-react"
import { formatDateRelative } from "@/lib/utils"
import { NoteActions } from "./note-actions"

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
  <div className="space-y-6 px-4 py-4 md:px-6 lg:px-8">

    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">All Notes</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          {notes.length} total notes
        </p>
      </div>

      <Link href="/dashboard/notes/new" className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </Link>
    </div>

    {/* Empty State */}
    {notes.length === 0 ? (
      <Card className="animate-scale-in">
        <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
          <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4 animate-pulse" />

          <p className="text-base md:text-lg text-muted-foreground mb-2">
            No notes yet
          </p>

          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Create your first note and let AI summarize it
          </p>

          <Link href="/dashboard/notes/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </Link>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-3">

        {notes.map((note, index) => {
          const isTeamNote = note.teamId && note.team

          return (
            <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
              <Card
                className="transition-all duration-200 hover:bg-accent/50 hover:-translate-y-0.5 hover:shadow-md cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="py-4">

                  {/* Main row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {/* Left side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                        <p className="font-medium truncate text-base">
                          {note.title}
                        </p>

                        {isTeamNote && (
                          <Badge
                            variant="secondary"
                            className="w-fit text-xs flex items-center gap-1"
                          >
                            <Users className="h-3 w-3" />
                            {note.team!.name}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mt-1">

                        <span>{formatDateRelative(note.createdAt)}</span>

                        {note.userId !== userId && note.user && (
                          <span className="truncate">
                            by {note.user.name || note.user.email}
                          </span>
                        )}

                        {note.summary && (
                          <span className="text-primary">
                            AI processed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side actions */}
                    {note.userId === userId && (
                      <div className="self-start sm:self-center">
                        <NoteActions noteId={note.id} />
                      </div>
                    )}

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
