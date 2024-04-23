import { test, expect } from '@playwright/test'

test('Home page should allow to login using Inclusion Connect', async ({
  page
}) => {
  await page.goto('/')

  await page.getByRole('link', { name: ' Se connecter à son espace' }).click()

  await expect(page).toHaveURL(/auth\/login/)

  await expect(page).toHaveTitle(/Se connecter à ma structure/)

  await page.getByTitle("S'identifier avec InclusionConnect").click()

  await expect(page).toHaveURL(
    /connect.inclusion.beta.gouv.fr\/accounts\/login/
  )

  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
})
