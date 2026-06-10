import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AcceptInviteForm } from "@/components/dashboard/accept-invite-form"

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const session = await auth()
  const { token } = await params

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: { team: true },
  })

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invite Not Found</h1>
          <p className="text-muted-foreground">This invite link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  if (invite.accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Already Accepted</h1>
          <p className="text-muted-foreground">This invite has already been accepted.</p>
        </div>
      </div>
    )
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invite Expired</h1>
          <p className="text-muted-foreground">This invite link has expired. Ask the team owner to send a new one.</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/dashboard/teams/invite/${token}`)
  }

  if (session.user.email !== invite.email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Wrong Account</h1>
          <p className="text-muted-foreground mb-4">
            This invite was sent to <strong>{invite.email}</strong>, but you are signed in as{" "}
            <strong>{session.user.email}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">Sign in with the correct account to accept this invite.</p>
        </div>
      </div>
    )
  }

  return <AcceptInviteForm token={token} teamName={invite.team.name} />
}
