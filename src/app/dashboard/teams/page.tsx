import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, FileText } from "lucide-react"

export default async function TeamsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const memberships = await prisma.teamMember.findMany({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          _count: { select: { members: true, notes: true } },
        },
      },
    },
    orderBy: { team: { createdAt: "desc" } },
  })

 return (
  <div className="space-y-6 px-4 py-4 md:px-6 lg:px-8">

    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Teams
        </h1>

        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Collaborate with your team on meeting notes
        </p>
      </div>

      <Link href="/dashboard/teams/new" className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </Link>
    </div>

    {/* Empty state */}
    {memberships.length === 0 ? (
      <Card className="animate-scale-in">
        <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 text-center">

          <Users className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4 animate-pulse" />

          <p className="text-base md:text-lg text-muted-foreground mb-2">
            No teams yet
          </p>

          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Create a team to collaborate on meeting notes
          </p>

          <Link href="/dashboard/teams/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Team
            </Button>
          </Link>

        </CardContent>
      </Card>
    ) : (
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
        "
      >
        {memberships.map((m, index) => (
          <Link
            key={m.team.id}
            href={`/dashboard/teams/${m.team.id}`}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <Card className="transition-all duration-200 hover:bg-accent/50 hover:-translate-y-0.5 hover:shadow-md cursor-pointer h-full">

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">

                  <CardTitle className="text-base md:text-lg truncate">
                    {m.team.name}
                  </CardTitle>

                  <Badge
                    variant={m.role === "owner" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {m.role}
                  </Badge>

                </div>
              </CardHeader>

              <CardContent className="pt-0">

                <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">

                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {m.team._count.members}
                  </span>

                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {m.team._count.notes} notes
                  </span>

                </div>

              </CardContent>

            </Card>
          </Link>
        ))}
      </div>
    )}
  </div>
)
}
