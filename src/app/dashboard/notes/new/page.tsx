"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, ArrowLeft, Save, Users } from "lucide-react"
import Link from "next/link"

interface Team {
  id: string
  name: string
}

export default function NewNotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedTeamId = searchParams.get("teamId")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState<string | null>(null)
  const [actionItems, setActionItems] = useState<string | null>(null)
  const [summarizing, setSummarizing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(preselectedTeamId)
  const [showTeamSelect, setShowTeamSelect] = useState(false)

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => {
        setTeams(data)
        if (preselectedTeamId) setSelectedTeamId(preselectedTeamId)
      })
      .catch(() => { })
  }, [preselectedTeamId])

  async function handleSummarize() {
    if (!content.trim()) return
    setSummarizing(true)
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      setSummary(data.summary)
      setActionItems(data.actionItems)
    } catch {
      alert("Failed to summarize. Please try again.")
    } finally {
      setSummarizing(false)
    }
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, summary, actionItems, teamId: selectedTeamId || undefined }),
      })
      const note = await res.json()
      if (selectedTeamId) {
        router.push(`/dashboard/teams/${selectedTeamId}`)
      } else {
        router.push(`/dashboard/notes/${note.id}`)
      }
    } catch {
      alert("Failed to save note.")
    } finally {
      setSaving(false)
    }
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:px-6 lg:px-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        {/* Back + Title */}
        <div className="flex items-center gap-3 flex-1">
          <Link
            href={
              selectedTeamId
                ? `/dashboard/teams/${selectedTeamId}`
                : "/dashboard/notes"
            }
          >
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <input
            className="
            flex-1
            bg-transparent
            border-none
            outline-none
            font-bold
            w-full
            text-2xl
            md:text-3xl
            placeholder:text-muted-foreground/50
          "
            placeholder="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">

          {teams.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setShowTeamSelect(!showTeamSelect)}
              >
                <Users className="h-4 w-4 mr-2" />
                {selectedTeam ? selectedTeam.name : "Personal"}
              </Button>

              {showTeamSelect && (
                <div
                  className="
                  absolute
                  left-0
                  sm:right-0
                  sm:left-auto
                  top-full
                  mt-1
                  w-full
                  sm:w-48
                  bg-card
                  border
                  rounded-lg
                  shadow-lg
                  z-10
                  py-1
                "
                >
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                      setSelectedTeamId(null)
                      setShowTeamSelect(false)
                    }}
                  >
                    Personal
                  </button>

                  {teams.map((team) => (
                    <button
                      key={team.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                      onClick={() => {
                        setSelectedTeamId(team.id)
                        setShowTeamSelect(false)
                      }}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleSummarize}
            disabled={summarizing || !content.trim()}
          >
            {summarizing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}

            {summarizing ? "Processing..." : "AI Summarize"}
          </Button>

          <Button
            className="w-full sm:w-auto"
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Notes Card */}
      <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md" style={{ animationDelay: "100ms" }}>
        <CardHeader>
          <CardTitle className="text-base">
            Meeting Notes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <textarea
            className="
            w-full
            min-h-[250px]
            md:min-h-[350px]
            lg:min-h-[450px]
            bg-transparent
            border-none
            outline-none
            resize-none
            text-sm
            leading-relaxed
          "
            placeholder={`Paste or type your meeting notes here...

Example:
- Discussed Q3 marketing strategy
- John will draft the social media plan by Friday
- Budget approved for LinkedIn ads ($5k)
- Next meeting: Wednesday at 2pm`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* AI Summary */}
      {summary && (
        <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {actionItems && (
        <Card className="animate-fade-in-up transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="secondary" className="rounded-sm">
                TODO
              </Badge>
              Action Items
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {actionItems}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}