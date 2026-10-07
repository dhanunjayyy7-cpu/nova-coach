const ONBOARDED_KEY = 'nova_onboarded'

export function isOnboarded() {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(ONBOARDED_KEY, '1')
  } catch {
    // storage unavailable — onboarding will just show again next launch
  }
}
