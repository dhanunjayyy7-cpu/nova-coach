// Ratings and reviews are stored only on this device, one entry per product.
const REVIEWS_KEY = 'nova_reviews'

export function productKey({ barcode, productName }) {
  return barcode ? `bc:${barcode}` : `name:${(productName || '').trim().toLowerCase()}`
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function getReviewCount() {
  return Object.keys(readAll()).length
}

export function getReview(key) {
  return readAll()[key] ?? null
}

// Keeps any existing review text when only the stars change.
export function saveReview(key, { stars, text }) {
  const all = readAll()
  const previous = all[key]
  all[key] = {
    stars,
    text: text ?? previous?.text ?? '',
    updatedAt: Date.now(),
  }
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all))
  } catch {
    // storage full or unavailable
  }
  return all[key]
}
