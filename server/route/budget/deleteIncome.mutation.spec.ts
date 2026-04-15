import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import { fixturesBudgetIncomes } from '~/prisma/fixtures'

// Use HouseholdMember income (index 1) — not the Beneficiary income — to avoid breaking other tests
const input = { id: fixturesBudgetIncomes[1].id }

describe('Budget - deleteIncome - Authorizations', () => {
  test('A ReceptionAgent cannot delete budget income', async ({ trpc }) => {
    await expect(() =>
      trpc.receptionAgent.budget.deleteIncome(input)
    ).rejects.toThrowError(/not allowed to access route/i)
  })

  test('A StructureManager from another structure cannot delete budget income', async ({
    trpc
  }) => {
    await expect(() =>
      trpc.structureManagerMinistere.budget.deleteIncome(input)
    ).rejects.toThrowError(/not allowed to access route/i)
  })
})
