import bcrypt from 'bcrypt'

// In-memory storage: everything resets when the server restarts. Fine for the
// demo; swap for a database before real users sign up.

export const BCRYPT_ROUNDS = 10

const usersByEmail = new Map() // email -> { id, email, passwordHash, createdAt }
const profiles = new Map() // userId -> profile
const scans = [] // newest last
let nextUserId = 1
let nextScanId = 1

export const EMPTY_PROFILE = { age: null, conditions: [], allergies: [], goals: [], diet: null }

export function findUserByEmail(email) {
  return usersByEmail.get(email) ?? null
}

export function createUser(email, passwordHash) {
  if (usersByEmail.has(email)) return null
  const user = { id: nextUserId++, email, passwordHash, createdAt: new Date().toISOString() }
  usersByEmail.set(email, user)
  profiles.set(user.id, { ...EMPTY_PROFILE })
  return user
}

export function getProfile(userId) {
  return profiles.get(userId) ?? { ...EMPTY_PROFILE }
}

export function saveProfile(userId, profile) {
  profiles.set(userId, { ...EMPTY_PROFILE, ...profile })
  return profiles.get(userId)
}

export function addScan(userId, scan) {
  const record = { id: nextScanId++, user_id: userId, ...scan, created_at: new Date().toISOString() }
  scans.push(record)
  return record
}

export function getScans(userId, limit) {
  const mine = []
  for (let i = scans.length - 1; i >= 0 && mine.length < limit; i--) {
    if (scans[i].user_id === userId) mine.push(scans[i])
  }
  return mine
}

const DEMO_PASSWORD = 'demo1234'
const DEMO_USERS = [
  {
    email: 'diabetic@nova.app',
    profile: { goals: ['Less sugar', 'Less processed food'], allergies: ['gluten'] },
  },
  {
    email: 'athlete@nova.app',
    profile: { goals: ['High protein', 'Clean ingredients'], allergies: [] },
  },
]

export async function seedDemoUsers() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS)
  for (const demo of DEMO_USERS) {
    const user = createUser(demo.email, hash) ?? findUserByEmail(demo.email)
    saveProfile(user.id, demo.profile)
  }
  return DEMO_USERS.map((d) => d.email)
}
