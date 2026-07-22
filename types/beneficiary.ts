import type {
  Beneficiary,
  SupportProgram,
  BeneficiaryRelative,
  RepClassification,
  SchoolStatus,
  SchoolType,
  User,
  UserStatus
} from '@prisma/client'
import type { RouterOutput } from '~/server/trpc/routers'

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
  | 'status'
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
  | 'qpv'
  | 'district'
  | 'noPhone'
  | 'phone1'
  | 'phone2'
  | 'email'
  | 'mobility'
  | 'additionalInformation'
>

export type GetSupportProgramItem = Pick<
  SupportProgram,
  'id' | 'startDate' | 'endDate' | 'exitReason' | 'precisions'
> & {
  supportProgramName: { id: string; name: string }
  partnerOrganisation: { id: string; name: string } | null
}

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

export type GetBeneficiarySupportPrograms = GetSupportProgramItem[]

export type GetBeneficiaryOccupationIncome = Pick<
  Beneficiary,
  | 'socioProfessionalCategory'
  | 'activityStatus'
  | 'contractType'
  | 'schoolClass'
  | 'schoolUai'
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
> & {
  school: {
    uai: string
    name: string
    type: SchoolType
    address: string | null
    city: string
    zipcode: string
    citycode: string
    academy: string
    status: SchoolStatus
    repClassification: RepClassification | null
    qpvCode: string | null
    qpvName: string | null
  } | null
}

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
export type BeneficiarySearchResult = RouterOutput['beneficiary']['search'][0]

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
  | 'lastActivity'
  | 'status'
  | 'relationship'
> &
  BeneficiaryFileInformation & {
    general: GetBeneficiaryGeneral
    health: GetBeneficiaryHealth | undefined
    externalOrganisations: GetBeneficiaryExternalOrganisations | undefined
    supportPrograms: GetBeneficiarySupportPrograms | undefined
    occupationIncome: GetBeneficiaryOccupationIncome | undefined
    entourages: GetBeneficiaryRelative[] | undefined
    taxHouseholds: GetBeneficiaryTaxHousehold | undefined
    history: BeneficiaryHistory | undefined
  }

export type BeneficiaryDetailsOutput =
  RouterOutput['beneficiary']['getBeneficiaryDetails']['beneficiary']
