import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
import { nameOrEmpty } from '~/utils/nameOrEmpty'
import { getBeneficiaryDisplayName } from '~/utils/beneficiary/getBeneficiaryDisplayName'

export function getBeneficiaryRelativeDisplayName(
  beneficiaryRelative: BeneficiaryRelativeWithLinkedBeneficiary
): string {
  if (beneficiaryRelative.linkedBeneficiary) {
    return getBeneficiaryDisplayName(beneficiaryRelative.linkedBeneficiary)
  }
  return `${nameOrEmpty(
    beneficiaryRelative.firstName
  )} ${beneficiaryRelative.lastName?.toUpperCase()}`
}
