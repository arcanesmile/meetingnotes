import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const memberships = await prisma.teamMember.findMany({
    where: { userId: session.user.id },
    include: {
      team: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
          _count: { select: { notes: true } },
        },
      },
    },
    orderBy: { team: { createdAt: "desc" } },
  })

  return NextResponse.json(memberships.map((m) => ({ ...m.team, role: m.role })))
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 })
  }

  const team = await prisma.team.create({
    data: {
      name: name.trim(),
      members: {
        create: { userId: session.user.id, role: "owner" },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
    },
  })

  return NextResponse.json(team, { status: 201 })
}
