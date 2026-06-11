"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Users,
  User,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface NoteDetailProps {
  note: {
    id: string
    title: string
    content: string
    summary: string | null
    actionItems: string | null
    tags: string | null
    teamId: string | null
    createdAt: Date
    user?: {
      name: string | null
      email: string | null
    }
    team?: {
      id: string
      name: string
    } | null
  }
  currentUserId?: string
}

export function NoteDetailView({
  note,
  currentUserId,
}: NoteDetailProps) {
  const isOwnNote =
    !currentUserId ||
    !note.user ||
    currentUserId === note.user.email

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <Link href="/dashboard/notes">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h1 className="break-words text-2xl font-bold sm:text-3xl">
              {note.title}
            </h1>

            {note.team && (
              <Link
                href={`/dashboard/teams/${note.team.id}`}
                className="w-fit"
              >
                <Badge
                  variant="secondary"
                  className="flex cursor-pointer items-center gap-1 hover:bg-secondary/80"
                >
                  <Users className="h-3 w-3" />
                  {note.team.name}
                </Badge>
              </Link>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>

            {note.user && !isOwnNote && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="break-all">
                  {note.user.name || note.user.email}
                </span>
              </div>
            )}

            {note.tags && (
              <div className="break-all">
                {note.tags}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Original Notes */}
      <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md" style={{ animationDelay: "0ms" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Original Notes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <p className="whitespace-pre-wrap break-words text-sm leading-7">
              {note.content}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      {note.summary && (
        <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              AI Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <p className="whitespace-pre-wrap break-words text-sm leading-7">
                {note.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {note.actionItems && (
        <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              <Badge
                variant="secondary"
                className="rounded-sm"
              >
                TODO
              </Badge>

              <span>Action Items</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <p className="whitespace-pre-wrap break-words text-sm leading-7">
                {note.actionItems}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}