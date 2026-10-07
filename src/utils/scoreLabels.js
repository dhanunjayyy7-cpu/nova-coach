export function scoreLabel(score) {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 25) return 'Poor'
  return 'Bad'
}

// Same thresholds as the NOVA score badge: green ≥70, yellow 40–69, red <40.
export function verdictForScore(score) {
  if (score >= 70) return 'safe'
  if (score >= 40) return 'caution'
  return 'avoid'
}

export function scorePercentileText(score) {
  if (score > 75) return 'Better than top 15% of similar products'
  if (score > 50) return 'Better than top 40% of similar products'
  if (score > 25) return 'Better than bottom 40% of similar products'
  return 'Better than bottom 15% of similar products'
}
