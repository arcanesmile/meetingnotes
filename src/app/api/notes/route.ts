import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, content, summary, actionItems, tags, teamId } = await req.json()

  if (teamId) {
    const isMember = await prisma.teamMember.findFirst({
      where: { teamId, userId: session.user.id },
    })
    if (!isMember) {
      return NextResponse.json({ error: "Not a team member" }, { status: 403 })
    }
  }

  const note = await prisma.note.create({
    data: {
      title,
      content,
      summary,
      actionItems,
      tags,
      teamId: teamId || null,
      userId: session.user.id,
    },
  })

  return NextResponse.json(note, { status: 201 })
}
