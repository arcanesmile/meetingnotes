import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { token } = await params

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { team: true },
  })

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 })
  }

  if (invite.accepted) {
    return NextResponse.json({ error: "Invite already accepted" }, { status: 400 })
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 400 })
  }

  if (invite.email !== session.user.email) {
    return NextResponse.json({ error: "This invite was sent to a different email" }, { status: 403 })
  }

  await prisma.teamMember.create({
    data: { teamId: invite.teamId, userId: session.user.id, role: invite.role },
  })

  await prisma.teamInvite.update({
    where: { id: invite.id },
    data: { accepted: true },
  })

  return NextResponse.json({ teamId: invite.teamId, teamName: invite.team.name })
}
