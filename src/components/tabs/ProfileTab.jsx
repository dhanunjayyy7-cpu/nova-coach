import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emptyProfile, getProfile, updateProfile } from '../../utils/profile'
import { clearHistory, getHistory, getScanCount } from '../../utils/history'
import { isVoiceEnabled, setVoiceEnabled } from '../../utils/voice'
import { clearSession, getSession } from '../../coach/session'
import {
  ALLERGEN_OPTIONS,
  DIET_OPTIONS,
  GOAL_OPTIONS,
  labelsFor,
} from '../../constants/profileOptions'
import ChipGrid from '../onboarding/ChipGrid'
import BottomSheet from '../BottomSheet'
import Toast from '../Toast'
import AboutScreen from '../profile/AboutScreen'
import { ChevronRightIcon, LockIcon } from '../icons'
import '../../styles/profile.css'

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
      className="name-button"
      onClick={() => {
        setDraft(value)
        setEditing(true)
      }}
    >
      <span className={value ? 'profile-name' : 'profile-name profile-name-empty'}>
        {value || 'Add your name'}
      </span>
      <span className="name-edit">Edit</span>
    </button>
  )
}

function Row({ label, value, onClick, danger, disabled, trailing, checked }) {
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
      <span className="settings-row-text">
        <span className="settings-row-label">{label}</span>
        {value && <span className="settings-row-value">{value}</span>}
      </span>
      {trailing ?? <ChevronRightIcon size={20} />}
    </button>
  )
}

function ProfileTab() {
  const [profile, setProfile] = useState(() => getProfile() ?? emptyProfile())
  const [scanCount, setScanCount] = useState(getScanCount)
  const [history, setHistory] = useState(getHistory)
  const [voiceOn, setVoiceOn] = useState(isVoiceEnabled)
  const navigate = useNavigate()
  const [session, setSessionState] = useState(getSession)
  const [editing, setEditing] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [view, setView] = useState('main')
  const [toast, setToast] = useState('')
  const clearToast = useCallback(() => setToast(''), [])
  const closeEdit = useCallback(() => setEditing(null), [])
  const closeConfirm = useCallback(() => setConfirmClear(false), [])

  if (view === 'about') return <AboutScreen onBack={() => setView('main')} />

  const savedCount = history.filter((r) => r.saved).length

  function save(patch) {
    setProfile(updateProfile(patch))
  }

  function summary(field) {
    const labels = labelsFor(FIELDS[field].options, profile[field])
    return labels.length ? labels.join(', ') : 'Not set'
  }

  function toggleVoice() {
    setVoiceEnabled(!voiceOn)
    setVoiceOn(!voiceOn)
  }

  function toggleAuth() {
    if (!session) {
      navigate('/login')
      return
    }
    clearSession()
    setSessionState(null)
    setToast('Logged out — scans now use the general score only')
  }

  return (
    <div className="tab-screen profile-screen">
      <section className="profile-head">
        <div className="profile-avatar" aria-hidden="true">
          {profile.name ? profile.name.trim().charAt(0).toUpperCase() : '🙂'}
        </div>
        <NameField value={profile.name} onSave={(name) => save({ name })} />
        <p className="profile-privacy">
          <LockIcon size={14} /> Your data stays on this phone.
        </p>
        <p className="profile-stats">
          <strong>{scanCount}</strong> product{scanCount === 1 ? '' : 's'} scanned · <strong>{savedCount}</strong>{' '}
          saved
        </p>
      </section>

      <h2 className="section-title">Your food profile</h2>
      <div className="settings-card">
        <Row label="Diet" value={summary('diet')} onClick={() => setEditing('diet')} />
        <Row label="Allergies" value={summary('allergens')} onClick={() => setEditing('allergens')} />
        <Row label="Goals" value={summary('goals')} onClick={() => setEditing('goals')} />
      </div>

      <h2 className="section-title">Settings</h2>
      <div className="settings-card">
        <Row
          label="Voice readout"
          value="Reads each score aloud after a scan"
          onClick={toggleVoice}
          checked={voiceOn}
          trailing={
            <span className={`switch ${voiceOn ? 'switch-on' : ''}`} aria-hidden="true">
              <span />
            </span>
          }
        />
        <Row
          label="Clear scan history"
          value={history.length ? `${history.length} on this phone` : 'Nothing to clear'}
          onClick={() => setConfirmClear(true)}
          disabled={history.length === 0}
          danger
        />
        <Row
          label={session ? 'Log out of Nova Coach' : 'Log in to Nova Coach'}
          value={session ? session.email : 'Get a personal verdict on every scan'}
          onClick={toggleAuth}
        />
        <Row label="About NOVA & Privacy" onClick={() => setView('about')} />
      </div>

      <p className="profile-version">NOVA · version 0.1</p>

      {editing && (
        <EditSheet
          field={editing}
          initial={profile[editing]}
          onClose={closeEdit}
          onSave={(values) => {
            save({ [editing]: values })
            setEditing(null)
            setToast('Saved — new scans will use this')
          }}
        />
      )}

      {confirmClear && (
        <ConfirmClear
          count={history.length}
          onClose={closeConfirm}
          onConfirm={() => {
            clearHistory()
            setHistory([])
            setScanCount(0)
            setConfirmClear(false)
            setToast('Scan history cleared')
          }}
        />
      )}

      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}

export default ProfileTab
