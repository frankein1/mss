import AxeBuilder from '@axe-core/playwright'
import { test, expect, Page } from '@playwright/test'

async function analyze(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()

  expect
    .soft(results.violations, JSON.stringify(results.violations, undefined, 2))
    .toHaveLength(0)
  expect
    .soft(results.incomplete, JSON.stringify(results.incomplete, undefined, 2))
    .toHaveLength(0)
}

test.describe.skip('a11y - Website', () => {
  test('Home', async ({ page }) => {
    await page.goto('/')

    await analyze(page)
  })

  test('Accessibility declaration', async ({ page }) => {
    await page.goto('/declaration-accessibilite')

    await analyze(page)
  })

  test('Legals', async ({ page }) => {
    await page.goto('/mentions-legales')

    await analyze(page)
  })

  test('Create account', async ({ page }) => {
    await page.goto('/register')

    await analyze(page)
  })
})

test.describe.skip('a11y - Application', () => {
  test.use({ storageState: 'playwright/.auth/structure-manager.json' })

  test('Dashboard', async ({ page }) => {
    await page.goto('/app/overview')

    await analyze(page)
  })

  test('Beneficiaries', async ({ page }) => {
    await page.goto('/app/beneficiaries')

    await analyze(page)
  })

  test('Social supports', async ({ page }) => {
    await page.goto('/app/history')

    await analyze(page)
  })

  test('Statistics', async ({ page }) => {
    await page.goto('/app/stats')

    await analyze(page)
  })

  test('Structure manager - User Management', async ({ page }) => {
    await page.goto('/app/users')

    await analyze(page)
  })

  test('Structure manager - Structure configuration', async ({ page }) => {
    await page.goto('/app/structure')

    await analyze(page)
  })
})
