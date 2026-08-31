import { test, expect } from '@playwright/test'
import { collectProblems, isExpectedNoise } from './helpers.js'

const ROUTES = [
  { path: '/', name: 'landing', expect: /superconnector/i },
  { path: '/faq', name: 'faq', expect: /Frequently Asked Questions/i },
  { path: '/privacy', name: 'privacy', expect: /Privacy Policy/i },
  { path: '/terms', name: 'terms', expect: /Terms of Service/i },
]

for (const route of ROUTES) {
  test(`${route.name} renders without console errors`, async ({ page }) => {
    const { errors, warnings } = collectProblems(page)

    await page.goto(route.path)
    await expect(page.locator('#root')).not.toBeEmpty()
    await expect(page.getByText(route.expect).first()).toBeVisible()

    const real = errors.filter((e) => !isExpectedNoise(e))
    expect(real, `console errors on ${route.path}:\n${real.join('\n')}`).toEqual([])

    // React 19 surfaces ref/forwardRef warnings that were silent in 18.
    const reactWarnings = warnings.filter((w) => /ref|forwardRef|deprecat/i.test(w))
    expect(
      reactWarnings,
      `React warnings on ${route.path}:\n${reactWarnings.join('\n')}`
    ).toEqual([])
  })
}

test('unknown route shows the 404 page, not a blank screen', async ({ page }) => {
  const { errors } = collectProblems(page)
  await page.goto('/this-route-does-not-exist')
  await expect(page.locator('#root')).not.toBeEmpty()
  const real = errors.filter((e) => !isExpectedNoise(e))
  expect(real, real.join('\n')).toEqual([])
})

test('unauthenticated /app redirects to the landing page', async ({ page }) => {
  await page.goto('/app/home')
  await expect(page).toHaveURL('http://localhost:3000/')
  await expect(page.getByText(/superconnector/i).first()).toBeVisible()
})

test('landing page links to WhatsApp', async ({ page }) => {
  await page.goto('/')
  const wa = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first()
  await expect(wa).toBeVisible()
})

test('brand icons render as SVG after the lucide v1 replacement', async ({ page }) => {
  // The landing page footer/socials exercise inline SVG rendering generally;
  // the dashboard spec covers the replaced Instagram/LinkedIn/X marks directly.
  await page.goto('/')
  expect(await page.locator('svg').count()).toBeGreaterThan(0)
})

test('page has no horizontal overflow at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  )
  expect(overflow, 'body scrolls horizontally on a 390px viewport').toBe(false)
})
