import type { BeneficiaryNames } from '~~/types/beneficiary'
import { formatBeneficiaryDisplayName } from '../beneficiary/formatBeneficiaryDisplayName'

export function formatFamilyFileName(
  familyFileIdentification: BeneficiaryNames[]
): string {
  return familyFileIdentification
    .map(name => formatBeneficiaryDisplayName(name))
    .join(' & ')
}
