interface NoteSummaryResult {
  summary: string
  actionItems: string
}

const MODEL = "gemini-2.5-flash"

export async function summarizeNote(
  content: string
): Promise<NoteSummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing")
  }

  const prompt = `
You are a professional meeting notes assistant.

Analyze the following notes and provide:

1. A concise summary (2-3 paragraphs)
2. A list of action items with assignees if mentioned

Return ONLY valid JSON in this format:

{
  "summary": "...",
  "actionItems": "..."
}

Notes:
${content}
`

  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, 30000)

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!res.ok) {
      const errorText = await res.text()

      throw new Error(
        `Gemini API Error ${res.status}: ${errorText}`
      )
    }

    const data = await res.json()

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      const parsed = JSON.parse(cleaned)

      return {
        summary: parsed.summary || "No summary generated.",
        actionItems:
          parsed.actionItems || "No action items found.",
      }
    } catch {
      return {
        summary: text,
        actionItems: "No action items found.",
      }
    }
  } finally {
    clearTimeout(timeout)
  }
}