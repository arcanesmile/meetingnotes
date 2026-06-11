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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">

      {/* Container */}
      <div className="w-full max-w-md md:max-w-lg">

        {/* Invalid invite */}
        {!invite && (
          <div className="text-center space-y-2">
            <h1 className="text-xl md:text-2xl font-bold">
              Invite Not Found
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              This invite link is invalid or has expired.
            </p>
          </div>
        )}

        {/* Already accepted */}
        {invite?.accepted && (
          <div className="text-center space-y-2">
            <h1 className="text-xl md:text-2xl font-bold">
              Already Accepted
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              This invite has already been accepted.
            </p>
          </div>
        )}

        {/* Expired */}
        {invite && !invite.accepted && invite.expiresAt && invite.expiresAt < new Date() && (
          <div className="text-center space-y-2">
            <h1 className="text-xl md:text-2xl font-bold">
              Invite Expired
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              This invite link has expired. Ask the team owner to send a new one.
            </p>
          </div>
        )}

        {/* Wrong account */}
        {invite && session?.user && session.user.email !== invite.email && (
          <div className="text-center space-y-3">

            <h1 className="text-xl md:text-2xl font-bold">
              Wrong Account
            </h1>

            <p className="text-sm md:text-base text-muted-foreground">
              This invite was sent to{" "}
              <span className="font-semibold text-foreground">
                {invite.email}
              </span>
              , but you are signed in as{" "}
              <span className="font-semibold text-foreground">
                {session.user.email}
              </span>.
            </p>

            <p className="text-xs md:text-sm text-muted-foreground">
              Sign in with the correct account to accept this invite.
            </p>
          </div>
        )}

        {/* Accept invite form */}
        {invite &&
          !invite.accepted &&
          (!invite.expiresAt || invite.expiresAt >= new Date()) &&
          session?.user &&
          session.user.email === invite.email && (
            <AcceptInviteForm
              token={token}
              teamName={invite.team.name}
            />
          )}
      </div>
    </div>
  )
}