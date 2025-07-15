import { test, expect, Page } from '@playwright/test'
import { generateFileNumber } from '~/utils/generateFileNumber'

async function addSocialSupportSubject(page: Page, subject: string) {
  await page.getByRole('button', { name: /ajouter/i }).click()
  await page
    .getByRole('textbox', { name: /intitulé/i })
    .last()
    .fill(subject)
}

test.use({ storageState: 'playwright/.auth/structure-manager.json' })

test('Social support subject configuration as authenticated Structure Manager', async ({
  page
}) => {
  await page.goto('/app/structure/subjects')

  // Adding subjects that already exist should trigger an error in the form
  await page.getByRole('button', { name: /créer un objet/i }).click()
  await addSocialSupportSubject(page, 'Aide ALIMENTAIre')
  await addSocialSupportSubject(page, 'Aide au RELOGEMENT')
  const newSubject1 = `Nouvel Objet d'Accompagnement ${generateFileNumber()}  `
  const newSubject2 = ` Autre Objet d'Accompagnement ${generateFileNumber()}`
  await addSocialSupportSubject(page, newSubject1)
  await addSocialSupportSubject(page, newSubject2)
  await page.getByRole('button', { name: /valider/i }).click()

  const errorLocators = await page.locator('.fr-messages-group').all()
  expect.soft(errorLocators).toHaveLength(2)
  expect.soft(errorLocators[0]).toHaveText(/cet objet d'accompagnement existe/i)
  expect.soft(errorLocators[1]).toHaveText(/cet objet d'accompagnement existe/i)

  // Deleting duplicate subject should allow to validate form and create the new subjects
  const deleteButtons = page.getByRole('button', { name: /supprimer/i })
  await deleteButtons.nth(0).click()
  await deleteButtons.nth(1).click()

  await page.getByRole('button', { name: /valider/i }).click()
  await page.waitForURL(/app\/structure/, { waitUntil: 'networkidle' })

  const subjectListContent = await page.locator('.sss__items').innerText()
  expect.soft(subjectListContent).toContain(newSubject1.trim())
  expect.soft(subjectListContent).toContain(newSubject2.trim())

  // Editing a subject with a value that already exist for this structure should trigger an error in the form
  // except if the target value matches the same subject
})
