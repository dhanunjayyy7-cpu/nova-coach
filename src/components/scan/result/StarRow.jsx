function Star({ filled, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3.2 2.6 5.5 6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.1 6-.8L12 3.2Z"
        fill={filled ? '#FFB020' : 'none'}
        stroke={filled ? '#FFB020' : '#C5CAD3'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Read-only when `onChange` is omitted; otherwise each star is a 44px tap target.
function StarRow({ value = 0, onChange, size = 22 }) {
  if (!onChange) {
    return (
      <span className="star-row" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= Math.round(value)} size={size} />
        ))}
      </span>
    )
  }

  return (
    <div className="star-row star-row-input" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="star-button"
          onClick={() => onChange(n)}
        >
          <Star filled={n <= value} size={size} />
        </button>
      ))}
    </div>
  )
}

export default StarRow
