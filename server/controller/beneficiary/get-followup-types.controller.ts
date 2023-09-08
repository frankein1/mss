import type { Prisma } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { canViewBeneficiary } from '~/server/security/rules'
import { getBeneficiarySecurityTarget } from '~/server/security'
import { prismaClient } from '~/server/prisma'
import { sortFollowupTypesByName } from '~/utils/followupType/sortFollowupTypesByName'
import type { FollowupTypeIdAndName } from '~/types/followupType'

async function getFollowupFollowupTypes(
  beneficiaryId: string,
  structureId: string,
  legallyRequired: boolean
) {
  const followupWithFollowupTypes = await prismaClient.followup.findMany({
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
  beneficiaryId: string,
  structureId: string,
  legallyRequired: boolean
) {
  const helpRequestWithFollowupTypes = await prismaClient.helpRequest.findMany({
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
  beneficiaryId: string,
  structureId: string,
  legallyRequired: boolean
) {
  const [followupFollowupTypes, helpRequestFollowupTypes] = await Promise.all([
    getFollowupFollowupTypes(beneficiaryId, structureId, legallyRequired),
    getHelpRequestFollowupTypes(beneficiaryId, structureId, legallyRequired)
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

export const getBeneficiaryFollowupTypesHandler = async ({
  input: { id: beneficiaryId },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary || !canViewBeneficiary(user, beneficiary)) {
    throw forbiddenError()
  }

  const beneficiaryLegallyRequiredFollowupTypes = await getFollowupTypes(
    beneficiaryId,
    user.structureId,
    true
  )
  const beneficiaryLegallyNotRequiredFollowupTypes = await getFollowupTypes(
    beneficiaryId,
    user.structureId,
    false
  )

  return [
    ...beneficiaryLegallyRequiredFollowupTypes,
    ...beneficiaryLegallyNotRequiredFollowupTypes
  ]
}

export type GetBeneficiaryFollowupTypesOutput = Prisma.PromiseReturnType<
  typeof getBeneficiaryFollowupTypesHandler
>
