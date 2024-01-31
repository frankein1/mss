import type {
  Beneficiary,
  BeneficiaryRelative,
  Draft,
  User,
  UserStatus
} from '@prisma/client'
import { FollowupTypeIdAndName } from './followupType'
import {
  SaveBeneficiaryEntourageInput,
  SaveBeneficiaryExternalOrganisationsInput,
  SaveBeneficiaryGeneralInformationInput,
  SaveBeneficiaryHealthInput,
  SaveBeneficiaryOccupationInput,
  SaveBeneficiaryTaxHouseholdInput
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

export type GetBeneficiaryHealth = Pick<
  Beneficiary,
  | 'gir'
  | 'doctor'
  | 'healthAdditionalInformation'
  | 'insurance'
  | 'socialSecurityNumber'
>

export type GetBeneficiaryGeneral = Pick<
  Beneficiary,
  | 'title'
  | 'usualName'
  | 'birthName'
  | 'firstName'
  | 'birthDate'
  | 'birthPlace'
  | 'deathDate'
  | 'gender'
  | 'nationality'
  | 'numeroPegase'
  | 'accommodationMode'
  | 'accommodationName'
  | 'accommodationZone'
  | 'accommodationAdditionalInformation'
  | 'street'
  | 'addressComplement'
  | 'zipcode'
  | 'city'
  | 'region'
  | 'department'
  | 'noPhone'
  | 'phone1'
  | 'phone2'
  | 'email'
  | 'mobility'
  | 'additionalInformation'
>

export type GetBeneficiaryExternalOrganisations = Pick<
  Beneficiary,
  | 'protectionMeasure'
  | 'representative'
  | 'prescribingStructure'
  | 'orientationType'
  | 'orientationStructure'
  | 'serviceProviders'
  | 'involvedPartners'
  | 'additionalInformation'
>

export type GetBeneficiaryOccupationIncome = Pick<
  Beneficiary,
  | 'socioProfessionalCategory'
  | 'occupation'
  | 'employer'
  | 'employerSiret'
  | 'mainIncomeSource'
  | 'mainIncomeAmount'
  | 'partnerMainIncomeSource'
  | 'partnerMainIncomeAmount'
  | 'majorChildrenMainIncomeSource'
  | 'majorChildrenMainIncomeAmount'
  | 'otherMembersMainIncomeSource'
  | 'otherMembersMainIncomeAmount'
  | 'unemploymentNumber'
  | 'pensionOrganisations'
  | 'otherPensionOrganisations'
  | 'cafNumber'
  | 'bank'
  | 'funeralContract'
  | 'ministereCategorie'
  | 'ministereDepartementServiceAc'
  | 'ministereStructure'
>

export type GetBeneficiaryRelative = Pick<
  BeneficiaryRelative,
  | 'id'
  | 'lastName'
  | 'firstName'
  | 'relationship'
  | 'city'
  | 'email'
  | 'phone'
  | 'hosted'
  | 'caregiver'
  | 'beneficiaryId'
  | 'additionalInformation'
  | 'birthDate'
>

export type GetBeneficiaryTaxHousehold = Pick<
  Beneficiary,
  'familySituation' | 'minorChildren' | 'majorChildren' | 'caregiver'
> & {
  taxHouseholds?: GetBeneficiaryRelative[]
}

export type GetBeneficiaryOutput = Pick<
  Beneficiary,
  | 'id'
  | 'fileNumber'
  | 'structureId'
  | 'additionalInformation'
  | 'createdById'
  | 'created'
  | 'updated'
  | 'status'
  | 'archivedById'
  | 'aidantConnectAuthorized'
> & {
  referents: Pick<
    User,
    'id' | 'firstName' | 'lastName' | 'email' | 'role' | 'status'
  >[]
} & {
  general: GetBeneficiaryGeneral
  health: GetBeneficiaryHealth | undefined
  externalOrganisations: GetBeneficiaryExternalOrganisations | undefined
  occupationIncome: GetBeneficiaryOccupationIncome | undefined
  entourages: GetBeneficiaryRelative[] | undefined
  taxHouseholds: GetBeneficiaryTaxHousehold | undefined
  history: {
    historyTotal: number
    types: FollowupTypeIdAndName[]
  }
}
