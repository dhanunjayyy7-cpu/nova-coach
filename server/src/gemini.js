import { config } from './config.js'

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
// Gemini returns sporadic 503/429s under load; a quick retry usually succeeds.
const RETRYABLE = new Set([429, 500, 503])
const MIN_ATTEMPT_MS = 2000

class GeminiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function attempt(body, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${BASE_URL}/${config.geminiModel}:generateContent`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.geminiApiKey },
      body,
    })
    if (!response.ok) {
      throw new GeminiError(
        `Gemini HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`,
        response.status,
      )
    }
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim()
    if (!text) throw new GeminiError('Gemini returned no text')
    return text
  } finally {
    clearTimeout(timer)
  }
}

// Calls Gemini and returns the response text, retrying transient failures
// while time remains. Throws on missing key, hard errors, empty output, or
// when the overall `timeoutMs` budget runs out.
export async function generateText({
  system,
  prompt,
  responseSchema,
  temperature = 0.4,
  maxOutputTokens = 512,
  timeoutMs = 8000,
}) {
  if (!config.geminiApiKey) throw new Error('GEMINI_API_KEY is not set')

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      // Short, structured answers don't need thinking — and it would eat the latency budget.
      thinkingConfig: { thinkingBudget: 0 },
      ...(responseSchema && { responseMimeType: 'application/json', responseSchema }),
    },
  })

  const deadline = Date.now() + timeoutMs
  for (;;) {
    try {
      return await attempt(body, deadline - Date.now())
    } catch (err) {
      const remaining = deadline - Date.now() - 250
      if (!RETRYABLE.has(err.status) || remaining < MIN_ATTEMPT_MS) throw err
      await new Promise((r) => setTimeout(r, 250))
    }
  }
}
