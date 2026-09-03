import { test, expect } from '@playwright/test'
import { backendSecret, mintToken, collectProblems, isExpectedNoise } from './helpers.js'

// A real user from the local dev database (production data copied into the
// gully-mongo container). Auth is a JWT in localStorage, so the tests sign one
// the same way the backend does rather than going through phone + OTP.
const USER_ID = 'dd754b52-862d-4529-b5a4-ebb6b44f1b68'

const secret = backendSecret()

test.describe('authenticated dashboard', () => {
  test.skip(!secret, 'gully-backend/.env has no JWT_SECRET; cannot mint a session')

  test.beforeEach(async ({ page }) => {
    const token = mintToken(USER_ID, secret)
    // Seed before any app code runs, so AuthProvider hydrates as signed in.
    await page.addInitScript(
      ([t, id]) => {
        localStorage.setItem('gully_token', t)
        localStorage.setItem('gully_user', JSON.stringify({ id, name: 'E2E' }))
      },
      [token, USER_ID]
    )
  })

  const PAGES = [
    { path: '/app/home', name: 'home' },
    { path: '/app/you', name: 'you' },
    { path: '/app/settings', name: 'settings' },
  ]

  for (const p of PAGES) {
    test(`${p.name} renders for a signed-in user`, async ({ page }) => {
      const { errors, warnings } = collectProblems(page)

      await page.goto(p.path)
      // Lazy-loaded route chunks need a beat to resolve.
      await page.waitForLoadState('networkidle')

      await expect(page).toHaveURL(new RegExp(p.path))
      await expect(page.locator('#root')).not.toBeEmpty()

      const real = errors.filter((e) => !isExpectedNoise(e))
      expect(real, `console errors on ${p.path}:\n${real.join('\n')}`).toEqual([])

      const reactWarnings = warnings.filter((w) => /ref|forwardRef|deprecat/i.test(w))
      expect(
        reactWarnings,
        `React 19 warnings on ${p.path}:\n${reactWarnings.join('\n')}`
      ).toEqual([])
    })
  }

  test('replaced brand icons render in the edit-profile modal', async ({ page }) => {
    // Direct check on the lucide v1 fallout: Instagram/Linkedin/Twitter now come
    // from BrandIcons.jsx, each rendering an <svg> with an aria-label.
    //
    // The modal's social-link inputs render all five networks regardless of what
    // the user has connected. The profile page's own "links" row only renders
    // networks the user actually has, and the Socials tab is a different
    // component (SocialOAuthPage) with its own logos - neither is a reliable
    // place to assert these icons.
    await page.goto('/app/profile')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: /edit profile/i }).first().click()

    for (const label of ['Instagram', 'LinkedIn', 'X']) {
      const icon = page.locator(`svg[aria-label="${label}"]`).first()
      await expect(icon, `${label} brand icon missing`).toBeAttached()
    }
  })

  test('network page loads its data without an API error', async ({ page }) => {
    // Regression: GET /api/network used to 422 on every request because
    // api/network.py declared Depends(verify_token), a dependency written for
    // query-param tokens, so FastAPI ignored the Authorization header.
    const failed = []
    page.on('response', (r) => {
      if (r.url().includes('/api/network') && !r.ok()) failed.push(`${r.status()} ${r.url()}`)
    })

    await page.goto('/app/network')
    await page.waitForLoadState('networkidle')

    expect(failed, `network API errors:\n${failed.join('\n')}`).toEqual([])
    await expect(page.locator('#root')).not.toBeEmpty()
  })

  test('lazy-loaded route chunks actually load', async ({ page }) => {
    await page.goto('/app/home')
    await page.waitForLoadState('networkidle')
    // Navigating between tabs pulls separate chunks; a failed dynamic import
    // would leave the outlet empty.
    await page.goto('/app/you')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('#root')).not.toBeEmpty()
  })
})
