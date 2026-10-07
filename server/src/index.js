import { config } from './config.js'
import { seedDemoUsers } from './store.js'
import { createApp } from './app.js'

const demoEmails = await seedDemoUsers()
console.log(`[store] in-memory store ready, demo users: ${demoEmails.join(', ')}`)

createApp().listen(config.port, () => {
  console.log(`[server] Nova Coach API listening on :${config.port}`)
})
