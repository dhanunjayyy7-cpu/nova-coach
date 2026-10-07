import { CheckIcon } from '../icons'

function ChipGrid({ options, selected, onToggle }) {
  return (
    <div className="chip-grid">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isSelected}
            className={`chip ${isSelected ? 'chip-selected' : ''}`}
            onClick={() => onToggle(opt.value)}
          >
            <span className="chip-emoji" aria-hidden="true">
              {opt.emoji}
            </span>
            <span className="chip-label">{opt.label}</span>
            <span className="chip-check" aria-hidden="true">
              {isSelected && <CheckIcon size={14} />}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ChipGrid
