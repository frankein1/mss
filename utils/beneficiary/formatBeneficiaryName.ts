import { Beneficiary } from '@prisma/client'

export function formatBeneficiaryName(
  names: Pick<Beneficiary, 'firstName' | 'usualName' | 'title'>
) {
  return [names.title, names.firstName, names.usualName]
    .filter(Boolean)
    .join(' ')
}
