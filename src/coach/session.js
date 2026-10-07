// Nova Coach login session. Guests never have one and keep the local-only flow.
const SESSION_KEY = 'nova_coach_session'

export const COACH_API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const isCoachConfigured = Boolean(COACH_API_URL)

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return session?.token ? session : null
  } catch {
    return null
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // ignore
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}
