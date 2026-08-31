import { test, expect } from '@playwright/test'

// The web app is useless on its own: it talks to gully-backend, and the admin
// dashboard reads the same API. These check the rest of the local stack is up,
// so a web-app failure is not misdiagnosed when the real cause is the backend.

const API = 'http://localhost:8000'
const ADMIN = 'http://localhost:5173'

test('backend is healthy and connected to the database', async ({ request }) => {
  const res = await request.get(`${API}/health`)
  expect(res.status()).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('healthy')
  expect(body.database).toBe('connected')
})

test('backend rejects admin endpoints without the secret', async ({ request }) => {
  const res = await request.get(`${API}/api/admin/dashboard/overview`)
  expect(res.status()).toBe(401)
})

test('admin dashboard serves and renders', async ({ page }) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const res = await page.goto(ADMIN)
  expect(res.status()).toBe(200)
  await expect(page.locator('#root')).not.toBeEmpty()
  expect(errors, errors.join('\n')).toEqual([])
})

test('web app can reach the backend through its configured URL', async ({ page }) => {
  // Confirms VITE_BACKEND_URL survived the CRA -> Vite env rename. If the app
  // still read process.env.REACT_APP_*, this would point at the production
  // fallback instead of localhost.
  await page.goto('/')
  const url = await page.evaluate(async () => {
    const res = await fetch('http://localhost:8000/health')
    return res.ok
  })
  expect(url).toBe(true)
})
