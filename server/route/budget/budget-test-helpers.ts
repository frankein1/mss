import { describe, expect } from 'vitest'
import { test } from '~/test/server/test-utils'
import {
  FixtureBeneficiary,
  fixturesBeneficiaries,
  fixturesBudgets,
  fixturesBudgetIncomes,
  fixturesBudgetExpenses
} from '~/prisma/fixtures'

export const budgetFixtures = {
  ownStructure: {
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.TEARLE].id,
    budgetId: fixturesBudgets[FixtureBeneficiary.TEARLE].id,
    incomeId: fixturesBudgetIncomes.find(
      i => i.budgetId === fixturesBudgets[FixtureBeneficiary.TEARLE].id
    )!.id,
    expensesId: fixturesBudgetExpenses.find(
      e => e.budgetId === fixturesBudgets[FixtureBeneficiary.TEARLE].id
    )!.id
  },
  otherStructure: {
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.MARTIN].id,
    budgetId: fixturesBudgets[FixtureBeneficiary.MARTIN].id,
    incomeId: fixturesBudgetIncomes.find(
      i => i.budgetId === fixturesBudgets[FixtureBeneficiary.MARTIN].id
    )!.id,
    expensesId: fixturesBudgetExpenses.find(
      e => e.budgetId === fixturesBudgets[FixtureBeneficiary.MARTIN].id
    )!.id
  },
  referentAssigned: {
    familyFileId: fixturesBeneficiaries[FixtureBeneficiary.COURSOR].id,
    budgetId: fixturesBudgets[FixtureBeneficiary.COURSOR].id,
    incomeId: fixturesBudgetIncomes.find(
      i => i.budgetId === fixturesBudgets[FixtureBeneficiary.COURSOR].id
    )!.id,
    expensesId: fixturesBudgetExpenses.find(
      e => e.budgetId === fixturesBudgets[FixtureBeneficiary.COURSOR].id
    )!.id
  }
}

type EndpointCall = (caller: any) => Promise<unknown>

export function describeBudgetAuthorizations(
  routeName: string,
  calls: {
    ownStructure: EndpointCall
    otherStructure: EndpointCall
    referentAssigned: EndpointCall
  }
) {
  describe('Authorizations', () => {
    test(`${routeName} - a structure manager can access the budget`, async ({
      trpc
    }) => {
      const result = await calls.ownStructure(trpc.structureManager)
      expect(result).toBeDefined()
    })

    test(`${routeName} - a social worker can access the budget`, async ({
      trpc
    }) => {
      const result = await calls.ownStructure(trpc.socialWorker)
      expect(result).toBeDefined()
    })

    test(`${routeName} - a reception agent cannot access the budget`, async ({
      trpc
    }) => {
      await expect(() =>
        calls.ownStructure(trpc.receptionAgent)
      ).rejects.toThrowError(/not allowed to access route/i)
    })

    test(`${routeName} - an administrator cannot access the budget`, async ({
      trpc
    }) => {
      await expect(() =>
        calls.ownStructure(trpc.administrator)
      ).rejects.toThrowError(/user routes are not available to admins/i)
    })

    test(`${routeName} - a structure manager cannot access the budget of another structure`, async ({
      trpc
    }) => {
      await expect(() =>
        calls.otherStructure(trpc.structureManager)
      ).rejects.toThrowError(/no.*record/im)
    })

    test(`${routeName} - a referent cannot access the budget if not assigned to the family file`, async ({
      trpc
    }) => {
      await expect(() =>
        calls.ownStructure(trpc.referent)
      ).rejects.toThrowError(/no.*record/im)
    })

    test(`${routeName} - a referent can access the budget if assigned to the family file`, async ({
      trpc
    }) => {
      const result = await calls.referentAssigned(trpc.referent)
      expect(result).toBeDefined()
    })
  })
}
