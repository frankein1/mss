import { Beneficiary } from '@prisma/client'
import { BeneficiaryTitleKeys } from '~/client/options'

export function formatBeneficiaryName(
  names: Pick<Beneficiary, 'firstName' | 'usualName' | 'title'>
) {
  return [
    BeneficiaryTitleKeys.value(names.title),
    names.firstName,
    names.usualName
  ]
    .filter(Boolean)
    .join(' ')
}
