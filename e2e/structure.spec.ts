import type { Page } from '@playwright/test'
import { test, expect } from '@playwright/test'

async function validateHeadings(page: Page) {
  await expect(page).toHaveTitle(/Configurer votre structure/)

  await expect(
    page.getByRole('heading', { name: 'Configurer votre structure' })
  ).toBeVisible()
}

async function validateTabs(page: Page, tabsNumber: number) {
  // get tabs .fr-tabs__list => mettre un data-id
  const tabButtons = page.locator('ul[role="tablist"] button.fr-tabs__tab')
  // nombre de tabs
  await expect(tabButtons).toHaveCount(tabsNumber)
}

test.describe('Structure page, authenticated as Structure Manager', () => {
  test.use({ storageState: 'playwright/.auth/structure-manager.json' })

  test('should have title, and tabs', async ({ page }) => {
    await page.goto('/app/structure')
    await validateHeadings(page)
    await validateTabs(page, 4)
  })
})

test.describe('Structure page, authenticated as Reception Agent', () => {
  test.use({ storageState: 'playwright/.auth/reception-agent.json' })

  test('should have title, and tabs', async ({ page }) => {
    await page.goto('/app/structure')
    await validateHeadings(page)
    await validateTabs(page, 3)
  })
})
