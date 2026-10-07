import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emptyProfile, getProfile, updateProfile } from '../../utils/profile'
import { clearHistory, getHistory, getScanCount } from '../../utils/history'
import { isVoiceEnabled, setVoiceEnabled } from '../../utils/voice'
import { getReviewCount } from '../../utils/reviews'
import { clearSession, getSession } from '../../coach/session'
import { ALLERGEN_OPTIONS, DIET_OPTIONS, GOAL_OPTIONS, labelsFor } from '../../constants/profileOptions'
import ChipGrid from '../onboarding/ChipGrid'
import BottomSheet from '../BottomSheet'
import Toast from '../Toast'
import AboutScreen from '../profile/AboutScreen'
import { FAQS, PREMIUM_TERMS, PRIVACY_POLICY, TERMS_OF_USE } from '../profile/infoContent'
import { ChevronRightIcon, ScanIcon } from '../icons'
import '../../styles/profile.css'

const NOTIFICATIONS_KEY = 'nova_notifications'

const FIELDS = {
  diet: {
    title: 'Diet',
    hint: 'Pick the one that fits you best.',
    options: DIET_OPTIONS,
    single: true,
  },
  allergens: {
    title: 'Allergies',
    hint: 'Select everything you’re allergic to.',
    options: ALLERGEN_OPTIONS,
  },
  goals: {
    title: 'Goals',
    hint: 'What would you like to eat more or less of?',
    options: GOAL_OPTIONS,
  },
}

const TEXT_SHEETS = {
  privacy: { title: 'Privacy Policy', paragraphs: PRIVACY_POLICY },
  premium: { title: 'Premium Terms', paragraphs: PREMIUM_TERMS },
  terms: { title: 'Terms of Use', paragraphs: TERMS_OF_USE },
}

function readFlag(key) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key, on) {
  try {
    localStorage.setItem(key, on ? '1' : '0')
  } catch {
    // ignore
  }
}

function EditSheet({ field, initial, onSave, onClose }) {
  const config = FIELDS[field]
  const [selected, setSelected] = useState(initial)

  function toggle(value) {
    setSelected((prev) => {
      if (config.single) return prev.includes(value) ? [] : [value]
      return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    })
  }

  return (
    <BottomSheet
      title={config.title}
      onClose={onClose}
      footer={
        <button type="button" className="primary-button" onClick={() => onSave(selected)}>
          Save
        </button>
      }
    >
      <p className="sheet-hint">{config.hint}</p>
      <ChipGrid options={config.options} selected={selected} onToggle={toggle} />
    </BottomSheet>
  )
}

function ConfirmClear({ count, onConfirm, onClose }) {
  return (
    <BottomSheet title="Clear scan history?" onClose={onClose}>
      <p className="sheet-hint">
        This permanently removes {count} scan{count === 1 ? '' : 's'} — including saved products — from this
        phone. It can’t be undone.
      </p>
      <div className="confirm-actions">
        <button type="button" className="danger-button" onClick={onConfirm}>
          Clear history
        </button>
        <button type="button" className="secondary-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </BottomSheet>
  )
}

function FeedbackSheet({ onSubmit, onClose }) {
  const [text, setText] = useState('')
  return (
    <BottomSheet
      title="Feedback"
      onClose={onClose}
      footer={
        <button type="button" className="primary-button" disabled={!text.trim()} onClick={() => onSubmit(text.trim())}>
          Send feedback
        </button>
      }
    >
      <p className="sheet-hint">Tell us what you like, or what we could do better.</p>
      <textarea
        className="settings-textarea"
        rows={5}
        maxLength={500}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your feedback"
        aria-label="Your feedback"
      />
    </BottomSheet>
  )
}

