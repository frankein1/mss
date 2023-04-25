import { AppContext, invalidError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { getUserDisplayName } from '~/utils/user'

export const getAgentsHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  if (!user) {
    throw invalidError('SessionUser is null')
  }
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.user
    .findMany({
      where: {
        role: { not: 'Administrator' },
        structureId: user.structureId
      },
      orderBy: { lastName: 'asc' }
    })
    .then(agents =>
      agents.map(user => ({
        id: user.id,
        name: getUserDisplayName(user),
        status: user.status
      }))
    )
}

export const getBeneficiariesCitiesHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  if (!user) {
    throw invalidError('SessionUser is null')
  }
  return await prismaClient.beneficiary.groupBy({
    by: ['city'],
    where: {
      city: { not: null }
    },
    orderBy: [{ city: 'asc' }]
  })
}

export const getStructureFollowupTypesHandler = async ({
  ctx: { user }
}: {
  ctx: AppContext
}) => {
  if (!user) {
    throw invalidError('SessionUser is null')
  }
  if (!user.structureId) {
    throw invalidError('structureId is null')
  }
  return await prismaClient.followupType.findMany({
    where: {
      ownedByStructureId: user.structureId
    },
    orderBy: [{ name: 'asc' }]
  })
}
