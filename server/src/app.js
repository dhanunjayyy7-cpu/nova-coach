import express from 'express'
import cors from 'cors'
import { ZodError } from 'zod'
import { config } from './config.js'
import { authRouter } from './routes/auth.js'
import { profileRouter } from './routes/profile.js'
import { scansRouter } from './routes/scans.js'
import { aiRouter } from './routes/ai.js'

const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

// Small fixed-window limiter per IP — enough to slow password guessing and
// protect the Gemini quota without another dependency.
function rateLimit({ windowMs, limit }) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const entry = hits.get(req.ip)
    if (!entry || now > entry.reset) {
      hits.set(req.ip, { count: 1, reset: now + windowMs })
      next()
      return
    }
    if (++entry.count > limit) {
      res.set('Retry-After', String(Math.ceil((entry.reset - now) / 1000)))
      res.status(429).json({ error: 'Too many requests, slow down' })
      return
    }
    next()
  }
}

export function createApp() {
  const app = express()
  app.set('trust proxy', 1) // Render terminates TLS in front of the app
  app.disable('x-powered-by')

  app.use(
    cors({
      origin(origin, cb) {
        // Non-browser clients (curl, uptime checks) send no Origin.
        cb(null, !origin || LOCAL_ORIGIN.test(origin) || config.frontendUrls.includes(origin))
      },
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    }),
  )
  app.use(express.json({ limit: '100kb' }))

  app.get('/health', (_req, res) => {
    res.json({ ok: true, gemini: Boolean(config.geminiApiKey), time: new Date().toISOString() })
  })

  app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), authRouter)
  app.use('/profile', profileRouter)
  app.use('/scan', rateLimit({ windowMs: 60 * 1000, limit: 20 }))
  app.use('/', scansRouter)
  app.use('/ai', rateLimit({ windowMs: 60 * 1000, limit: 30 }), aiRouter)

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

  // Express 5 forwards rejected promises from async handlers here.
  app.use((err, _req, res, _next) => {
    if (err instanceof ZodError) {
      res.status(400).json({
        error: 'Invalid request',
        issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      })
      return
    }
    if (err.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'Malformed JSON' })
      return
    }
    console.error('[server] unhandled error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  })

  return app
}
