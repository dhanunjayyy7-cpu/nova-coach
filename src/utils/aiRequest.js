import { COACH_API_URL } from '../coach/session'

// Tries the Express server's Gemini endpoint first, then the Vercel Groq
// function, all within one overall time budget. Resolves to parsed JSON, or
// null if every attempt fails — callers supply their own fallback.
export async function postAi(name, body, budgetMs) {
  const deadline = Date.now() + budgetMs
  const urls = COACH_API_URL ? [`${COACH_API_URL}/ai/${name}`, `/api/${name}`] : [`/api/${name}`]

  for (const url of urls) {
    const remaining = deadline - Date.now()
    if (remaining < 300) break
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), remaining)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (res.ok) return await res.json()
    } catch {
      // try the next endpoint
    } finally {
      clearTimeout(timer)
    }
  }
  return null
}
