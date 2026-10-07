import { useRef, useState } from 'react'

const SLIDES = [
  {
    title: 'Scan any packet',
    text: 'Works with or without a barcode — just point at the ingredient list.',
    art: <ScanArt />,
  },
  {
    title: 'Get a clear score',
    text: 'A 0–100 health score, explained in plain words.',
    art: <ScoreArt />,
  },
  {
    title: 'Made for you',
    text: 'Every product is checked against your allergies and diet.',
    art: <PersonalArt />,
  },
]

function IntroSlides({ onDone }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const isLast = index === SLIDES.length - 1

  function goTo(i) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    const next = Math.round(track.scrollLeft / track.clientWidth)
    if (next !== index) setIndex(next)
  }

  return (
    <div className="screen intro">
      <div className="intro-topbar">
        <button type="button" className="text-button" onClick={onDone}>
          Skip
        </button>
      </div>

      <div className="intro-track" ref={trackRef} onScroll={handleScroll}>
        {SLIDES.map((slide) => (
          <section className="intro-slide" key={slide.title}>
            <div className="intro-art">{slide.art}</div>
            <h1 className="intro-title">{slide.title}</h1>
            <p className="intro-text">{slide.text}</p>
          </section>
        ))}
      </div>

      <div className="intro-footer">
        <div className="dots" role="tablist" aria-label="Intro slides">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              className={`dot ${i === index ? 'dot-active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => (isLast ? onDone() : goTo(index + 1))}
        >
          {isLast ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  )
}

function ScanArt() {
  return (
    <svg viewBox="0 0 240 220" className="intro-svg" aria-hidden="true">
      <circle cx="120" cy="110" r="96" fill="#E6FAF4" />
      <rect x="78" y="40" width="84" height="140" rx="16" fill="#fff" stroke="#1A1A2E" strokeWidth="3" />
      <rect x="92" y="62" width="56" height="8" rx="4" fill="#D9DEE7" />
      <rect x="92" y="78" width="40" height="8" rx="4" fill="#D9DEE7" />
      <rect x="92" y="94" width="50" height="8" rx="4" fill="#D9DEE7" />
      <g stroke="#1A1A2E" strokeWidth="3">
        <path d="M96 128v32M104 128v32M110 128v32M118 128v32M124 128v32M132 128v32M138 128v32M144 128v32" />
      </g>
      <rect x="56" y="104" width="128" height="4" rx="2" fill="#00C896" />
      <path d="M54 54V40h14M186 54V40h-14M54 166v14h14M186 166v14h-14" fill="none" stroke="#00C896" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function ScoreArt() {
  const r = 70
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 240 220" className="intro-svg" aria-hidden="true">
      <circle cx="120" cy="110" r="96" fill="#E6FAF4" />
      <circle cx="120" cy="110" r={r} fill="#fff" stroke="#EEF0F4" strokeWidth="14" />
      <circle
        cx="120"
        cy="110"
        r={r}
        fill="none"
        stroke="#00C896"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${c * 0.82} ${c}`}
        transform="rotate(-90 120 110)"
      />
      <text x="120" y="120" textAnchor="middle" fontSize="44" fontWeight="800" fill="#1A1A2E">
        82
      </text>
      <text x="120" y="142" textAnchor="middle" fontSize="12" fontWeight="600" fill="#9CA3AF">
        EXCELLENT
      </text>
    </svg>
  )
}

function PersonalArt() {
  return (
    <svg viewBox="0 0 240 220" className="intro-svg" aria-hidden="true">
      <circle cx="120" cy="110" r="96" fill="#E6FAF4" />
      <circle cx="120" cy="84" r="24" fill="#fff" stroke="#1A1A2E" strokeWidth="3" />
      <path d="M78 156c6-24 22-36 42-36s36 12 42 36" fill="#fff" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" />
      <g>
        <rect x="30" y="44" width="62" height="26" rx="13" fill="#fff" />
        <text x="61" y="62" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A1A2E">Vegan</text>
        <rect x="150" y="60" width="66" height="26" rx="13" fill="#00C896" />
        <text x="183" y="78" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">No nuts</text>
        <rect x="140" y="160" width="74" height="26" rx="13" fill="#fff" />
        <text x="177" y="178" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A1A2E">Low sugar</text>
      </g>
    </svg>
  )
}

export default IntroSlides
