import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// NB: no import.meta here. package.json deliberately omits "type": "module" so
// tailwind.config.js and postcss.config.js can stay CommonJS, which makes
// import.meta a syntax error. Playwright runs from the package root, so paths
// are resolved from process.cwd() instead.

/**
 * Reads JWT_SECRET out of the backend's .env. Local-dev only: there is no
 * endpoint that mints a token without going through phone + OTP, so the tests
 * sign one the same way api/helpers.py does.
 * Returns null when the backend env is not available, so auth specs can skip
 * rather than fail.
 */
export function backendSecret() {
  const envPath = path.resolve(process.cwd(), '../gully-backend/.env')
  if (!fs.existsSync(envPath)) return null
  const line = fs
    .readFileSync(envPath, 'utf8')
    .split('\n')
    .find((l) => l.startsWith('JWT_SECRET='))
  const secret = line?.slice('JWT_SECRET='.length).trim()
  return secret || null
}

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

/** Mints the same HS256 token shape as gully-backend/api/helpers.py create_token(). */
export function mintToken(userId, secret) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = b64url(
    JSON.stringify({ user_id: userId, exp: Math.floor(Date.now() / 1000) + 3600 })
  )
  const data = `${header}.${payload}`
  const sig = b64url(crypto.createHmac('sha256', secret).update(data).digest())
  return `${data}.${sig}`
}

/**
 * Collects console errors and page exceptions. React 19 surfaces warnings that
 * React 18 did not (notably around ref handling), so warnings are captured too.
 */
export function collectProblems(page) {
  const errors = []
  const warnings = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (msg.type() === 'error') errors.push(text)
    if (msg.type() === 'warning') warnings.push(text)
  })
  page.on('pageerror', (err) => errors.push(`UNCAUGHT: ${err.message}`))
  return { errors, warnings }
}

/** Network/API noise we expect locally and should not fail the suite over. */
export function isExpectedNoise(text) {
  return (
    text.includes('Failed to load resource') ||
    text.includes('ERR_CONNECTION') ||
    text.includes('401') ||
    text.includes('404') ||
    text.includes('favicon')
  )
}
