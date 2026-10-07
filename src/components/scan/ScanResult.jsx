import { useEffect, useMemo, useState } from 'react'
import { scoreColor } from '../../utils/ingredientAnalysis'
import { scoreLabel, scorePercentileText } from '../../utils/scoreLabels'
import { buildReadoutText, isVoiceEnabled, speakText } from '../../utils/voice'
import { getProfile, isProfilePersonalized } from '../../utils/profile'
import { getScanById, setSaved } from '../../utils/history'
import { HeartIcon, SpeakerIcon } from '../icons'
import CoachVerdict from '../../coach/CoachVerdict'
import '../../styles/result.css'

const RISK_LABEL = { safe: 'Safe', caution: 'Caution', avoid: 'Avoid' }

const NUTRIENTS = [
  { key: 'energy-kcal_100g', label: 'Calories', unit: 'kcal' },
  { key: 'proteins_100g', label: 'Protein', unit: 'g' },
  { key: 'fat_100g', label: 'Fat', unit: 'g' },
  { key: 'sugars_100g', label: 'Sugar', unit: 'g' },
  { key: 'salt_100g', label: 'Salt', unit: 'g' },
]

function ScoreDial({ score }) {
  const r = 64
  const c = 2 * Math.PI * r
  const color = scoreColor(score)
  return (
    <div className="score-dial">
      <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#EEF0F4" strokeWidth="14" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          transform="rotate(-90 80 80)"
          className="score-dial-arc"
        />
      </svg>
      <div className="score-dial-center">
        <span className="score-dial-number">{score}</span>
        <span className="score-dial-max">/ 100</span>
      </div>
    </div>
  )
}

function ScanResult({ result, scanId, coach = null, onBack, backLabel = 'Scan again', autoSpeak = true }) {
  const { analysis, productName, brand, nutriments, imageUrl, cleanedText, rawText } = result
  const [showSafe, setShowSafe] = useState(false)
  const [saved, setSavedState] = useState(() => Boolean(scanId && getScanById(scanId)?.saved))
  const personalized = isProfilePersonalized(getProfile())

  const flagged = useMemo(
    () =>
      analysis.ingredients
        .filter((i) => i.risk !== 'safe')
        .sort((a, b) => (a.risk === b.risk ? 0 : a.risk === 'avoid' ? -1 : 1)),
    [analysis],
  )
  const safe = analysis.ingredients.filter((i) => i.risk === 'safe')
  const readout = buildReadoutText(analysis.score, flagged)
  const nutrientRows = nutriments ? NUTRIENTS.filter((n) => nutriments[n.key] != null) : []

  useEffect(() => {
    if (autoSpeak && isVoiceEnabled()) speakText(readout)
    return () => window.speechSynthesis?.cancel()
  }, [readout, autoSpeak])

  function toggleSaved() {
    const next = !saved
    setSaved(scanId, next)
    setSavedState(next)
  }

  return (
    <div className="result-screen">
      <div className="result-topbar">
        <button type="button" className="result-back" onClick={onBack}>
          ← {backLabel}
        </button>
        <div className="result-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Read the result aloud"
            onClick={() => speakText(readout)}
          >
            <SpeakerIcon size={20} />
          </button>
          {scanId && (
            <button
              type="button"
              className={`icon-button heart-button ${saved ? 'heart-button-on' : ''}`}
              aria-label={saved ? 'Remove from saved' : 'Save to shelf'}
              aria-pressed={saved}
              onClick={toggleSaved}
            >
              <HeartIcon size={20} filled={saved} />
            </button>
          )}
        </div>
      </div>

      {coach && coach.status !== 'error' ? (
        <CoachVerdict coach={coach} productName={productName} brand={brand} imageUrl={imageUrl} />
      ) : (
        <section className="result-hero">
          {imageUrl && <img className="result-image" src={imageUrl} alt="" />}
          <h1 className="result-name">{productName}</h1>
          {brand && <p className="result-brand">{brand}</p>}

          <ScoreDial score={analysis.score} />

          <p className="result-verdict" style={{ color: scoreColor(analysis.score) }}>
            {scoreLabel(analysis.score)}
          </p>
          <p className="result-percentile">{scorePercentileText(analysis.score)}</p>
          {personalized && <span className="result-badge">Personalized for you</span>}
          {coach?.status === 'error' && (
            <p className="result-coach-error">Nova Coach is unavailable ({coach.message}) — showing the general result.</p>
          )}
        </section>
      )}

      <h2 className="result-heading">
        Flagged ingredients <span>{flagged.length}</span>
      </h2>
      {flagged.length === 0 ? (
        <div className="result-card result-empty">No caution or avoid ingredients found.</div>
      ) : (
        <ul className="flag-list">
          {flagged.map((item, i) => (
            <li key={`${item.name}-${i}`} className={`flag-item flag-${item.risk}`}>
              <div className="flag-top">
                <span className="flag-name">{item.name}</span>
                <span className="flag-pills">
                  {item.personal && <span className="risk-pill risk-pill-personal">For you</span>}
                  <span className={`risk-pill risk-pill-${item.risk}`}>{RISK_LABEL[item.risk]}</span>
                </span>
              </div>
              <p className="flag-reason">{item.reason}</p>
            </li>
          ))}
        </ul>
      )}

      {safe.length > 0 && (
        <>
          <button
            type="button"
            className="result-toggle"
            aria-expanded={showSafe}
            onClick={() => setShowSafe((v) => !v)}
          >
            <span>{showSafe ? 'Hide' : 'Show'} safe ingredients ({safe.length})</span>
            <span className={`chevron ${showSafe ? 'chevron-open' : ''}`}>⌄</span>
          </button>
          {showSafe && (
            <div className="safe-chips">
              {safe.map((item, i) => (
                <span key={`${item.name}-${i}`} className="safe-chip">
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {nutrientRows.length > 0 && (
        <>
          <h2 className="result-heading">
            Nutrition <span className="result-heading-note">per 100 g</span>
          </h2>
          <div className="result-card nutrient-list">
            {nutrientRows.map((n) => (
              <div key={n.key} className="nutrient-row">
                <span>{n.label}</span>
                <strong>
                  {Math.round(nutriments[n.key] * 10) / 10} {n.unit}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}

      {cleanedText && (
        <details className="result-details">
          <summary>Ingredient list we analysed</summary>
          <pre>{cleanedText}</pre>
        </details>
      )}
      {rawText && rawText !== cleanedText && (
        <details className="result-details">
          <summary>Raw scanned text</summary>
          <pre>{rawText}</pre>
        </details>
      )}

      <p className="result-disclaimer">Guidance only — not medical advice.</p>
    </div>
  )
}

export default ScanResult
