import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { memberId } = await req.json()

  const membership = await prisma.teamMember.findFirst({
    where: { teamId: id, userId: session.user.id, role: "owner" },
  })

  if (!membership) {
    return NextResponse.json({ error: "Only the owner can remove members" }, { status: 403 })
  }

  await prisma.teamMember.deleteMany({
    where: { id: memberId, teamId: id },
  })

  return NextResponse.json({ success: true })
}
