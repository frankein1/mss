import { test, expect } from '@playwright/test'

test('Home page should allow to login using Inclusion Connect', async ({
  page
}) => {
  await page.goto('/')

  await page.getByRole('link', { name: ' Se connecter à son espace' }).click()

  await expect(page).toHaveURL(/auth\/login/)

  await expect(page).toHaveTitle(/Se connecter à ma structure/)

  await page
    .getByRole('link', { name: /s'identifier avec proconnect/i })
    .click()

  await expect(page).toHaveURL(/dev-agentconnect.fr/)

  await expect(
    page.getByRole('heading', { name: /se connecter à mon suivi social/i })
  ).toBeVisible()
})
