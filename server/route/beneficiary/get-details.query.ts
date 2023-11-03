import type { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { getBeneficiaryWithRelations } from '~/server/query/beneficiaires'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canViewBeneficiary
} from '~/server/security/rules'
import { getBeneficiaryAccessibleData } from '~/server/route/beneficiary/helper/getBeneficiaryAccessibleData'
import { IdInput, idSchema } from '~/server/schema'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { FollowupRepo, HelpRequestRepo } from '~/server/database'
import { FollowupTypeIdAndName } from '~/types/followupType'
import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'

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

  return canViewBeneficiary(grantee, beneficiary)
}

const handler = async ({
  input,
  ctx
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx
  const beneficiary = await getBeneficiaryWithRelations(user, input.id)

  const beneficiaryData = getBeneficiaryAccessibleData(ctx, beneficiary)

  const followupTypes = await getFollowupTypes(user, input.id)

  return { ...beneficiaryData, followupTypes }
}

export type GetBeneficiaryOutput = Prisma.PromiseReturnType<
  typeof handler
>['beneficiary']

export type GetBeneficiaryFollowupTypesOutput = Prisma.PromiseReturnType<
  typeof handler
>['followupTypes']

export const getBeneficiaryDetailsQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
