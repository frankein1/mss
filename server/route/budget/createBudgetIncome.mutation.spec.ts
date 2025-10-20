import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesBudgets
} from '~/prisma/fixtures'

describe('Authorizations', () => {
  test('Create Income - An Agent cannot create an income for a beneficiary from another structure', async ({
    trpc
  }) => {
    const budgetId = fixturesBudgets[FixtureBeneficiary.TEARLE].id
    const beneficiaryId = fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id

    await expect(() =>
      trpc.structureManagerMinistere.budget.createBudgetIncome({
        budgetId,
        beneficiaryId
      })
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})
