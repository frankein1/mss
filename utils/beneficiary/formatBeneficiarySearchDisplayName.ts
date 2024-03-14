import { formatBeneficiaryDisplayName } from './formatBeneficiaryDisplayName'
import { BeneficiaryIdentification } from '~/types/beneficiary'

export function formatBeneficiarySearchDisplayName(
  beneficiary: BeneficiaryIdentification
): string {
  const name = formatBeneficiaryDisplayName(beneficiary)
  const birthDate = beneficiary.birthDate
    ? formatDate(beneficiary.birthDate)
    : ''
  return birthDate ? `${name} (${birthDate})` : name
}
