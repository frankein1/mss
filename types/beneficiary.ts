import type { Beneficiary, UserStatus, User, Document } from '@prisma/client'
import type { BeneficiaryRelativeWithLinkedBeneficiary } from './relative'

export type BeneficiaryReferent = {
  id: string
  name: string
  status: UserStatus
}

export type BeneficiaryWithReferents = Beneficiary & {
  referents: User[]
}

export type BeneficiaryWithRelations = BeneficiaryWithReferents & {
  relatives: BeneficiaryRelativeWithLinkedBeneficiary[]
  documents: Document[]
}

export type BeneficiarySearchResult = Pick<
  Beneficiary,
  'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate'
>

export type BeneficiaryNames = Pick<
  Beneficiary,
  'firstName' | 'usualName' | 'birthName'
>
