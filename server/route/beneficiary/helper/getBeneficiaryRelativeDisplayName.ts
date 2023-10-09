import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import { formatBeneficiaryDisplayName } from '~/utils/beneficiary/formatBeneficiaryDisplayName'

export function getBeneficiaryRelativeDisplayName(
  beneficiaryRelative: BeneficiaryRelativeWithLinkedBeneficiary
): string {
  if (beneficiaryRelative.linkedBeneficiary) {
    return formatBeneficiaryDisplayName(beneficiaryRelative.linkedBeneficiary)
  }
  return `${nameOrEmpty(
    beneficiaryRelative.firstName
  )} ${beneficiaryRelative.lastName?.toUpperCase()}`
}
