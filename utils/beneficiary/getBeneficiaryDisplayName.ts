import { Beneficiary } from '@prisma/client'
import { nameOrEmpty } from '~/utils/nameOrEmpty'

export function getBeneficiaryDisplayName(
  beneficiary: Pick<Beneficiary, 'firstName' | 'usualName' | 'birthName'>
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
