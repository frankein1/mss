import { Beneficiary, BeneficiaryRelative, User } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  BeneficiaryEditPermission,
  SecurityRuleGrantee,
  canViewBeneficiaryGeneral,
  getBeneficiaryEditPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { findBeneficiary, getBeneficiarySecurityTarget } from '~/server/query'
import { FollowupRepo, HelpRequestRepo } from '~/server/database'
import { FollowupTypeIdAndName } from '~/types/followupType'
import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'

export type GetBeneficiaryHealth = Pick<
  Beneficiary,
  | 'gir'
  | 'doctor'
  | 'healthAdditionalInformation'
  | 'insurance'
  | 'socialSecurityNumber'
>

export type GetBeneficiaryMeta = Pick<
  Beneficiary,
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
}

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
  | 'noPhone'
  | 'phone1'
  | 'phone2'
  | 'email'
  | 'caregiver'
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
> & {
  linkedBeneficiary: Pick<
    Beneficiary,
    | 'firstName'
    | 'email'
    | 'title'
    | 'usualName'
    | 'phone1'
    | 'birthDate'
    | 'id'
  > | null
}

export type GetBeneficiaryTaxHousehold = Pick<
  Beneficiary,
  'familySituation' | 'minorChildren' | 'majorChildren'
> & {
  taxHouseholds?: GetBeneficiaryRelative[]
}

export type GetBeneficiaryOutput = {
  id: string
  meta: GetBeneficiaryMeta
  general: GetBeneficiaryGeneral
  health: GetBeneficiaryHealth | undefined
  externalOrganisations: GetBeneficiaryExternalOrganisations | undefined
  occupationIncome: GetBeneficiaryOccupationIncome | undefined
  entourages: GetBeneficiaryRelative[] | undefined
  taxHouseholds: GetBeneficiaryTaxHousehold | undefined
}

export type GetBeneficiaryFollowupTypes = FollowupTypeIdAndName[]

async function getFollowupFollowupTypes(
  user: SecurityRuleGrantee,
  beneficiaryId: string
) {
  const followupWithFollowupTypes = await FollowupRepo.findMany(user, {
    where: {
      beneficiaryId
    },
    select: {
      types: {
        select: { id: true, name: true },
        distinct: ['id'],
        orderBy: { name: 'asc' }
      }
    }
  })

  const followupFollowupTypes = followupWithFollowupTypes.reduce(
    (followupFollowupTypes, { types }) => {
      return [...followupFollowupTypes, ...types]
    },
    [] as FollowupTypeIdAndName[]
  )

  return followupFollowupTypes.reduce((types, type) => {
    const isAlreadyAdded = types.some(({ id }) => type.id === id)
    if (isAlreadyAdded) {
      return types
    }
    return [...types, type]
  }, [] as FollowupTypeIdAndName[])
}

async function getHelpRequestFollowupTypes(
  user: SecurityRuleGrantee,
  beneficiaryId: string
) {
  const helpRequestWithFollowupTypes = await HelpRequestRepo.findMany(user, {
    where: {
      beneficiaryId
    },
    select: {
      type: { select: { id: true, name: true } }
    },
    orderBy: { type: { name: 'asc' } }
  })

  return helpRequestWithFollowupTypes.reduce((types, { type }) => {
    const isAlreadyAdded = types.some(({ id }) => type.id === id)
    if (isAlreadyAdded) {
      return types
    }

    return [...types, type]
  }, [] as FollowupTypeIdAndName[])
}

async function getFollowupTypes(
  user: SecurityRuleGrantee,
  beneficiaryId: string
) {
  const [followupFollowupTypes, helpRequestFollowupTypes] = await Promise.all([
    getFollowupFollowupTypes(user, beneficiaryId),
    getHelpRequestFollowupTypes(user, beneficiaryId)
  ])

  const beneficiaryFollowupTypes = [...followupFollowupTypes]
  helpRequestFollowupTypes.forEach(type => {
    const isAlreadyAdded = beneficiaryFollowupTypes.some(
      ({ id }) => type.id === id
    )
    if (!isAlreadyAdded) {
      beneficiaryFollowupTypes.push(type)
    }
  })

  return beneficiaryFollowupTypes.sort(sortFollowupTypesByName)
}

const securityCheck = async (grantee: SecurityRuleGrantee, input: IdInput) => {
  const beneficiary = await getBeneficiarySecurityTarget(grantee, input.id)

  return canViewBeneficiaryGeneral(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx

  const target = await getBeneficiarySecurityTarget(user, input.id)

  const permissions: BeneficiaryEditPermission = getBeneficiaryEditPermissions({
    user,
    target,
    structure
  })
  const beneficiary: GetBeneficiaryOutput = await findBeneficiary({
    user,
    structure,
    id: input.id
  })

  const followupTypes = await getFollowupTypes(user, input.id)

  return { beneficiary, followupTypes, permissions }
}

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
