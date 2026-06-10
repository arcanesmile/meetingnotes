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
      .catch(() => {})
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={selectedTeamId ? `/dashboard/teams/${selectedTeamId}` : "/dashboard/notes"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <input
            className="text-3xl font-bold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/50"
            placeholder="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {teams.length > 0 && (
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setShowTeamSelect(!showTeamSelect)}>
                <Users className="h-4 w-4 mr-2" />
                {selectedTeam ? selectedTeam.name : "Personal"}
              </Button>
              {showTeamSelect && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-10 py-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => { setSelectedTeamId(null); setShowTeamSelect(false) }}
                  >
                    Personal
                  </button>
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                      onClick={() => { setSelectedTeamId(team.id); setShowTeamSelect(false) }}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <Button variant="outline" onClick={handleSummarize} disabled={summarizing || !content.trim()}>
            {summarizing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {summarizing ? "Processing..." : "AI Summarize"}
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meeting Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-[300px] bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
            placeholder="Paste or type your meeting notes here...

Example:
- Discussed Q3 marketing strategy
- John will draft the social media plan by Friday
- Budget approved for LinkedIn ads ($5k)
- Next meeting: Wednesday at 2pm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
          </CardContent>
        </Card>
      )}

      {actionItems && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="secondary" className="rounded-sm">TODO</Badge>
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{actionItems}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
