import type {
  Beneficiary,
  BeneficiaryRelative
} from '~/prisma/generated/browser'

export type BeneficiaryRelativeWithLinkedBeneficiary = BeneficiaryRelative & {
  linkedBeneficiary: Beneficiary | null
}

export type BeneficiaryRelativeIdentification = Pick<
  BeneficiaryRelative,
  'id' | 'firstName' | 'lastName' | 'birthDate' | 'relationship' | 'hosted'
>
