import MiniScoreRing from './MiniScoreRing'
import { HeartIcon } from './icons'
import { scoreLabel } from '../utils/scoreLabels'

function watchText(record) {
  const n = record.flaggedCount ?? record.topFlagged?.length ?? 0
  if (n === 0) return 'Nothing to watch'
  return `${n} ingredient${n > 1 ? 's' : ''} to watch`
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function ScanCard({ record, onOpen, onToggleSaved, showDate = true }) {
  return (
    <div className="scan-card">
      <button type="button" className="scan-card-main" onClick={() => onOpen(record.id)}>
        <MiniScoreRing score={record.score} />
        <span className="scan-card-text">
          <span className="scan-card-name">{record.productName}</span>
          <span className="scan-card-meta">
            {scoreLabel(record.score)} · {watchText(record)}
          </span>
          {showDate && <span className="scan-card-date">{formatDate(record.timestamp)}</span>}
        </span>
      </button>
      {onToggleSaved && (
        <button
          type="button"
          className={`heart-button ${record.saved ? 'heart-button-on' : ''}`}
          aria-label={record.saved ? `Remove ${record.productName} from saved` : `Save ${record.productName}`}
          aria-pressed={!!record.saved}
          onClick={() => onToggleSaved(record)}
        >
          <HeartIcon size={22} filled={record.saved} />
        </button>
      )}
    </div>
  )
}

export default ScanCard
