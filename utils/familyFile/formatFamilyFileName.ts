import { BeneficiaryNames } from '~/types/beneficiary'

export function formatFamilyFileName(familyFile: {
  beneficiaries: BeneficiaryNames[]
}): string {
  return familyFile.beneficiaries
    .map(name => formatBeneficiaryDisplayName(name))
    .join(' / ')
}
