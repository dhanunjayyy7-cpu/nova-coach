import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildReadoutText, isVoiceEnabled, speakText } from '../../utils/voice'
import { getProfile, isProfilePersonalized } from '../../utils/profile'
import { getScanById, setBookmarked, setSaved } from '../../utils/history'
import { SCORE_CAP } from '../../utils/ingredientAnalysis'
import { verdictForScore } from '../../utils/scoreLabels'
import { getReview, productKey, saveReview } from '../../utils/reviews'
import { BackIcon, BookmarkIcon, HeartIcon, ShareIcon, SpeakerIcon } from '../icons'
import Toast from '../Toast'
import StarRow from './result/StarRow'
import ReviewSheet from './result/ReviewSheet'
import ReportIssueSheet from './result/ReportIssueSheet'
import AlternativesSection from './result/AlternativesSection'
import { productEmoji } from './result/productEmoji'
import '../../styles/result.css'

const RISK_LABEL = { safe: 'Safe', caution: 'Caution', avoid: 'Avoid' }

const VERDICT_PILL = {
  safe: { icon: '✓', label: 'Safe to Eat' },
  caution: { icon: '⚠', label: 'Eat in Moderation' },
  avoid: { icon: '✗', label: 'Avoid' },
}

const NUTRIENTS = [
  { key: 'energy-kcal_100g', label: 'Calories', unit: 'kcal', icon: '🔥' },
  { key: 'proteins_100g', label: 'Protein', unit: 'g', icon: '💪' },
  { key: 'fat_100g', label: 'Total Fat', unit: 'g', icon: '🫒' },
  { key: 'sugars_100g', label: 'Sugar', unit: 'g', icon: '🍬' },
  { key: 'salt_100g', label: 'Salt', unit: 'g', icon: '🧂' },
]

