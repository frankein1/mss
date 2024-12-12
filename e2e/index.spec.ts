import { test, expect } from '@playwright/test'

test('Home page should have title and allow to register', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Mon Suivi Social/)

  // Register
  await page.getByRole('link', { name: 'Créer un espace' }).first().click()

  await expect(
    page.getByRole('heading', {
      name: "L'équipe de Mon Suivi Social se charge de créer votre espace"
    })
  ).toBeVisible()
})
