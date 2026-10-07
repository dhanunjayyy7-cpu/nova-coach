import { useEffect, useState } from 'react'
import { getHistory } from '../../utils/history'
import { getProfile } from '../../utils/profile'
import { getCachedHomeMessage, loadHomeMessage } from '../../utils/homeMessage'
import { getDailyPicks, getTodaysCatch } from '../../data/blogs'
import ScanCard from '../ScanCard'
import BlogCard from '../blogs/BlogCard'
import { ScanIcon, SparkleIcon } from '../icons'
import '../../styles/home.css'
import '../../styles/blogs.css'

const STEPS = [
  { word: 'Point', icon: '📦' },
  { word: 'Scan', icon: '📷' },
  { word: 'Know', icon: '✅' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function FirstTimeHome({ nav }) {
  return (
    <>
      <section className="welcome-card">
        <h2 className="welcome-title">Welcome to NOVA</h2>
        <p className="welcome-text">Scan any packet. Get a clear 0–100 score in seconds.</p>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.word} className="step">
              <span className="step-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="step-word">{s.word}</span>
              {i < STEPS.length - 1 && <span className="step-arrow" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>

        <button type="button" className="primary-button" onClick={() => nav.goTab('scan')}>
          <ScanIcon size={22} />
          <span>Scan your first product</span>
        </button>
      </section>

      <h2 className="section-title">Today’s catch</h2>
      <div className="blog-feed">
        {getDailyPicks(2).map((a) => (
          <BlogCard key={a.id} article={a} onOpen={nav.openBlog} compact />
        ))}
      </div>
    </>
  )
}

function ReturningHome({ nav, history }) {
  const [message, setMessage] = useState(() => getCachedHomeMessage())

  useEffect(() => {
    if (message) return
    let active = true
    loadHomeMessage().then((text) => {
      if (active) setMessage(text)
    })
    return () => {
      active = false
    }
  }, [message])

  return (
    <>
      <section className="greeting-card" aria-live="polite">
        <span className="greeting-icon" aria-hidden="true">
          <SparkleIcon size={18} />
        </span>
        {message ? (
          <p className="greeting-text">{message}</p>
        ) : (
          <div className="greeting-loading" aria-label="Loading your message">
            <span />
            <span />
          </div>
        )}
      </section>

      <div className="section-row">
        <h2 className="section-title">Recent scans</h2>
        <button type="button" className="text-button" onClick={() => nav.goTab('shelf')}>
          See all
        </button>
      </div>
      <div className="card-list">
        {history.slice(0, 3).map((r) => (
          <ScanCard key={r.id} record={r} onOpen={nav.openScan} showDate={false} />
        ))}
      </div>

      <h2 className="section-title">Today’s catch</h2>
      <BlogCard article={getTodaysCatch()} onOpen={nav.openBlog} />
    </>
  )
}

function HomeTab({ nav }) {
  const [history] = useState(getHistory)
  const name = getProfile()?.name?.trim()

  return (
    <div className="tab-screen">
      <header className="tab-header">
        <h1 className="tab-title">NOVA</h1>
        <p className="tab-subtitle">
          {greeting()}
          {name ? `, ${name}` : ''}
        </p>
      </header>

      {history.length === 0 ? (
        <FirstTimeHome nav={nav} />
      ) : (
        <ReturningHome nav={nav} history={history} />
      )}
    </div>
  )
}

export default HomeTab