function InfoNote({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="info-dot"
        aria-label={`About ${label}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>
      {open && <p className="info-note">{children}</p>}
    </>
  )
}

function scoreTone(score) {
  return verdictForScore(score) // safe → green, caution → yellow, avoid → red
}

function ScanResult({ result, scanId, coach = null, onBack, autoSpeak = true }) {
  const { analysis, productName, brand, nutriments, imageUrl, cleanedText, rawText, barcode, category, type } =
    result
  const record = useMemo(() => (scanId ? getScanById(scanId) : null), [scanId])
  const [saved, setSavedState] = useState(Boolean(record?.saved))
  const [bookmarked, setBookmarkedState] = useState(Boolean(record?.bookmarked))
  const [showSafe, setShowSafe] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [sheet, setSheet] = useState(null) // 'rate' | 'review' | 'report' | null
  const [toast, setToast] = useState('')
  const clearToast = useCallback(() => setToast(''), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  const reviewKey = productKey({ barcode: barcode || record?.barcode, productName })
  const [review, setReview] = useState(() => getReview(reviewKey))

  const flagged = useMemo(
    () =>
      analysis.ingredients
        .filter((i) => i.risk !== 'safe')
        .sort((a, b) => (a.risk === b.risk ? 0 : a.risk === 'avoid' ? -1 : 1)),
    [analysis],
  )
  const safe = analysis.ingredients.filter((i) => i.risk === 'safe')
  const readout = buildReadoutText(analysis.score, flagged)
  const nutrientRows = nutriments ? NUTRIENTS.filter((n) => typeof nutriments[n.key] === 'number') : []
  const isLabelScan = (type ?? record?.type) === 'label'

  const coachDone = coach?.status === 'done'
  const generalScore = coach?.generic ?? analysis.score
  const verdict = coachDone ? coach.scan.verdict : verdictForScore(generalScore)
  const personalized = !coach && isProfilePersonalized(getProfile())

  useEffect(() => {
    if (autoSpeak && isVoiceEnabled()) speakText(readout)
    return () => window.speechSynthesis?.cancel()
  }, [readout, autoSpeak])

  function toggleSaved() {
    const next = !saved
    setSaved(scanId, next)
    setSavedState(next)
    setToast(next ? 'Saved to your shelf' : 'Removed from your shelf')
  }

  function toggleBookmark() {
    const next = !bookmarked
    setBookmarked(scanId, next)
    setBookmarkedState(next)
    setToast(next ? 'Bookmarked' : 'Bookmark removed')
  }

  async function share() {
    const text = `${productName} scored ${generalScore}/${SCORE_CAP} on NOVA — ${VERDICT_PILL[verdict].label}.`
    const url = window.location.origin
    if (navigator.share) {
      try {
        await navigator.share({ title: `${productName} on NOVA`, text, url })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setToast('Copied to clipboard')
    } catch {
      setToast('Couldn’t share right now')
    }
  }

  function submitReview(entry) {
    setReview(saveReview(reviewKey, entry))
    setSheet(null)
    setToast('Thanks for rating!')
  }

  function submitReport(report) {
    console.info('[report-issue]', report)
    setSheet(null)
    setToast('Thanks! We’ll review this.')
  }

  const showImage = imageUrl && !imageFailed

  return (
    <div className="result-screen">
      <div className="result-topbar">
        <button type="button" className="result-back" onClick={onBack}>
          <BackIcon size={22} />
          <span>Details</span>
        </button>
        <div className="result-actions">
          <button type="button" className="icon-button" aria-label="Read the result aloud" onClick={() => speakText(readout)}>
            <SpeakerIcon size={20} />
          </button>
          <button type="button" className="icon-button" aria-label="Share" onClick={share}>
            <ShareIcon size={20} />
          </button>
          {scanId && (
            <>
              <button
                type="button"
                className={`icon-button heart-button ${saved ? 'heart-button-on' : ''}`}
                aria-label={saved ? 'Remove from shelf' : 'Save to shelf'}
                aria-pressed={saved}
                onClick={toggleSaved}
              >
                <HeartIcon size={20} filled={saved} />
              </button>
              <button
                type="button"
                className={`icon-button ${bookmarked ? 'bookmark-on' : ''}`}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                aria-pressed={bookmarked}
                onClick={toggleBookmark}
              >
                <BookmarkIcon filled={bookmarked} size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product hero */}
      <section className="product-hero">
        <div className="product-image">
          {showImage ? (
            <img src={imageUrl} alt={productName} onError={() => setImageFailed(true)} />
          ) : (
            <span aria-hidden="true">{productEmoji(category, productName, isLabelScan ? 'label' : '')}</span>
          )}
        </div>
        {(barcode || record?.barcode) && <p className="product-barcode">{barcode || record.barcode}</p>}
        <h1 className="product-title">{productName}</h1>
        {brand && <p className="product-brand-name">{brand}</p>}
      </section>

      {/* Verdict + rate */}
      <div className="pill-row">
        {coach?.status === 'loading' ? (
          <span className="verdict-pill verdict-pill-loading">Checking for you…</span>
        ) : (
          <span className={`verdict-pill verdict-pill-${verdict}`}>
            {VERDICT_PILL[verdict].icon} {VERDICT_PILL[verdict].label}
          </span>
        )}
        <button type="button" className="rate-pill" onClick={() => setSheet('rate')}>
          ⭐ {review ? `You rated ${review.stars}/5` : 'Rate now'}
        </button>
      </div>

      {coachDone && (
        <p className={`coach-reason coach-reason-${verdict}`}>
          <strong>Nova Coach:</strong> {coach.scan.reason}
          {coach.allergen_override && <span className="coach-allergen">Allergen alert</span>}
        </p>
      )}
      {coach?.status === 'error' && (
        <p className="result-coach-error">Nova Coach is unavailable ({coach.message}) — showing the general result.</p>
      )}
      {personalized && <p className="result-personal-note">Flags are personalised to your profile.</p>}

      {/* Scores */}
      <div className="scores-card">
        <div className="score-row">
          <span className="score-row-label">
            NOVA Score
            <InfoNote label="NOVA Score">
              Starts at {SCORE_CAP} and drops for each additive of concern. No packaged product scores a perfect 100.
            </InfoNote>
          </span>
          <span className={`score-badge score-badge-${scoreTone(generalScore)}`}>
            {generalScore} / {SCORE_CAP}
          </span>
        </div>
        <div className="score-row">
          <span className="score-row-label">Additives Safety</span>
          <span className={flagged.length ? 'score-text-bad' : 'score-text-good'}>
            {flagged.length ? `${flagged.length} flagged` : 'All clear'}
          </span>
        </div>
        {coachDone && (
          <div className="score-row">
            <span className="score-row-label">Your Fit Score</span>
            <span className={`score-badge score-badge-${coach.scan.verdict}`}>{coach.scan.personal_score}</span>
          </div>
        )}
      </div>

      {/* Nutrition */}
      <section className="result-section">
        <h2 className="result-heading">
          Nutrition
          <InfoNote label="Nutrition">Values come from Open Food Facts and are shown per 100 g.</InfoNote>
          {nutrientRows.length > 0 && <span className="result-heading-note">(per 100g)</span>}
        </h2>
        {nutrientRows.length > 0 ? (
          <div className="nutrient-list">
            {nutrientRows.map((n) => (
              <div key={n.key} className="nutrient-row">
                <span className="nutrient-label">
                  <span className="nutrient-icon" aria-hidden="true">
                    {n.icon}
                  </span>
                  {n.label}
                </span>
                <strong>
                  {Math.round(nutriments[n.key] * 10) / 10} {n.unit}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="result-card result-empty">
            {isLabelScan ? 'Nutrition info not available for label scans.' : 'No nutrition data on record for this product.'}
          </div>
        )}
      </section>

      {/* Ingredients */}
      <section className="result-section">
        <h2 className="result-heading">
          Ingredients
          <InfoNote label="Ingredients">
            Listed from most to least by weight. Flagged items are additives of concern or clash with your profile.
          </InfoNote>
        </h2>
        {cleanedText ? (
          <div className="ingredients-card">{cleanedText}</div>
        ) : (
          <div className="result-card result-empty">No ingredient list available.</div>
        )}

        {flagged.length > 0 && (
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
              <span>
                {showSafe ? 'Hide' : 'Show'} safe ingredients ({safe.length})
              </span>
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

        {rawText && rawText !== cleanedText && (
          <details className="result-details">
            <summary>Raw scanned text</summary>
            <pre>{rawText}</pre>
          </details>
        )}
      </section>

      <AlternativesSection
        productName={productName}
        category={category || record?.category || ''}
        flaggedAdditives={flagged.map((f) => f.name)}
        score={generalScore}
        canSuggest={!isLabelScan}
      />

      {/* Ratings & Review */}
      <section className="result-section">
        <h2 className="result-heading">Ratings &amp; Review</h2>
        <div className="review-card">
          {review ? (
            <>
              <div className="review-summary">
                <span className="review-average">{review.stars.toFixed(1)}</span>
                <StarRow value={review.stars} />
                <span className="review-count-label">1 rating · on this phone</span>
              </div>
              {review.text && <p className="review-text">“{review.text}”</p>}
            </>
          ) : (
            <>
              <p className="review-empty">This product hasn’t been reviewed yet. Be the first to rate it.</p>
              <StarRow value={0} size={26} />
            </>
          )}
          <button type="button" className="review-button" onClick={() => setSheet('review')}>
            {review?.text ? 'Edit your review' : 'Write a review'}
          </button>
        </div>
      </section>

      <button type="button" className="report-button" onClick={() => setSheet('report')}>
        ⚠ Report an Issue
      </button>

      <p className="result-disclaimer">Guidance only — not medical advice.</p>

      {(sheet === 'rate' || sheet === 'review') && (
        <ReviewSheet mode={sheet} initial={review} onSubmit={submitReview} onClose={closeSheet} />
      )}
      {sheet === 'report' && <ReportIssueSheet productName={productName} onSubmit={submitReport} onClose={closeSheet} />}

      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}

export default ScanResult
