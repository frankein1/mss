import { test, expect } from '@playwright/test'

test('Home page should allow to login using ProConnect', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/auth\/login/)

  await expect(page).toHaveTitle(
    /se connecter à son espace de travail | mon suivi social/i
  )

  await page
    .getByRole('link', { name: /s'identifier avec proconnect/i })
    .click()

  await expect(page).toHaveURL(/dev-agentconnect.fr/)

  await expect(
    page.getByRole('heading', { name: /se connecter à mon suivi social/i })
  ).toBeVisible()
})
