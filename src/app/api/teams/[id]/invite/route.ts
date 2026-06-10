import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { email } = await req.json()

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const membership = await prisma.teamMember.findFirst({
    where: { teamId: id, userId: session.user.id },
  })

  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    return NextResponse.json({ error: "Only owners and admins can invite" }, { status: 403 })
  }

  const existing = await prisma.teamMember.findFirst({
    where: { teamId: id, user: { email } },
    include: { user: true },
  })

  if (existing) {
    return NextResponse.json({ error: "User is already a member" }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  const token = crypto.randomBytes(24).toString("hex")

  if (existingUser) {
    await prisma.teamMember.create({
      data: { teamId: id, userId: existingUser.id },
    })
    return NextResponse.json({ message: "User added to team" })
  }

  const invite = await prisma.teamInvite.upsert({
    where: { teamId_email: { teamId: id, email } },
    create: {
      teamId: id,
      email,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    update: {
      token,
      accepted: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  return NextResponse.json({
    message: "Invite sent",
    inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/invite/${invite.token}`,
  })
}
