import { useState } from 'react'
import { emptyProfile, getProfile, updateProfile } from '../../utils/profile'
import IntroSlides from './IntroSlides'
import AllergiesScreen from './AllergiesScreen'
import DietScreen from './DietScreen'
import AuthScreen from './AuthScreen'

function OnboardingFlow({ onFinish }) {
  const [step, setStep] = useState('intro') // intro | allergies | diet | auth
  const profile = getProfile() ?? emptyProfile()

  return (
    <div className="onboarding" key={step}>
      {step === 'intro' && <IntroSlides onDone={() => setStep('allergies')} />}

      {step === 'allergies' && (
        <AllergiesScreen
          initial={profile.allergens}
          onNext={(allergens) => {
            // null = skipped; still create the profile so the app treats setup as done
            updateProfile(allergens ? { allergens } : {})
            setStep('diet')
          }}
        />
      )}

      {step === 'diet' && (
        <DietScreen
          initial={profile.diet}
          onBack={() => setStep('allergies')}
          onNext={(diet) => {
            updateProfile(diet ? { diet } : {})
            setStep('auth')
          }}
        />
      )}

      {step === 'auth' && <AuthScreen onContinue={onFinish} />}
    </div>
  )
}

export default OnboardingFlow
