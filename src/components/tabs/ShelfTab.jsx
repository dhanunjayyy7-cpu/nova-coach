import { useState } from 'react'
import { getHistory, setSaved } from '../../utils/history'
import { scoreLabel } from '../../utils/scoreLabels'
import ScanCard from '../ScanCard'
import MiniScoreRing from '../MiniScoreRing'
import { HeartIcon, SearchIcon, ShelfIcon } from '../icons'
import '../../styles/shelf.css'

const SEGMENTS = [
  { key: 'saved', label: 'Saved' },
  { key: 'all', label: 'All scans' },
]

function ExampleCard() {
  return (
    <div className="scan-card scan-card-example" aria-label="Example of a saved product, not real data">
      <span className="example-label">Example</span>
      <div className="scan-card-main">
        <MiniScoreRing score={72} muted />
        <span className="scan-card-text">
          <span className="scan-card-name">Oat cookies</span>
          <span className="scan-card-meta">Good · 1 ingredient to watch</span>
        </span>
      </div>
      <span className="heart-button" aria-hidden="true">
        <HeartIcon size={22} filled />
      </span>
    </div>
  )
}

function ShelfTab({ nav }) {
  const [history, setHistory] = useState(getHistory)
  const [segment, setSegment] = useState(() => (getHistory().some((r) => r.saved) ? 'saved' : 'all'))
  const [query, setQuery] = useState('')

  function toggleSaved(record) {
    setSaved(record.id, !record.saved)
    setHistory(getHistory())
  }

  const header = (
    <header className="tab-header">
      <h1 className="tab-title">Shelf</h1>
    </header>
  )

  if (history.length === 0) {
    return (
      <div className="tab-screen">
        {header}
        <div className="shelf-empty">
          <div className="empty-icon">
            <ShelfIcon size={32} />
          </div>
          <h2 className="empty-title">Your shelf is empty</h2>
          <p className="empty-text">Scan or save a product to keep it here.</p>
          <ExampleCard />
          <button type="button" className="primary-button" onClick={() => nav.goTab('scan')}>
            Scan now
          </button>
        </div>
      </div>
    )
  }

  const saved = history.filter((r) => r.saved)
  const source = segment === 'saved' ? saved : history
  const q = query.trim().toLowerCase()
  const visible = q ? source.filter((r) => r.productName.toLowerCase().includes(q)) : source
  const shelfHealth = saved.length
    ? Math.round(saved.reduce((sum, r) => sum + r.score, 0) / saved.length)
    : null

  return (
    <div className="tab-screen">
      {header}

      <div className="segmented" role="tablist" aria-label="Shelf view">
        {SEGMENTS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={segment === s.key}
            className={`segment ${segment === s.key ? 'segment-active' : ''}`}
            onClick={() => setSegment(s.key)}
          >
            {s.label}
            <span className="segment-count">{s.key === 'saved' ? saved.length : history.length}</span>
          </button>
        ))}
      </div>

      <label className="search-bar">
        <SearchIcon size={20} />
        <input
          type="search"
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products by name"
        />
      </label>

      {segment === 'saved' && shelfHealth !== null && !q && (
        <section className="shelf-health">
          <MiniScoreRing score={shelfHealth} size={64} stroke={6} />
          <div>
            <p className="shelf-health-title">Shelf health · {scoreLabel(shelfHealth)}</p>
            <p className="shelf-health-text">
              Average score of your {saved.length} saved product{saved.length > 1 ? 's' : ''}
            </p>
          </div>
        </section>
      )}

      {visible.length === 0 ? (
        <p className="shelf-none">
          {q
            ? `No products match “${query.trim()}”.`
            : 'Nothing saved yet. Tap the heart on any scan to keep it here.'}
        </p>
      ) : (
        <div className="card-list">
          {visible.map((r) => (
            <ScanCard key={r.id} record={r} onOpen={nav.openScan} onToggleSaved={toggleSaved} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShelfTab
