import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
      },
    },
  })

  if (!team) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(team)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const membership = await prisma.teamMember.findFirst({
    where: { teamId: id, userId: session.user.id, role: "owner" },
  })

  if (!membership) {
    return NextResponse.json({ error: "Only the owner can delete the team" }, { status: 403 })
  }

  await prisma.team.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
