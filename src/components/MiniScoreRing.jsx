import { scoreColor } from '../utils/ingredientAnalysis'

function MiniScoreRing({ score, size = 52, stroke = 5, muted = false }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = muted ? '#C5CAD3' : scoreColor(score)
  return (
    <div className="mini-ring" style={{ width: size, height: size }} aria-label={`Score ${score} out of 100`}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF0F4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="mini-ring-number" style={{ fontSize: size * 0.32 }}>
        {score}
      </span>
    </div>
  )
}

export default MiniScoreRing
