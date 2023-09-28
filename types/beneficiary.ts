import type {
  Beneficiary,
  UserStatus,
  User,
  Document,
  Followup,
  HelpRequest,
  FollowupType,
  Draft
} from '@prisma/client'
import type { BeneficiaryRelativeWithLinkedBeneficiary } from './relative'
import {
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryTaxHouseholdInput,
  SaveBeneficiaryEntourageInput,
  SaveBeneficiaryHealthInput
} from '~/server/schema'

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
  followups: (Followup & { types: FollowupType[] })[]
  helpRequests: (HelpRequest & { type: FollowupType })[]
}

export type BeneficiarySearchResult = Pick<
  Beneficiary,
  'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate'
>

export type BeneficiaryNames = Partial<
  Pick<Beneficiary, 'firstName' | 'usualName' | 'birthName'>
>

export type BeneficiaryDraft = Draft & {
  content?: {
    general?: SaveBeneficiaryGeneralInformationInput
    taxHousehold?: SaveBeneficiaryTaxHouseholdInput
    entourage?: SaveBeneficiaryEntourageInput
    health?: SaveBeneficiaryHealthInput
  } | null
}
