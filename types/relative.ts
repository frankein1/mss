import { Beneficiary, BeneficiaryRelative } from '@prisma/client'

export type BeneficiaryRelativeWithLinkedBeneficiary = BeneficiaryRelative & {
  linkedBeneficiary: Beneficiary | null
}

export type BeneficiaryRelativeIdentification = Pick<
  BeneficiaryRelative,
  'id' | 'firstName' | 'lastName' | 'birthDate' | 'relationship' | 'hosted'
>
