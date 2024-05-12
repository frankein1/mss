import { test as setup, Page } from '@playwright/test'

async function authenticate(page: Page, username: string, password: string) {
  // Temp verification for env variables
  console.log('database url', process.env.DATABASE_URL)
  console.log('environment', process.env.ENVIRONMENT)
  console.log('ci', process.env.CI)
  console.log('app url', process.env.APP_URL)
  console.log('AUTH_KEYCLOAK_ISSUER_URL', process.env.AUTH_KEYCLOAK_ISSUER_URL)
  console.log('EMAIL_FROM', process.env.EMAIL_FROM)

  await page.goto('/auth/login')
  await page.getByTitle("S'identifier avec InclusionConnect").click()

  await page.waitForURL(/connect.inclusion.beta.gouv.fr/)

  await page.getByLabel('Adresse e-mail').fill(username)
  await page.getByLabel('Mot de passe').fill(password)
  await page.getByRole('button', { name: 'Connexion' }).click()

  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(/\/app\/overview/)
}

// setup('authenticate as Administrator', async ({ page }) => {
//   const adminFile = 'playwright/.auth/administrator.json'
//   const username = process.env.ADMINISTRATOR_EMAIL || ''
//   const pwd = process.env.ADMINISTRATOR_PASSWORD || ''

//   await authenticate(page, username, pwd)
//   await page.context().storageState({ path: adminFile })
// })

setup('authenticate as Structure Manager', async ({ page }) => {
  const managerFile = 'playwright/.auth/structure-manager.json'
  const username = process.env.STRUCTURE_MANAGER_EMAIL || ''
  const pwd = process.env.STRUCTURE_MANAGER_PASSWORD || ''

  await authenticate(page, username, pwd)
  await page.context().storageState({ path: managerFile })
})

setup('authenticate as Social Worker', async ({ page }) => {
  const workerFile = 'playwright/.auth/social-worker.json'
  const username = process.env.SOCIAL_WORKER_EMAIL || ''
  const pwd = process.env.SOCIAL_WORKER_PASSWORD || ''

  await authenticate(page, username, pwd)
  await page.context().storageState({ path: workerFile })
})
