export interface NoteWithDetails {
  id: string
  title: string
  content: string
  summary: string | null
  actionItems: string | null
  tags: string | null
  userId: string
  teamId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionInfo {
  plan: "free" | "pro" | "business"
  status: string
  notesUsed: number
  notesLimit: number
}

export interface UserSession {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}
