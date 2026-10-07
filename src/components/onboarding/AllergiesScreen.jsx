import { useState } from 'react'
import ChipGrid from './ChipGrid'
import { ALLERGEN_OPTIONS } from '../../constants/profileOptions'

const ALLERGENS = [...ALLERGEN_OPTIONS, { value: 'none', label: 'None', emoji: '✨' }]

function AllergiesScreen({ initial, onNext }) {
  const [selected, setSelected] = useState(() => (initial.length ? initial : []))

  function toggle(value) {
    setSelected((prev) => {
      if (value === 'none') return prev.includes('none') ? [] : ['none']
      const withoutNone = prev.filter((v) => v !== 'none')
      return withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value]
    })
  }

  return (
    <div className="screen setup">
      <div className="setup-topbar">
        <span className="setup-step">Step 1 of 2</span>
        <button type="button" className="text-button" onClick={() => onNext(null)}>
          Skip
        </button>
      </div>

      <h1 className="setup-title">Any allergies?</h1>
      <p className="setup-subtitle">Select all that apply. We’ll flag them on every scan.</p>

      <ChipGrid options={ALLERGENS} selected={selected} onToggle={toggle} />

      <div className="setup-footer">
        <button
          type="button"
          className="primary-button"
          onClick={() => onNext(selected.filter((v) => v !== 'none'))}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default AllergiesScreen
