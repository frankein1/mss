import { test, expect, Page } from '@playwright/test'

async function validateHeadings(page: Page) {
  await expect(page).toHaveTitle(/Tableau de bord/)

  await expect(
    page.getByRole('heading', { name: 'Tableau de bord' })
  ).toBeVisible()
}

async function validateLegals(page: Page, role: 'user' | 'manager') {
  // CGU
  const cgu = page.getByRole('link', { name: 'CGU' })
  await expect(cgu).toBeVisible()
  await expect(cgu).toHaveAttribute('href', new RegExp(`cgu/${role}`))

  // Politique confidentialité
  const confidentialite = page.getByRole('link', {
    name: 'Politique de confidentialité'
  })
  await expect(confidentialite).toBeVisible()
  await expect(confidentialite).toHaveAttribute(
    'href',
    /politique-confidentialite/
  )

  // Accessibilité
  const accessibilite = page.getByRole('link', { name: /Accessibilité/ })
  await expect(accessibilite).toBeVisible()
  await expect(accessibilite).toHaveAttribute(
    'href',
    /declaration-accessibilite/
  )
}

async function validateTopbarMenu(page: Page, expected: string[]) {
  const topbar = page.locator('.topbar__container')
  await topbar.getByRole('button').click()
  await expect(topbar.getByRole('listitem')).toHaveText(expected)
}

test.describe('Homepage as authenticated Structure Manager', () => {
  test.use({ storageState: 'playwright/.auth/structure-manager.json' })

  test('should have title, legal mentions and settings menu', async ({
    page
  }) => {
    await page.goto('/app/overview')

    await validateHeadings(page)
    await validateLegals(page, 'manager')
    await validateTopbarMenu(page, [
      'Mon compte',
      'Utilisateurs',
      'Structure',
      'Déconnexion'
    ])
  })
})

test.describe('Homepage as authenticated Social Worker', () => {
  test.use({ storageState: 'playwright/.auth/social-worker.json' })

  test('should have title, legal mentions and settings menu', async ({
    page
  }) => {
    await page.goto('/app/overview')

    await validateHeadings(page)
    await validateLegals(page, 'user')
    await validateTopbarMenu(page, ['Mon compte', 'Structure', 'Déconnexion'])
  })
})
