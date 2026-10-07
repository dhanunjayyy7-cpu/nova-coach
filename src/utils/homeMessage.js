import { getHistory, getScanCount } from './history'
import { postAi } from './aiRequest'
import { getProfile } from './profile'
import { GOAL_OPTIONS, labelsFor } from '../constants/profileOptions'

const CACHE_KEY = 'nova_home_message'
const TIMEOUT_MS = 4000

export const FALLBACK_MESSAGE = 'Good to see you. Ready to check your next packet?'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function getCachedHomeMessage() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    return cached?.date === today() && cached.text ? cached.text : null
  } catch {
    return null
  }
}

// Only aggregate numbers, flagged ingredient names and goals leave the device —
// never the user's name or allergies.
function buildSummary() {
  const history = getHistory()
  const averageScore = history.length
    ? history.reduce((sum, r) => sum + r.score, 0) / history.length
    : 0

  const counts = new Map()
  for (const record of history) {
    for (const item of record.topFlagged ?? []) {
      const key = item.name.toLowerCase().trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  const topFlagged = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)

  return {
    scanCount: getScanCount(),
    averageScore: Math.round(averageScore),
    topFlagged,
    goals: labelsFor(GOAL_OPTIONS, getProfile()?.goals),
  }
}

let inflight = null
// After one failure, use the fallback for the rest of the session rather than
// making every Home visit wait up to TIMEOUT_MS again.
let failedThisSession = false

// Resolves to today's message; never rejects. Falls back to a static line if
// the API fails or takes longer than TIMEOUT_MS. Only real replies are cached.
export function loadHomeMessage() {
  const cached = getCachedHomeMessage()
  if (cached) return Promise.resolve(cached)
  if (failedThisSession) return Promise.resolve(FALLBACK_MESSAGE)
  if (inflight) return inflight

  inflight = postAi('home-message', buildSummary(), TIMEOUT_MS)
    .then((data) => {
      const text = data?.message?.trim()
      if (!text) {
        failedThisSession = true
        return FALLBACK_MESSAGE
      }
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today(), text }))
      } catch {
        // ignore
      }
      return text
    })
    .catch(() => {
      failedThisSession = true
      return FALLBACK_MESSAGE
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}
