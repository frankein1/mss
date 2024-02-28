import { formatBeneficiaryDisplayName } from './formatBeneficiaryDisplayName'
import { BeneficiaryNames } from '~/types/beneficiary'
import { formatDate } from '~/utils/formatDate'

export function formatBeneficiaryNameAndBirthDate(
  beneficiary: BeneficiaryNames & { birthDate?: Date | null }
) {
  if (!beneficiary.birthDate) {
    return formatBeneficiaryDisplayName(beneficiary)
  }

  return `${formatBeneficiaryDisplayName(beneficiary)} - ${formatDate(beneficiary.birthDate)}`
}
