import jwt from 'jsonwebtoken'
import { config } from './config.js'

const TOKEN_TTL = '7d'

export function signToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email }, config.jwtSecret, {
    expiresIn: TOKEN_TTL,
  })
}

export function requireAuth(req, res, next) {
  if (!config.jwtSecret) {
    res.status(503).json({ error: 'Auth is not configured' })
    return
  }
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) {
    res.status(401).json({ error: 'Missing token' })
    return
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    req.user = { id: Number(payload.sub), email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
