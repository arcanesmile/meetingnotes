import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { NoteDetailView } from "@/components/dashboard/note-detail-view"

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const { id } = await params

  const userTeamIds = await prisma.teamMember.findMany({
    where: { userId: session.user.id },
    select: { teamId: true },
  })

  const note = await prisma.note.findFirst({
    where: {
      id,
      OR: [
        { userId: session.user.id },
        { teamId: { in: userTeamIds.map((t) => t.teamId) } },
      ],
    },
    include: {
      user: { select: { name: true, email: true } },
      team: { select: { id: true, name: true } },
    },
  })

  if (!note) notFound()

  return <NoteDetailView note={note} currentUserId={session.user.email!} />
}
