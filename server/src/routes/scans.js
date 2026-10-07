import { Router } from 'express'
import { requireAuth } from '../auth.js'
import { scanSchema } from '../schemas.js'
import { personalize } from '../personalize.js'
import { addScan, getProfile, getScans } from '../store.js'

const HISTORY_LIMIT = 100

// Mounted at the root, so auth is per-route — a router-wide guard would turn every unknown URL into a 401.
export const scansRouter = Router()

scansRouter.post('/scan', requireAuth, async (req, res) => {
  const scan = scanSchema.parse(req.body)
  const result = await personalize(scan, getProfile(req.user.id))

  const record = addScan(req.user.id, {
    product_name: scan.product_name,
    ingredients: scan.ingredients,
    generic_score: scan.generic_score,
    personal_score: result.personal_score,
    verdict: result.verdict,
    reason: result.reason,
  })

  const { user_id: _user, ingredients: _ingredients, ...scanOut } = record
  res.status(201).json({
    scan: scanOut,
    source: result.source,
    allergen_override: Boolean(result.allergen_override),
  })
})

scansRouter.get('/history', requireAuth, (req, res) => {
  const scans = getScans(req.user.id, HISTORY_LIMIT).map(
    ({ user_id: _user, ingredients: _ingredients, ...s }) => s,
  )
  res.json({ scans })
})
