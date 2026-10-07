// Groq fallback for the Nova chat assistant (primary: Express /ai/chat on Gemini).
// The system prompt mirrors server/src/prompts.js — keep them in sync.
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-20b'

const SYSTEM_TEMPLATE = `You are NOVA's friendly food health assistant. Your name is Nova.

RULES (never break these):
1. You ONLY answer questions about food, nutrition, ingredients, food safety, health, and the products scanned in NOVA. Refuse anything else politely.
2. If the user is on a product detail screen, you have full context about that product. Answer questions about IT specifically first.
3. If the user says "hi", "hello", or sends a greeting — reply warmly but briefly, mention you can help with food questions, and DO NOT repeat the product info unprompted.
4. Never hallucinate product data. If you don't know something, say so.
5. Keep replies under 120 words. Use simple, clear language.
6. If asked about a flagged additive, explain what it is and why it was flagged.
7. Context you have: {CONTEXT_JSON}`

const MAX_CONTEXT_CHARS = 6000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { message, context, history } = req.body || {}
  if (typeof message !== 'string' || !message.trim() || message.length > 1000) {
    res.status(400).json({ error: 'message is required (max 1000 characters)' })
    return
  }

  const contextJson = JSON.stringify(context && typeof context === 'object' ? context : {}).slice(
    0,
    MAX_CONTEXT_CHARS,
  )
  const turns = (Array.isArray(history) ? history : [])
    .slice(-8)
    .filter((t) => t && (t.role === 'user' || t.role === 'assistant') && typeof t.text === 'string')
    .map((t) => ({ role: t.role, content: t.text.slice(0, 1500) }))

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.5,
        max_tokens: 900,
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: SYSTEM_TEMPLATE.replace('{CONTEXT_JSON}', contextJson) },
          ...turns,
          { role: 'user', content: message.trim() },
        ],
      }),
    })

    if (!response.ok) {
      console.error('Groq chat error:', response.status, await response.text())
      res.status(502).json({ error: 'Nova can’t reply right now' })
      return
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      res.status(502).json({ error: 'Empty reply' })
      return
    }
    res.status(200).json({ reply })
  } catch (err) {
    console.error('Groq chat error:', err)
    res.status(500).json({ error: 'Nova can’t reply right now' })
  }
}
