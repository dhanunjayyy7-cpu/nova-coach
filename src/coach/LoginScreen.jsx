import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { errorMessage, login, signup } from './api'
import { isCoachConfigured } from './session'
import { markOnboarded } from '../utils/onboarding'
import './coach.css'

const DEMO_ACCOUNTS = [
  { label: 'Diabetic demo', email: 'diabetic@nova.app' },
  { label: 'Athlete demo', email: 'athlete@nova.app' },
]

const inputClass =
  'tw:w-full tw:min-h-12 tw:rounded-2xl tw:border tw:border-[#E3E6EC] tw:bg-white tw:px-4 tw:text-base tw:text-[#1A1A2E] tw:outline-none tw:focus:border-[#00C896] tw:focus:ring-4 tw:focus:ring-[#00C896]/20'

function LoginScreen({ mode }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await (isSignup ? signup : login)(email, password)
      markOnboarded()
      navigate('/', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  function continueAsGuest() {
    markOnboarded()
    navigate('/', { replace: true })
  }

  return (
    <div className="tw:mx-auto tw:flex tw:min-h-dvh tw:max-w-[430px] tw:flex-col tw:bg-[#F7F8FA] tw:px-5 tw:pt-14 tw:pb-8 tw:text-[#1A1A2E]">
      <div className="tw:mb-8 tw:flex tw:flex-col tw:items-center tw:text-center">
        <div className="tw:mb-4 tw:grid tw:size-16 tw:place-items-center tw:rounded-[22px] tw:bg-[#00C896] tw:text-3xl tw:font-black tw:text-white tw:shadow-lg tw:shadow-[#00C896]/30">
          N
        </div>
        <h1 className="tw:text-3xl tw:font-extrabold tw:tracking-tight">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="tw:mt-1 tw:text-[#5B6170]">Nova Coach gives every scan a verdict made for you.</p>
      </div>

      {params.get('expired') && (
        <p className="tw:mb-4 tw:rounded-2xl tw:bg-[#FFF4E2] tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-[#B06400]">
          Your session expired. Please log in again.
        </p>
      )}

      {!isCoachConfigured && (
        <p className="tw:mb-4 tw:rounded-2xl tw:bg-[#FFECED] tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-[#C0293A]">
          Nova Coach isn’t connected in this build (VITE_API_URL is missing). You can still continue as a guest.
        </p>
      )}

      <form onSubmit={submit} className="tw:flex tw:flex-col tw:gap-3" noValidate>
        <label className="tw:flex tw:flex-col tw:gap-1.5">
          <span className="tw:text-sm tw:font-bold tw:text-[#5B6170]">Email</span>
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="tw:flex tw:flex-col tw:gap-1.5">
          <span className="tw:text-sm tw:font-bold tw:text-[#5B6170]">Password</span>
          <input
            className={inputClass}
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
          />
        </label>

        {error && (
          <p role="alert" className="tw:text-sm tw:font-semibold tw:text-[#E5394B]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !isCoachConfigured}
          className="tw:mt-2 tw:min-h-14 tw:rounded-full tw:border-0 tw:bg-[#00C896] tw:text-lg tw:font-bold tw:text-white tw:shadow-lg tw:shadow-[#00C896]/30 tw:transition tw:active:scale-[0.98] tw:disabled:opacity-50"
        >
          {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>
      </form>

      <p className="tw:mt-4 tw:text-center tw:text-[#5B6170]">
        {isSignup ? 'Already have an account? ' : 'New to Nova Coach? '}
        <Link
          to={isSignup ? '/login' : '/signup'}
          replace
          className="tw:font-bold tw:text-[#00A77D]"
          onClick={() => setError('')}
        >
          {isSignup ? 'Log in' : 'Create an account'}
        </Link>
      </p>

      {!isSignup && isCoachConfigured && (
        <div className="tw:mt-6 tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
          <p className="tw:mb-3 tw:text-sm tw:font-bold tw:text-[#5B6170]">Try a demo account (password demo1234)</p>
          <div className="tw:flex tw:gap-2">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                className="tw:min-h-11 tw:flex-1 tw:rounded-full tw:border-0 tw:bg-[#E6FAF4] tw:px-3 tw:text-sm tw:font-bold tw:text-[#00875F]"
                onClick={() => {
                  setEmail(demo.email)
                  setPassword('demo1234')
                  setError('')
                }}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={continueAsGuest}
        className="tw:mx-auto tw:mt-auto tw:min-h-12 tw:border-0 tw:bg-transparent tw:px-6 tw:font-semibold tw:text-[#5B6170]"
      >
        Continue as guest
      </button>
    </div>
  )
}

export default LoginScreen