function NameField({ value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function commit() {
    onSave(draft.trim())
    setEditing(false)
  }

  if (editing) {
    return (
      <form
        className="name-form"
        onSubmit={(e) => {
          e.preventDefault()
          commit()
        }}
      >
        <input
          className="name-input"
          autoFocus
          maxLength={40}
          placeholder="Your name"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          aria-label="Your name"
        />
      </form>
    )
  }

  return (
    <button
      type="button"
      className="name-edit-link"
      onClick={() => {
        setDraft(value)
        setEditing(true)
      }}
    >
      {value ? 'Edit name' : 'Add your name'}
    </button>
  )
}

function SettingsRow({ icon, label, value, onClick, danger, disabled, trailing, checked }) {
  const isSwitch = checked !== undefined
  return (
    <button
      type="button"
      className={`settings-row ${danger ? 'settings-row-danger' : ''}`}
      onClick={onClick}
      disabled={disabled}
      role={isSwitch ? 'switch' : undefined}
      aria-checked={isSwitch ? checked : undefined}
    >
      <span className="settings-row-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="settings-row-label">{label}</span>
      {value && <span className="settings-row-value">{value}</span>}
      {trailing ?? <ChevronRightIcon size={20} />}
    </button>
  )
}

function Switch({ on }) {
  return (
    <span className={`switch ${on ? 'switch-on' : ''}`} aria-hidden="true">
      <span />
    </span>
  )
}

function ProfileTab() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => getProfile() ?? emptyProfile())
  const [scanCount, setScanCount] = useState(getScanCount)
  const [historyCount, setHistoryCount] = useState(() => getHistory().length)
  const [contributions] = useState(getReviewCount)
  const [voiceOn, setVoiceOn] = useState(isVoiceEnabled)
  const [notificationsOn, setNotificationsOn] = useState(() => readFlag(NOTIFICATIONS_KEY))
  const [session, setSessionState] = useState(getSession)
  const [sheet, setSheet] = useState(null) // preferences | diet | allergens | goals | faq | feedback | clear | privacy | premium | terms
  const [view, setView] = useState('main')
  const [toast, setToast] = useState('')
  const clearToast = useCallback(() => setToast(''), [])
  const closeSheet = useCallback(() => setSheet(null), [])

  if (view === 'about') return <AboutScreen onBack={() => setView('main')} />

  function save(patch) {
    setProfile(updateProfile(patch))
  }

  function summary(field) {
    const labels = labelsFor(FIELDS[field].options, profile[field])
    return labels.length ? labels.join(', ') : 'Not set'
  }

  async function shareApp() {
    const url = window.location.origin
    const text = 'NOVA scans food labels and gives every packet a clear health score.'
    if (navigator.share) {
      try {
        await navigator.share({ title: 'NOVA', text, url })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setToast(`Link copied: ${url}`)
    } catch {
      setToast(`Share this link: ${url}`)
    }
  }

  function logOut() {
    clearSession()
    setSessionState(null)
    setToast('Logged out — scans now use the general score only')
  }

  const displayName = profile.name?.trim() || (session ? session.email.split('@')[0] : '')
  const initial = displayName ? displayName.charAt(0).toUpperCase() : ''

  return (
    <div className="tab-screen profile-screen">
      {/* User card */}
      <section className="user-card">
        <div className={`profile-avatar ${initial ? '' : 'profile-avatar-guest'}`} aria-hidden="true">
          {initial || (
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M20 4c9 0 15 6 15 15s-5 17-15 17S5 28 5 19 11 4 20 4Z" fill="#fff" opacity="0.95" />
              <circle cx="15" cy="18" r="2.2" fill="#1A1A2E" />
              <circle cx="25" cy="18" r="2.2" fill="#1A1A2E" />
              <path d="M15 25c3 2.5 7 2.5 10 0" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {session ? (
          <>
            <h1 className="user-name">{displayName}</h1>
            <p className="user-email">{session.email}</p>
            <NameField value={profile.name} onSave={(name) => save({ name })} />
            <button type="button" className="user-logout" onClick={logOut}>
              Log out
            </button>
          </>
        ) : (
          <>
            <h1 className="user-name">{profile.name?.trim() || 'Guest User'}</h1>
            <p className="user-email">
              You’re using NOVA as a guest. Log in to Nova Coach for a personal verdict on every scan.
            </p>
            <NameField value={profile.name} onSave={(name) => save({ name })} />
            <button type="button" className="user-login" onClick={() => navigate('/login')}>
              Log In
            </button>
          </>
        )}
      </section>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            <ScanIcon size={24} />
          </span>
          <span className="stat-value">{scanCount}</span>
          <span className="stat-label">Total Scan Count</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            🏆
          </span>
          <span className="stat-value">{contributions}</span>
          <span className="stat-label">Your Contribution</span>
        </div>
      </div>

      <h2 className="settings-section-label">General</h2>
      <div className="settings-card">
        <SettingsRow icon="ℹ️" label="About Us" onClick={() => setView('about')} />
        <SettingsRow icon="⚙️" label="Preferences" onClick={() => setSheet('preferences')} />
        <SettingsRow
          icon="🔔"
          label="Notifications"
          checked={notificationsOn}
          onClick={() => {
            writeFlag(NOTIFICATIONS_KEY, !notificationsOn)
            setNotificationsOn(!notificationsOn)
          }}
          trailing={<Switch on={notificationsOn} />}
        />
        <SettingsRow
          icon="🔊"
          label="Voice readout"
          checked={voiceOn}
          onClick={() => {
            setVoiceEnabled(!voiceOn)
            setVoiceOn(!voiceOn)
          }}
          trailing={<Switch on={voiceOn} />}
        />
        <SettingsRow icon="🌐" label="Language" value="Eng (IN)" onClick={() => setToast('More languages coming soon')} />
        <SettingsRow icon="❓" label="FAQs" onClick={() => setSheet('faq')} />
        <SettingsRow
          icon="🗑️"
          label="Clear scan history"
          value={historyCount ? String(historyCount) : ''}
          onClick={() => setSheet('clear')}
          disabled={historyCount === 0}
          danger
        />
      </div>

      <h2 className="settings-section-label">Reviews and Sharing</h2>
      <div className="settings-card">
        <SettingsRow icon="💡" label="Request a Feature" onClick={() => setToast('Coming soon')} />
        <SettingsRow icon="💬" label="Feedback" onClick={() => setSheet('feedback')} />
        <SettingsRow icon="⭐" label="Rate Us" onClick={() => setToast('Coming soon')} />
        <SettingsRow icon="🔗" label="Share App" onClick={shareApp} />
      </div>

      <h2 className="settings-section-label">Legal</h2>
      <div className="settings-card">
        <SettingsRow icon="🔒" label="Privacy Policy" onClick={() => setSheet('privacy')} />
        <SettingsRow icon="👑" label="Premium Terms" onClick={() => setSheet('premium')} />
        <SettingsRow icon="📄" label="Terms of Use" onClick={() => setSheet('terms')} />
      </div>

      <footer className="profile-footer">
        <span className="profile-footer-logo">N</span>
        <p>Follow us on</p>
        <p className="profile-footer-handle">@nova.official</p>
        <p className="profile-footer-version">App version 1.0.0</p>
      </footer>

      {sheet === 'preferences' && (
        <BottomSheet title="Preferences" onClose={closeSheet}>
          <p className="sheet-hint">These personalise the flags on every scan.</p>
          <div className="settings-card settings-card-flat">
            {['diet', 'allergens', 'goals'].map((field) => (
              <SettingsRow
                key={field}
                icon={field === 'diet' ? '🥦' : field === 'allergens' ? '🥜' : '🎯'}
                label={FIELDS[field].title}
                value={summary(field)}
                onClick={() => setSheet(field)}
              />
            ))}
          </div>
        </BottomSheet>
      )}

      {FIELDS[sheet] && (
        <EditSheet
          field={sheet}
          initial={profile[sheet]}
          onClose={() => setSheet('preferences')}
          onSave={(values) => {
            save({ [sheet]: values })
            setSheet('preferences')
            setToast('Saved — new scans will use this')
          }}
        />
      )}

      {sheet === 'faq' && (
        <BottomSheet title="FAQs" onClose={closeSheet}>
          <dl className="faq-list">
            {FAQS.map((item) => (
              <div key={item.q} className="faq-item">
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </BottomSheet>
      )}

      {sheet === 'feedback' && (
        <FeedbackSheet
          onClose={closeSheet}
          onSubmit={(text) => {
            console.info('[feedback]', text)
            setSheet(null)
            setToast('Thank you for your feedback!')
          }}
        />
      )}

      {TEXT_SHEETS[sheet] && (
        <BottomSheet title={TEXT_SHEETS[sheet].title} onClose={closeSheet}>
          <div className="legal-text">
            {TEXT_SHEETS[sheet].paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </BottomSheet>
      )}

      {sheet === 'clear' && (
        <ConfirmClear
          count={historyCount}
          onClose={closeSheet}
          onConfirm={() => {
            clearHistory()
            setHistoryCount(0)
            setScanCount(0)
            setSheet(null)
            setToast('Scan history cleared')
          }}
        />
      )}

      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}

export default ProfileTab
