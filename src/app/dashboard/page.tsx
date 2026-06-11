import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Zap, Users } from "lucide-react"
import { formatDateRelative } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const userId = session.user.id
  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const noteCount = await prisma.note.count({ where: { userId } })
  const teamCount = await prisma.teamMember.count({ where: { userId } })

 return (
  <div className="space-y-6 md:space-y-8 px-4 py-4 md:px-6 lg:px-8">

    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <Link href="/dashboard/notes/new" className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </Link>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      <Card className="animate-fade-in-up transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: "0ms" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Total Notes
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">
            {noteCount}
          </p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in-up transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: "100ms" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            AI Summaries
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">
            {notes.filter((n) => n.summary).length}
          </p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in-up transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: "200ms" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Teams
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold">
            {teamCount}
          </p>
        </CardContent>
      </Card>

    </div>

    {/* Recent Notes */}
    <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>

      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Recent Notes
      </h2>

      {notes.length === 0 ? (
        <Card className="animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-10 md:py-12 text-center">

            <FileText className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4 animate-pulse" />

            <p className="text-sm md:text-base text-muted-foreground mb-4">
              No notes yet
            </p>

            <Link href="/dashboard/notes/new">
              <Button>
                Create Your First Note
              </Button>
            </Link>

          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">

          {notes.map((note, index) => (
            <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
              <Card
                className="transition-all duration-200 hover:bg-accent/50 hover:-translate-y-0.5 hover:shadow-md cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 80}ms` }}
              >
                <CardContent className="py-4">

                  <p className="font-medium text-sm md:text-base truncate">
                    {note.title}
                  </p>

                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {formatDateRelative(note.createdAt)}
                    {note.summary ? " · AI processed" : ""}
                  </p>

                </CardContent>

              </Card>
            </Link>
          ))}

        </div>
      )}
    </div>
  </div>
)
}
