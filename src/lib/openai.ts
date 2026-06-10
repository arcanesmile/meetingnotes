import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface NoteSummaryResult {
  summary: string
  actionItems: string
}

export async function summarizeNote(content: string): Promise<NoteSummaryResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

  const prompt = `You are a professional meeting notes assistant. Analyze the following notes and provide:
1. A concise summary (2-3 paragraphs)
2. A list of action items with assignees if mentioned

Format your response as JSON with keys: "summary" and "actionItems".

Notes:
${content}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

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
