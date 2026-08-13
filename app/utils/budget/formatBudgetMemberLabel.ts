import type { Beneficiary, BudgetIncome } from '@prisma/client'
import { taxHouseHoldRelationshipKeys } from '~~/client/options'

export const formatBudgetMemberLabel = (
  income: Pick<BudgetIncome, 'relationship' | 'firstName' | 'lastName'> & {
    beneficiary: Pick<
      Beneficiary,
      'relationship' | 'firstName' | 'usualName'
    > | null
  }
) => {
  const beneficiary = income.beneficiary
  const names = []
  const firstName = beneficiary?.firstName || income.firstName || ''
  const lastName = beneficiary?.usualName || income.lastName || ''
  names.push(`${firstName} ${lastName}`)
  const relationship = beneficiary?.relationship || income.relationship
  if (relationship) {
    names.push(taxHouseHoldRelationshipKeys.value(relationship))
  }
  return `${names.join(' - ')} (${beneficiary ? 'Bénéficiaire' : 'Membre du foyer'})`
}
