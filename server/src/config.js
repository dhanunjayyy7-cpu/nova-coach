// Env vars come from server/.env via `node --env-file-if-exists=.env` (see package.json).
export const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  // gemini-2.5-flash is closed to new API keys.
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  frontendUrls: (process.env.FRONTEND_URL || '')
    .split(',')
    .map((u) => u.trim().replace(/\/$/, ''))
    .filter(Boolean),
}

if (!config.jwtSecret) {
  console.warn('[config] JWT_SECRET is not set — auth routes will refuse requests until it is.')
}
if (!config.geminiApiKey) {
  console.warn('[config] GEMINI_API_KEY is not set — AI calls will use their fallbacks.')
}
