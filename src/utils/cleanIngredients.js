import { postAi } from './aiRequest'

// Asks the AI endpoint to extract just the ingredient list from raw OCR text
// (dropping brand names, weights, nutrition tables, and fixing misspellings).
// Falls back to the raw OCR text if every endpoint fails or times out — the
// local scoring engine still runs either way.
export async function cleanIngredientsText(rawText) {
  if (!rawText || !rawText.trim()) return rawText
  const data = await postAi('clean-ingredients', { rawText }, 15000)
  return data?.cleanedText || rawText
}
