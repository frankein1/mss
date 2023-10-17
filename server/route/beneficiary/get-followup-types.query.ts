import type { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewBeneficiary
} from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'
import type { FollowupTypeIdAndName } from '~/types/followupType'
import { IdInput, idSchema } from '~/server/schema'
import { FollowupRepo, HelpRequestRepo } from '~/server/database'

async function getFollowupFollowupTypes(
  user: SecurityRuleGrantee,
  beneficiaryId: string,
  structureId: string,
  legallyRequired: boolean
) {
  const followupWithFollowupTypes = await FollowupRepo.findMany(user, {
    where: {
      beneficiaryId,
      structureId,
      types: { some: { legallyRequired } }
    },
    select: {
      types: {
        select: { id: true, name: true },
        distinct: ['id'],
        orderBy: { name: 'asc' },
        where: { legallyRequired }
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
  beneficiaryId: string,
  structureId: string,
  legallyRequired: boolean
) {
  const helpRequestWithFollowupTypes = await HelpRequestRepo.findMany(user, {
    where: {
      beneficiaryId,
      structureId,
      type: { legallyRequired }
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
  beneficiaryId: string,
  structureId: string,
  legallyRequired: boolean
) {
  const [followupFollowupTypes, helpRequestFollowupTypes] = await Promise.all([
    getFollowupFollowupTypes(user, beneficiaryId, structureId, legallyRequired),
    getHelpRequestFollowupTypes(
      user,
      beneficiaryId,
      structureId,
      legallyRequired
    )
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
  return canViewBeneficiary(grantee, beneficiary)
}

const handler = async ({
  input: { id: beneficiaryId },
  ctx: { user, structure }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiaryLegallyRequiredFollowupTypes = await getFollowupTypes(
    user,
    beneficiaryId,
    structure.id,
    true
  )
  const beneficiaryLegallyNotRequiredFollowupTypes = await getFollowupTypes(
    user,
    beneficiaryId,
    structure.id,
    false
  )

  return [
    ...beneficiaryLegallyRequiredFollowupTypes,
    ...beneficiaryLegallyNotRequiredFollowupTypes
  ]
}

export type GetBeneficiaryFollowupTypesOutput = Prisma.PromiseReturnType<
  typeof handler
>

export const getBeneficiaryFollowupTypesQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
