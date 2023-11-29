import { Beneficiary, BeneficiaryRelative, Prisma } from '@prisma/client'

export type BeneficiaryRelativeWithLinkedBeneficiary = BeneficiaryRelative & {
  linkedBeneficiary: Beneficiary | null
}

export type LinkedTaxHousehold =
  Prisma.BeneficiaryRelativeCreateManyBeneficiaryInput & {
    hosted: true
    linkedBeneficiaryId: string
  }
