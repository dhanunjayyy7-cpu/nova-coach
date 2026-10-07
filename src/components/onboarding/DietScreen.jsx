import { useState } from 'react'
import ChipGrid from './ChipGrid'
import { DIET_OPTIONS as DIETS } from '../../constants/profileOptions'

function DietScreen({ initial, onNext, onBack }) {
  const [diet, setDiet] = useState(initial[0] ?? null)

  return (
    <div className="screen setup">
      <div className="setup-topbar">
        <button type="button" className="text-button text-button-muted" onClick={onBack}>
          ← Back
        </button>
        <span className="setup-step">Step 2 of 2</span>
        <button type="button" className="text-button" onClick={() => onNext(null)}>
          Skip
        </button>
      </div>

      <h1 className="setup-title">Your diet</h1>
      <p className="setup-subtitle">Pick the one that fits you best.</p>

      <ChipGrid
        options={DIETS}
        selected={diet ? [diet] : []}
        onToggle={(value) => setDiet((prev) => (prev === value ? null : value))}
      />

      <div className="setup-footer">
        <button type="button" className="primary-button" onClick={() => onNext(diet ? [diet] : [])}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default DietScreen
