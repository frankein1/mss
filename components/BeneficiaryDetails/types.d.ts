import { Beneficiary } from '@prisma/client'

export type BeneficiaryRelativeWithBeneficiary = BeneficiaryRelative & {
  beneficiary?: Beneficiary
}
