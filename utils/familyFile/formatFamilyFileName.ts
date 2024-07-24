import { BeneficiaryNames } from '~/types/beneficiary'

export function formatFamilyFileName(
  familyFileIdentification: BeneficiaryNames[]
): string {
  return familyFileIdentification
    .map(name => formatBeneficiaryDisplayName(name))
    .join(' & ')
}
