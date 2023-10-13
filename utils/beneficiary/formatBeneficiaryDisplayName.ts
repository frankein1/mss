import { nameOrEmpty } from '~/utils/nameOrEmpty'
import type { BeneficiaryNames } from '~/types/beneficiary'

export function formatBeneficiaryDisplayName(
  beneficiary: BeneficiaryNames
): string {
  let lastname = ''
  if (beneficiary.usualName) {
    lastname = beneficiary.usualName
  } else if (beneficiary.birthName) {
    lastname = `(${beneficiary.birthName})`
  }
  return `${nameOrEmpty(beneficiary.firstName)} ${nameOrEmpty(
    lastname.toUpperCase()
  )}`
}
