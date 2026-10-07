export function scoreLabel(score) {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 25) return 'Poor'
  return 'Bad'
}

export function scorePercentileText(score) {
  if (score > 75) return 'Better than top 15% of similar products'
  if (score > 50) return 'Better than top 40% of similar products'
  if (score > 25) return 'Better than bottom 40% of similar products'
  return 'Better than bottom 15% of similar products'
}
