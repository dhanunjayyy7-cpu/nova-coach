import { SCORE_CAP } from './ingredientAnalysis'

const STORAGE_KEY = 'labelwise_history'
const COUNT_KEY = 'nova_scan_count'
// Saved items are never trimmed; this caps the unsaved ones.
const MAX_UNSAVED = 50

const NUTRIENT_KEYS = ['energy-kcal_100g', 'proteins_100g', 'fat_100g', 'sugars_100g', 'salt_100g']

// Scans saved before the 85 cap existed can hold scores up to 100.
function capRecord(record) {
  if (record.score <= SCORE_CAP) return record
  return {
    ...record,
    score: SCORE_CAP,
    analysis: record.analysis ? { ...record.analysis, score: SCORE_CAP } : record.analysis,
  }
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw).map(capRecord) : []
  } catch {
    return []
  }
}

function writeHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // storage full or unavailable — ignore
  }
}

function trim(history) {
  let unsaved = 0
  return history.filter((r) => r.saved || ++unsaved <= MAX_UNSAVED)
}

export function getScanById(id) {
  return getHistory().find((r) => r.id === id) ?? null
}

// Saves a scan result and returns the new record.
// entry: { type: 'label' | 'barcode', productName, brand?, analysis, color,
//          imageUrl?, nutriments?, cleanedText? }
export function saveScan(entry) {
  const flagged = entry.analysis.ingredients
    .filter((item) => item.risk !== 'safe')
    .sort((a, b) => (a.risk === 'avoid' ? -1 : b.risk === 'avoid' ? 1 : 0))

  const nutriments = entry.nutriments
    ? Object.fromEntries(NUTRIENT_KEYS.filter((k) => entry.nutriments[k] != null).map((k) => [k, entry.nutriments[k]]))
    : null

  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: entry.type,
    productName: entry.productName,
    brand: entry.brand || '',
    score: entry.analysis.score,
    color: entry.color,
    timestamp: Date.now(),
    saved: false,
    topFlagged: flagged.slice(0, 3).map((item) => ({
      name: item.name,
      risk: item.risk,
      reason: item.reason,
    })),
    flaggedCount: flagged.length,
    analysis: entry.analysis,
    imageUrl: entry.imageUrl || '',
    barcode: entry.barcode || '',
    category: entry.category || '',
    nutriments,
    cleanedText: entry.cleanedText || '',
    bookmarked: false,
  }

  // Read the count before writing, or the new record is counted twice via history.length.
  const nextCount = getScanCount() + 1
  writeHistory(trim([record, ...getHistory()]))

  try {
    localStorage.setItem(COUNT_KEY, String(nextCount))
  } catch {
    // ignore
  }

  return record
}

export function setSaved(id, saved) {
  writeHistory(getHistory().map((r) => (r.id === id ? { ...r, saved } : r)))
}

export function setBookmarked(id, bookmarked) {
  writeHistory(getHistory().map((r) => (r.id === id ? { ...r, bookmarked } : r)))
}

export function getSavedScans() {
  return getHistory().filter((r) => r.saved)
}

// Lifetime total — history itself is trimmed, so it can't be the source of truth.
export function getScanCount() {
  try {
    const stored = Number(localStorage.getItem(COUNT_KEY)) || 0
    return Math.max(stored, getHistory().length)
  } catch {
    return 0
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(COUNT_KEY)
  } catch {
    // ignore
  }
}
