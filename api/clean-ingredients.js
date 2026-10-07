const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-20b'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { rawText } = req.body || {}
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    res.status(400).json({ error: 'rawText is required' })
    return
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Here is raw OCR text from a food product ingredient label. Extract ONLY the ingredient names as a clean comma-separated list. Ignore any non-ingredient text like brand names, weight, nutritional info, etc. Handle misspellings and partial words. Raw text: ${rawText}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq ingredient cleanup error:', response.status, errorBody)
      res.status(502).json({ error: 'Failed to clean ingredient text' })
      return
    }

    const data = await response.json()
    const cleanedText = data.choices?.[0]?.message?.content?.trim()

    res.status(200).json({ cleanedText: cleanedText || rawText, cleaned: Boolean(cleanedText) })
  } catch (err) {
    console.error('Groq ingredient cleanup error:', err)
    res.status(500).json({ error: 'Failed to clean ingredient text' })
  }
}
