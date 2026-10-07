import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { profileSchema } from '../schemas.js'
import { getProfile, saveProfile } from '../store.js'

export const profileRouter = Router()
profileRouter.use(requireAuth)

profileRouter.get('/', (req, res) => {
  res.json({ profile: getProfile(req.user.id) })
})

profileRouter.put('/', (req, res) => {
  res.json({ profile: saveProfile(req.user.id, profileSchema.parse(req.body)) })
})
