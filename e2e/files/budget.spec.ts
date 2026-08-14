import { test, expect } from '@playwright/test'
import { fixturesBeneficiaries, FixtureBeneficiary } from '~~/prisma/fixtures'

const idApfelmann = fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].id
const familyFileId =
  fixturesBeneficiaries[FixtureBeneficiary.APFELMANN].familyFileId

const beneficiaryUrl = (familyFileId: string, id: string) =>
  `/app/files/${familyFileId}?beneficiaryId=${id}`

test.slow()

test.describe('As a Reception Agent the budget', () => {
  test.use({ storageState: 'playwright/.auth/reception-agent.json' })

  test('should NOT be accessible', async ({ page }) => {
    await page.goto(beneficiaryUrl(familyFileId, idApfelmann))
    await page.goto(beneficiaryUrl(familyFileId, idApfelmann))

    const budgetTab = page.getByTestId('test-Budget')
    await expect(budgetTab).not.toBeAttached()
  })
})
