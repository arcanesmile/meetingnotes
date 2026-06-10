import { auth } from "@/lib/auth"
import { summarizeNote } from "@/lib/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { content } = await req.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const result = await summarizeNote(content)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Summarize error:", error)
    return NextResponse.json(
      { error: "Failed to summarize. Please try again." },
      { status: 500 }
    )
  }
}
