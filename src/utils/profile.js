const PROFILE_KEY = 'labelwise_profile'

const EMPTY_PROFILE = {
  name: '',
  age: '',
  diet: [], // single value stored as array: 'vegetarian' | 'vegan' | 'eggetarian' | 'jain' | 'halal' | 'non-vegetarian'
  allergens: [], // 'milk' | 'peanuts' | 'nuts' | 'wheat' | 'soy' | 'egg' | 'fish' | 'shellfish' | 'gluten' | 'lactose' | 'sesame'
  goals: [], // 'less-sugar' | 'less-salt' | 'less-fat' | 'more-protein' | 'more-fibre' | 'avoid-additives'
  // Legacy fields from the old wizard — kept so existing data isn't lost, no longer collected.
  healthConditions: [],
  otherHealthCondition: '',
}

export function emptyProfile() {
  return { ...EMPTY_PROFILE, diet: [], allergens: [], goals: [], healthConditions: [] }
}

// Older builds collected medical conditions; map the ones that had scoring
// effects onto the equivalent goal so those users keep their flags.
function goalsFromLegacyConditions(conditions) {
  const goals = []
  if (conditions.includes('diabetes') || conditions.includes('pre-diabetes')) goals.push('less-sugar')
  if (conditions.includes('highBP')) goals.push('less-salt')
  return goals
}

function normalizeProfile(raw) {
  const healthConditions = Array.isArray(raw.healthConditions) ? raw.healthConditions : []
  return {
    ...EMPTY_PROFILE,
    ...raw,
    // Backward-compat: an older build stored `diet` as a single string.
    diet: Array.isArray(raw.diet) ? raw.diet : raw.diet ? [raw.diet] : [],
    allergens: Array.isArray(raw.allergens) ? raw.allergens : [],
    goals: Array.isArray(raw.goals) ? raw.goals : goalsFromLegacyConditions(healthConditions),
    healthConditions,
  }
}

// Returns null if the user has never saved a profile (first-time gate).
export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return normalizeProfile(JSON.parse(raw))
  } catch {
    return null
  }
}

export function hasProfile() {
  return getProfile() !== null
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // storage unavailable — ignore
  }
}

// Merges a partial change into the saved profile (creating it if needed).
export function updateProfile(patch) {
  const next = { ...(getProfile() ?? emptyProfile()), ...patch }
  saveProfile(next)
  return next
}

// True only when the saved profile actually selects something — an empty
// (skipped) profile shouldn't trigger the "Personalized for you" badge.
export function isProfilePersonalized(profile) {
  if (!profile) return false
  return profile.diet?.length > 0 || profile.allergens?.length > 0 || profile.goals?.length > 0
}
