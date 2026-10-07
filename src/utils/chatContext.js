import { verdictForScore } from './scoreLabels'

const NUTRIENT_KEYS = ['energy-kcal_100g', 'proteins_100g', 'fat_100g', 'sugars_100g', 'salt_100g']

// Shapes a scan result (fresh or from history) into the product context the
// chat assistant sends to /ai/chat. `coach` is the personal verdict, if any.
export function toChatProduct(result, coach = null) {
  if (!result?.analysis) return null
  const nutriments = result.nutriments
    ? Object.fromEntries(
        NUTRIENT_KEYS.filter((k) => typeof result.nutriments[k] === 'number').map((k) => [
          k,
          result.nutriments[k],
        ]),
      )
    : undefined

  return {
    name: result.productName || 'Scanned product',
    ...(result.brand && { brand: result.brand }),
    score: result.analysis.score,
    verdict: coach?.status === 'done' ? coach.scan.verdict : verdictForScore(result.analysis.score),
    ...(result.cleanedText && { ingredients: result.cleanedText.slice(0, 3000) }),
    flaggedAdditives: result.analysis.ingredients
      .filter((i) => i.risk !== 'safe')
      .slice(0, 30)
      .map((i) => ({ name: i.name.slice(0, 120), risk: i.risk })),
    ...(nutriments && Object.keys(nutriments).length > 0 && { nutriments }),
  }
}
