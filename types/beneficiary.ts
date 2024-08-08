import type {
  Beneficiary,
  BeneficiaryRelative,
  User,
  UserStatus
} from '@prisma/client'
import { RouterOutput } from '~/server/trpc/routers'

export type BeneficiaryReferent = {
  id: string
  name: string
  status: UserStatus
}

export type BeneficiaryNames = Partial<
  Pick<Beneficiary, 'id' | 'firstName' | 'usualName' | 'birthName'>
>

export type BeneficiaryIdentification = Pick<
  Beneficiary,
  'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate'
>

export type BeneficiaryIdentificationWithFileId = Pick<
  Beneficiary,
  'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate' | 'familyFileId'
>

export type BeneficiaryFileIdentification = Pick<
  Beneficiary,
  'id' | 'firstName' | 'usualName' | 'birthName' | 'birthDate' | 'relationship'
>

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
  | 'studyLevel'
  | 'employer'
  | 'employerSiret'
  | 'unemploymentNumber'
  | 'pensionOrganisations'
  | 'otherPensionOrganisations'
  | 'cafNumber'
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
  | 'familySituation'
  | 'weddingDate'
  | 'divorceDate'
  | 'minorChildren'
  | 'majorChildren'
  | 'caregiver'
>

export type BeneficiaryFileInformation = Pick<
  Beneficiary,
  'status' | 'aidantConnectAuthorized' | 'vulnerablePerson'
> & {
  referents: Pick<
    User,
    'id' | 'firstName' | 'lastName' | 'email' | 'role' | 'status'
  >[]
}

type BeneficiaryDetails = RouterOutput['beneficiary']['getBeneficiaryDetails']
type BeneficiaryHistory = BeneficiaryDetails['beneficiary']['history']

export type GetBeneficiaryOutput = Pick<
  Beneficiary,
  | 'id'
  | 'fileNumber'
  | 'familyFileId'
  | 'structureId'
  | 'additionalInformation'
  | 'createdById'
  | 'created'
  | 'updated'
  | 'status'
  | 'archivedById'
> &
  BeneficiaryFileInformation & {
    general: GetBeneficiaryGeneral
    health: GetBeneficiaryHealth | undefined
    externalOrganisations: GetBeneficiaryExternalOrganisations | undefined
    occupationIncome: GetBeneficiaryOccupationIncome | undefined
    entourages: GetBeneficiaryRelative[] | undefined
    taxHouseholds: GetBeneficiaryTaxHousehold | undefined
    history: BeneficiaryHistory | undefined
  }
