import { describe, test, expect } from 'vitest'
import { breadcrumbs } from './budget'
import type { BeneficiaryNames } from '~/types/beneficiary'

const familyIdentification: BeneficiaryNames[] = [
  { firstName: 'Marie', usualName: 'Dupont', birthName: 'Martin' }
]

describe('budget breadcrumbs', () => {
  test('AppFileBudgetInfoEdit returns file chain + budget info edit', () => {
    expect(
      breadcrumbs.AppFileBudgetInfoEdit('file-1', familyIdentification)
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' },
      {
        text: 'Modifier les informations générales du budget',
        to: '/app/files/file-1/budget/edit'
      }
    ])
  })

  test('AppFileBudgetExpensesEdit returns file chain + expenses edit', () => {
    expect(
      breadcrumbs.AppFileBudgetExpensesEdit(
        'file-1',
        familyIdentification,
        'exp-1'
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' },
      {
        text: 'Modifier les charges fixes mensuelles',
        to: '/app/files/file-1/expenses/exp-1/edit'
      }
    ])
  })

  test('AppFileBudgetIncomeEdit returns file chain + income edit', () => {
    expect(
      breadcrumbs.AppFileBudgetIncomeEdit(
        'file-1',
        familyIdentification,
        'inc-1'
      )
    ).toEqual([
      { text: 'Tableau de bord', to: '/app/overview' },
      { text: 'Bénéficiaires', to: '/app/beneficiaries' },
      { text: 'Marie DUPONT', to: '/app/files/file-1' },
      {
        text: 'Modifier les revenus mensuels',
        to: '/app/files/file-1/income/inc-1/edit'
      }
    ])
  })
})
