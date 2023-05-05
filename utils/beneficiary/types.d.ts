import { Beneficiary } from '@prisma/client'

export type BeneficiaryRelativeWithBeneficiary = BeneficiaryRelative & {
  beneficiary?: Beneficiary
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
