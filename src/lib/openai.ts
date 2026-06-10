interface NoteSummaryResult {
  summary: string
  actionItems: string
}

export async function summarizeNote(content: string): Promise<NoteSummaryResult> {
  const prompt = `You are a professional meeting notes assistant. Analyze the following notes and provide:
1. A concise summary (2-3 paragraphs)
2. A list of action items with assignees if mentioned

Format your response as JSON with keys: "summary" and "actionItems".

Notes:
${content}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )

  if (!res.ok) {
    const err = await res.text().catch(() => "unknown error")
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const parsed = JSON.parse(cleaned) as NoteSummaryResult
    return {
      summary: parsed.summary || "No summary generated.",
      actionItems: parsed.actionItems || "No action items found.",
    }
  } catch {
    return { summary: text, actionItems: "No action items found." }
  }
}
