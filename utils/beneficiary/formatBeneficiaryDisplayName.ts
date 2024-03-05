import { nameOrEmpty } from '~/utils/nameOrEmpty'
import type { BeneficiaryNames } from '~/types/beneficiary'

export function formatBeneficiaryDisplayName(
  beneficiary: BeneficiaryNames,
  lastNameFirst?: boolean
): string {
  let lastname = ''
  if (beneficiary.usualName) {
    lastname = beneficiary.usualName
  } else if (beneficiary.birthName) {
    lastname = `(${beneficiary.birthName})`
  }
  if (lastNameFirst) {
    return `${nameOrEmpty(lastname.toUpperCase())} ${nameOrEmpty(beneficiary.firstName)}`
  }
  return `${nameOrEmpty(beneficiary.firstName)} ${nameOrEmpty(lastname.toUpperCase())}`
}
