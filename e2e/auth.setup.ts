import { test as setup, Page } from '@playwright/test'

async function authenticate(
  page: Page,
  username: string,
  password: string,
  newUser = false
) {
  await page.goto('/auth/login')
  await page.getByRole('link', { name: /inclusionconnect/i }).click()

  await page.waitForURL(/connect.inclusion.beta.gouv.fr/)

  await page.getByLabel('Adresse e-mail').fill(username)
  await page.getByLabel('Mot de passe').fill(password)
  await page.getByRole('button', { name: /connexion/i }).click()

  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(newUser ? /\/cgu/ : /\/app\/overview/)
}

setup('authenticate as Structure Manager Jeanne', async ({ page }) => {
  const managerFile = 'playwright/.auth/structure-manager.json'
  const username = process.env.STRUCTURE_MANAGER_EMAIL || ''
  const pwd = process.env.STRUCTURE_MANAGER_PASSWORD || ''

  await authenticate(page, username, pwd)
  await page.context().storageState({ path: managerFile })
})

setup('authenticate as Social Worker Jean', async ({ page }) => {
  const workerFile = 'playwright/.auth/social-worker.json'
  const username = process.env.SOCIAL_WORKER_EMAIL || ''
  const pwd = process.env.SOCIAL_WORKER_PASSWORD || ''

  await authenticate(page, username, pwd)
  await page.context().storageState({ path: workerFile })
})

setup('authenticate as Structure Manager Anita', async ({ page }) => {
  const managerFile = 'playwright/.auth/structure-manager-new-user.json'
  const username = process.env.STRUCTURE_MANAGER_NEW_USER_EMAIL || ''
  const pwd = process.env.STRUCTURE_MANAGER_NEW_USER_PASSWORD || ''
  const newUser = true

  await authenticate(page, username, pwd, newUser)
  await page.context().storageState({ path: managerFile })
})

setup('authenticate as Social Worker Mehdi', async ({ page }) => {
  const workerFile = 'playwright/.auth/social-worker-new-user.json'
  const username = process.env.SOCIAL_WORKER_NEW_USER_EMAIL || ''
  const pwd = process.env.SOCIAL_WORKER_NEW_USER_PASSWORD || ''
  const newUser = true

  await authenticate(page, username, pwd, newUser)
  await page.context().storageState({ path: workerFile })
})
