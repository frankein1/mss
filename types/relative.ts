import { Beneficiary, BeneficiaryRelative } from '@prisma/client'

export type BeneficiaryRelativeWithLinkedBeneficiary = BeneficiaryRelative & {
  linkedBeneficiary: Beneficiary | null
}
