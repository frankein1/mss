import { formatBeneficiaryDisplayName } from './formatBeneficiaryDisplayName'
import { BeneficiarySearchResult } from '~/types/beneficiary'

export function formatBeneficiarySearchDisplayName(
  beneficiary: BeneficiarySearchResult
): string {
  const name = formatBeneficiaryDisplayName(beneficiary)
  const birthDate = beneficiary.birthDate
    ? formatDate(beneficiary.birthDate)
    : ''
  return birthDate ? `${name} (${birthDate})` : name
}
