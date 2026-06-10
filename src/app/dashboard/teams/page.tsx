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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground mt-1">
            Collaborate with your team on meeting notes
          </p>
        </div>
        <Link href="/dashboard/teams/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </Link>
      </div>

      {memberships.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No teams yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Create a team to collaborate on meeting notes
            </p>
            <Link href="/dashboard/teams/new">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Team
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memberships.map((m) => (
            <Link key={m.team.id} href={`/dashboard/teams/${m.team.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{m.team.name}</CardTitle>
                    <Badge variant={m.role === "owner" ? "default" : "secondary"}>
                      {m.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
