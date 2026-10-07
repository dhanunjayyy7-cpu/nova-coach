import { Router } from 'express'
import bcrypt from 'bcrypt'
import { signToken } from '../auth.js'
import { config } from '../config.js'
import { credentialsSchema } from '../schemas.js'
import { BCRYPT_ROUNDS, createUser, findUserByEmail } from '../store.js'

// Compared against when the email doesn't exist, so response timing doesn't reveal registered emails.
const DUMMY_HASH = bcrypt.hashSync('nova-timing-placeholder', BCRYPT_ROUNDS)

export const authRouter = Router()

authRouter.use((req, res, next) => {
  if (!config.jwtSecret) {
    res.status(503).json({ error: 'Auth is not configured' })
    return
  }
  next()
})

authRouter.post('/signup', async (req, res) => {
  const { email, password } = credentialsSchema.parse(req.body)
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  const user = createUser(email, hash)
  if (!user) {
    res.status(409).json({ error: 'An account with this email already exists' })
    return
  }
  res.status(201).json({ token: signToken(user), user: { id: user.id, email: user.email } })
})

authRouter.post('/login', async (req, res) => {
  const { email, password } = credentialsSchema.parse(req.body)
  const user = findUserByEmail(email)
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !ok) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }
  res.json({ token: signToken(user), user: { id: user.id, email: user.email } })
})
