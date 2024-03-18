import { Beneficiary } from '@prisma/client'
import { beneficiaryTitleKeys } from '~/client/options'

export function formatBeneficiaryName(
  names: Pick<Beneficiary, 'firstName' | 'usualName' | 'title'>
) {
  return [
    beneficiaryTitleKeys.value(names.title),
    names.firstName,
    names.usualName
  ]
    .filter(Boolean)
    .join(' ')
}
