import { useEffect, useRef, useState } from 'react'
import { toChatProduct } from '../../utils/chatContext'
import LabelScanner from '../scan/LabelScanner'
import BarcodeScanner from '../scan/BarcodeScanner'
import ScanResult from '../scan/ScanResult'
import { saveScan } from '../../utils/history'
import { analyzeIngredients, scoreColor } from '../../utils/ingredientAnalysis'
import { getSession } from '../../coach/session'
import { errorMessage, requestPersonalVerdict } from '../../coach/api'
import '../../styles/scan.css'

const MODES = [
  { key: 'label', label: 'Ingredients' },
  { key: 'barcode', label: 'Barcode' },
]

function ScanTab({ onProductChange }) {
  const [mode, setMode] = useState('label')
  const [result, setResult] = useState(null)
  const [scanId, setScanId] = useState(null)
  const [coach, setCoach] = useState(null) // null for guests
  const requestRef = useRef(0)

  // Lets the chat assistant know which product is on screen.
  useEffect(() => {
    onProductChange?.(result ? toChatProduct(result, coach) : null)
  }, [result, coach, onProductChange])

  useEffect(() => () => onProductChange?.(null), [onProductChange])

  function askCoach(next) {
    // The general score ignores the local profile — personalisation is the server's job here.
    const generic = analyzeIngredients(next.cleanedText, null)
    const requestId = ++requestRef.current
    setCoach({ status: 'loading', generic: generic.score })

    requestPersonalVerdict({
      product_name: next.productName,
      ingredients: next.cleanedText,
      generic_score: generic.score,
      flagged_ingredients: generic.ingredients.filter((i) => i.risk !== 'safe').map((i) => i.name),
    })
      .then((data) => {
        if (requestId === requestRef.current) setCoach({ status: 'done', generic: generic.score, ...data })
      })
      .catch((err) => {
        if (requestId === requestRef.current) {
          setCoach({ status: 'error', generic: generic.score, message: errorMessage(err) })
        }
      })
  }

  function handleResult(next) {
    const record = saveScan({
      type: next.type,
      productName: next.productName,
      brand: next.brand,
      analysis: next.analysis,
      color: scoreColor(next.analysis.score),
      imageUrl: next.imageUrl,
      barcode: next.barcode,
      category: next.category,
      nutriments: next.nutriments,
      cleanedText: next.cleanedText,
    })
    setScanId(record.id)
    setResult(next)
    if (getSession() && next.cleanedText) askCoach(next)
    else setCoach(null)
    window.scrollTo(0, 0)
  }

  function scanAgain() {
    requestRef.current++ // ignore any verdict still in flight
    setResult(null)
    setCoach(null)
  }

  if (result) {
    return <ScanResult result={result} scanId={scanId} coach={coach} onBack={scanAgain} />
  }

  return (
    <div className="scan-screen">
      <header className="scan-header">
        <h1 className="tab-title">Scan</h1>
        <div className="segmented" role="tablist" aria-label="Scan mode">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={mode === m.key}
              className={`segment ${mode === m.key ? 'segment-active' : ''}`}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* key forces a full unmount, so the previous mode's camera is released first */}
      {mode === 'label' ? (
        <LabelScanner key="label" onResult={handleResult} />
      ) : (
        <BarcodeScanner
          key="barcode"
          onResult={handleResult}
          onSwitchToLabel={() => setMode('label')}
        />
      )}
    </div>
  )
}

export default ScanTab
