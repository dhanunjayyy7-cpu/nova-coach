// Article likes and bookmarks, stored only on this device.
const KEY = 'nova_blog_prefs'

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { liked: raw.liked ?? [], bookmarked: raw.bookmarked ?? [] }
  } catch {
    return { liked: [], bookmarked: [] }
  }
}

export function isBlogFlagged(list, id) {
  return read()[list].includes(id)
}

// list: 'liked' | 'bookmarked'. Returns the new on/off state.
export function toggleBlogFlag(list, id) {
  const prefs = read()
  const on = !prefs[list].includes(id)
  prefs[list] = on ? [...prefs[list], id] : prefs[list].filter((x) => x !== id)
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
  return on
}
