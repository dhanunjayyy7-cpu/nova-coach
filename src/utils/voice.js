const VOICE_KEY = 'nova_voice_enabled'

export function isVoiceEnabled() {
  try {
    return localStorage.getItem(VOICE_KEY) !== '0'
  } catch {
    return true
  }
}

export function setVoiceEnabled(enabled) {
  try {
    localStorage.setItem(VOICE_KEY, enabled ? '1' : '0')
  } catch {
    // ignore
  }
  if (!enabled) window.speechSynthesis?.cancel()
}

function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'en-IN') ||
    voices.find((v) => v.name.toLowerCase().includes('india')) ||
    voices.find((v) => v.lang?.startsWith('en')) ||
    voices[0] ||
    null
  )
}

export function buildReadoutText(score, flaggedIngredients) {
  const n = flaggedIngredients.length
  let text = `This product scored ${score} out of 100.`
  if (n > 0) {
    const topNames = flaggedIngredients.slice(0, 3).map((item) => item.name).join(', ')
    text += ` ${n} harmful ingredient${n > 1 ? 's' : ''} detected: ${topNames}.`
  } else {
    text += ' No harmful ingredients detected.'
  }
  return text
}

export function speakText(text) {
  if (!('speechSynthesis' in window) || !text) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else {
    utterance.lang = 'en-IN'
  }
  utterance.rate = 1
  window.speechSynthesis.speak(utterance)
}
