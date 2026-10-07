import { useEffect, useState } from 'react'
import { postAi } from '../../../utils/aiRequest'
import { productEmoji } from './productEmoji'

// Covers the server's 7s Gemini attempt plus time for the Vercel Groq fallback.
const BUDGET_MS = 14000
// One request per product per session, even if the screen is reopened.
const cache = new Map()

function AlternativesSection({ productName, category, flaggedAdditives, score, canSuggest }) {
  const cacheKey = `${productName}|${score}`
  const [state, setState] = useState(() => cache.get(cacheKey) ?? { status: canSuggest ? 'loading' : 'skipped' })

  useEffect(() => {
    if (!canSuggest || cache.has(cacheKey)) return
    let active = true
    postAi('alternatives', { productName, category, flaggedAdditives, score }, BUDGET_MS).then((data) => {
      const next = data?.alternatives?.length
        ? { status: 'done', alternatives: data.alternatives }
        : { status: 'failed' }
      if (next.status === 'done') cache.set(cacheKey, next)
      if (active) setState(next)
    })
    return () => {
      active = false
    }
    // flaggedAdditives is derived from the same scan as cacheKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, canSuggest])

  return (
    <section className="result-section">
      <h2 className="result-heading">Better Alternatives</h2>

      {state.status === 'skipped' && (
        <div className="result-card result-empty">Scan the barcode to see healthier alternatives.</div>
      )}

      {state.status === 'loading' && (
        <div className="alt-list" aria-label="Finding alternatives">
          {[0, 1].map((i) => (
            <div key={i} className="alt-card alt-card-loading">
              <span className="alt-icon shimmer" />
              <span className="alt-lines">
                <span className="shimmer-line shimmer" />
                <span className="shimmer-line shimmer-line-short shimmer" />
              </span>
            </div>
          ))}
        </div>
      )}

      {state.status === 'failed' && <div className="result-card result-empty">Alternatives not available.</div>}

      {state.status === 'done' && (
        <>
          <ul className="alt-list">
            {state.alternatives.map((alt) => (
              <li key={`${alt.brand}-${alt.name}`} className="alt-card">
                <span className="alt-icon" aria-hidden="true">
                  {productEmoji(category, alt.name)}
                </span>
                <span className="alt-lines">
                  <span className="alt-name">{alt.name}</span>
                  {alt.brand && <span className="alt-brand">{alt.brand}</span>}
                  <span className="alt-why">{alt.why}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="alt-note">AI suggestions — check the label before you buy.</p>
        </>
      )}
    </section>
  )
}

export default AlternativesSection
