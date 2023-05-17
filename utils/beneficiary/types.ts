import {
  Beneficiary,
  BeneficiaryRelative,
  UserStatus,
  User
} from '@prisma/client'

export type BeneficiaryRelativeWithLinkedBeneficiary = BeneficiaryRelative & {
  linkedBeneficiary: Beneficiary | null
}

export type BeneficiaryReferent = {
  id: string
  name: string
  status: UserStatus
}

export type BeneficiaryWithReferents = Beneficiary & {
  referents: User[]
}

export type BeneficiarySearchResult = Pick<
  Beneficiary,
  'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate'
>
