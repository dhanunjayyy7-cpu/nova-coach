import { useNavigate } from 'react-router-dom'
import { markOnboarded } from '../../utils/onboarding'

function AuthScreen({ onContinue }) {
  const navigate = useNavigate()

  function goTo(path) {
    // The login screen returns to the app, so onboarding counts as done either way.
    markOnboarded()
    navigate(path)
  }

  return (
    <div className="screen auth">
      <div className="auth-hero">
        <div className="auth-logo">
          <span>N</span>
        </div>
        <h1 className="auth-brand">NOVA</h1>
        <p className="auth-tagline">Know what’s inside, before it’s inside you.</p>
      </div>

      <div className="auth-actions">
        <button type="button" className="auth-button" onClick={() => goTo('/login')}>
          <span>Log in to Nova Coach</span>
        </button>
        <button type="button" className="auth-button" onClick={() => goTo('/signup')}>
          <span>Create an account</span>
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button type="button" className="auth-button" onClick={() => onContinue('guest')}>
          <span>Continue without registration</span>
        </button>
      </div>

      <p className="auth-legal">
        By continuing you agree to our <strong>Terms of Use</strong> and <strong>Privacy Policy</strong>.
      </p>
    </div>
  )
}

export default AuthScreen
