import { getBeneficiaryDisplayName } from './getBeneficiaryDisplayName'
import { BeneficiarySearchResult } from '~/types/beneficiary'

export function getBeneficiarySearchDisplayName(
  beneficiary: BeneficiarySearchResult
): string {
  const name = getBeneficiaryDisplayName(beneficiary)
  const birthDate = beneficiary.birthDate
    ? formatDate(beneficiary.birthDate)
    : ''
  return birthDate ? `${name} (${birthDate})` : name
}
