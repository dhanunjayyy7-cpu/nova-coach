import axios from 'axios'
import { COACH_API_URL, clearSession, getSession, setSession } from './session'

// Render's free tier can take ~30s to wake up, so allow for a cold start.
export const api = axios.create({ baseURL: COACH_API_URL, timeout: 30000 })

api.interceptors.request.use((config) => {
  const session = getSession()
  if (session) config.headers.Authorization = `Bearer ${session.token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only an authenticated request means "session expired"; a 401 from /auth/login is just a wrong password.
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      clearSession()
      window.location.assign('/login?expired=1')
    }
    return Promise.reject(error)
  },
)

export function errorMessage(error) {
  const data = error.response?.data
  if (data?.issues?.length) return data.issues[0].message
  if (data?.error) return data.error
  if (error.code === 'ECONNABORTED') return 'The Nova Coach server took too long to respond.'
  return 'Couldn’t reach the Nova Coach server.'
}

async function authenticate(path, email, password) {
  const { data } = await api.post(path, { email, password })
  setSession({ token: data.token, email: data.user.email })
  return data.user
}

export const login = (email, password) => authenticate('/auth/login', email, password)
export const signup = (email, password) => authenticate('/auth/signup', email, password)

export async function requestPersonalVerdict(payload) {
  const { data } = await api.post('/scan', payload)
  return data
}
