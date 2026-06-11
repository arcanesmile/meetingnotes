import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft, Mail, Trash2 } from "lucide-react"
import { formatDateRelative } from "@/lib/utils"
import { InviteMemberButton } from "@/components/dashboard/invite-member-button"
import { RemoveMemberButton } from "@/components/dashboard/remove-member-button"
import { DeleteTeamButton } from "@/components/dashboard/delete-team-button"

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { id } = await params

  const team = await prisma.team.findFirst({
    where: {
      id,
      members: { some: { userId: session.user.id } },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
      notes: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  })

  if (!team) notFound()

  const currentMember = team.members.find((m) => m.userId === session!.user!.id)
  const isOwner = currentMember?.role === "owner"
  const canManage = isOwner || currentMember?.role === "admin"

  return (
  <div className="space-y-6 px-4 py-4 md:px-6 lg:px-8">

    {/* Header */}
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

      {/* Left */}
      <div className="flex items-start gap-3">

        <Link href="/dashboard/teams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

            <h1 className="text-2xl md:text-3xl font-bold truncate">
              {team.name}
            </h1>

            <Badge
              variant={isOwner ? "default" : "secondary"}
              className="w-fit"
            >
              {currentMember?.role}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            {team.members.length} member{team.members.length !== 1 ? "s" : ""} ·{" "}
            {team.notes.length} note{team.notes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">

        {canManage && (
          <div className="w-full sm:w-auto">
            <InviteMemberButton teamId={team.id} />
          </div>
        )}

        {isOwner && (
          <div className="w-full sm:w-auto">
            <DeleteTeamButton teamId={team.id} teamName={team.name} />
          </div>
        )}
      </div>
    </div>

    {/* Main Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Members */}
      <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "0ms" }}>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Members
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3"
              >

                {/* User info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">

                  {member.user.image ? (
                    <img
                      src={member.user.image}
                      alt=""
                      className="h-9 w-9 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {member.user.name?.charAt(0) ||
                          member.user.email?.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.user.name || member.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                {/* Role + actions */}
                <div className="flex items-center gap-2 shrink-0">

                  <Badge
                    variant={member.role === "owner" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {member.role}
                  </Badge>

                  {canManage && member.role !== "owner" && (
                    <RemoveMemberButton
                      memberId={member.id}
                      teamId={team.id}
                    />
                  )}
                </div>
              </div>
            ))}

          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>

        <Card className="transition-all duration-200 hover:shadow-md">

          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <CardTitle className="text-base">
              Team Notes
            </CardTitle>

            <Link href={`/dashboard/notes/new?teamId=${team.id}`}>
              <Button className="w-full sm:w-auto" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Note
              </Button>
            </Link>
          </CardHeader>

          <CardContent>

            {team.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No notes yet. Create the first team note.
              </p>
            ) : (
              <div className="space-y-3">

                {team.notes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/dashboard/notes/${note.id}`}
                    className="block"
                  >
                    <div className="p-3 rounded-lg hover:bg-accent/50 transition-colors">

                      <p className="text-sm font-medium truncate">
                        {note.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">

                        <span className="truncate">
                          {note.user.name || note.user.email}
                        </span>

                        <span>·</span>

                        <span>
                          {formatDateRelative(note.createdAt)}
                        </span>
                      </div>

                    </div>
                  </Link>
                ))}

              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  </div>
)
}
