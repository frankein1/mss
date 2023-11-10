import type { Beneficiary, UserStatus, Draft } from '@prisma/client'
import {
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryTaxHouseholdInput,
  SaveBeneficiaryEntourageInput,
  SaveBeneficiaryHealthInput,
  SaveBeneficiaryOccupationInput,
  SaveBeneficiaryExternalOrganisationsInput
} from '~/server/schema'
import {
  SecurityTargetWithReferents,
  SecurityTargetWithStructure
} from '~/server/security'

export type BeneficiaryReferent = {
  id: string
  name: string
  status: UserStatus
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
    occupation?: SaveBeneficiaryOccupationInput
    externalOrganisations?: SaveBeneficiaryExternalOrganisationsInput
  } | null
}

export type MinimalBeneficiaryForFormLayout = BeneficiaryNames &
  SecurityTargetWithReferents &
  SecurityTargetWithStructure & { id: string }
