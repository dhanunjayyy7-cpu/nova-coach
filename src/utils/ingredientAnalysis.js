import { ADDITIVES } from '../data/additives.js'
import { applyProfileOverrides } from './personalization.js'

const RISK_RANK = { avoid: 2, caution: 1, safe: 0 }

// Splits raw OCR text into individual ingredient strings.
export function parseIngredients(rawText) {
  if (!rawText) return []

  const withoutLabel = rawText.replace(/ingredients\s*:?/i, '')

  return withoutLabel
    .split(/[,\n]/)
    .map((item) =>
      item
        .replace(/[.:;]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((item) => item.length > 0)
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

// Matches a single ingredient string against the known additives list.
// Returns the highest-risk match, or a default "safe/unknown" result.
export function matchIngredient(ingredient) {
  const normalized = normalize(ingredient)
  const codeMatches = normalized.match(/\b\d{3,4}[a-z]?\b/g) || []

  let best = null

  for (const additive of ADDITIVES) {
    const nameHit = additive.aliases.some((alias) => normalized.includes(alias))
    const codeHit = additive.codes.some((code) => codeMatches.includes(code))

    if (nameHit || codeHit) {
      if (!best || RISK_RANK[additive.risk] > RISK_RANK[best.risk]) {
        best = additive
      }
    }
  }

  if (best) {
    return { name: ingredient, risk: best.risk, reason: best.reason }
  }

  return {
    name: ingredient,
    risk: 'safe',
    reason: 'Not a recognized additive — treated as safe by default.',
  }
}

export function analyzeIngredients(rawText, profile = null) {
  const ingredients = parseIngredients(rawText)
  const baseResults = ingredients.map(matchIngredient)
  const results = profile
    ? baseResults.map((item) => applyProfileOverrides(item, profile))
    : baseResults
  const score = computeScore(results)
  return { ingredients: results, score }
}

// No packaged product scores a perfect 100 — the best possible is 85.
export const SCORE_CAP = 85

export function computeScore(results) {
  let score = 100
  for (const item of results) {
    if (item.risk === 'caution') score -= 10
    if (item.risk === 'avoid') score -= 25
  }
  return Math.min(SCORE_CAP, Math.max(0, score))
}

export function scoreColor(score) {
  if (score >= 75) return '#00C896' // Primary — Excellent
  if (score >= 50) return '#4DD9B6' // Primary tint — Good
  if (score >= 25) return '#FFA502' // Warning — Poor
  return '#FF4757' // Danger — Bad
}
