import { UserActivityObject, UserActivityType } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import { addUserActivity } from '~~/server/query/userActivity/addUserActivity'
import type { RevokeMySharingInput } from '~~/server/schema'
import type { DecisionMakerContext } from '~~/server/trpc'
import { notfoundError } from '~~/server/trpc'

/**
 * Renoncement par un décideur à un accès dont il bénéficie.
 *
 * L'autorisation est relue scopée sur le décideur connecté : une ligne
 * appartenant à quelqu'un d'autre est introuvable et la mutation s'arrête. La
 * structure tracée dans le journal vient de la base, jamais de l'entrée.
 *
 * La structure n'est pas prévenue et peut accorder l'accès à nouveau : c'est
 * elle qui reste maîtresse du partage.
 */
export async function revokeMySharing(
  ctx: DecisionMakerContext,
  input: RevokeMySharingInput
) {
  const sharing = await prismaClient.statisticsSharing.findFirst({
    where: {
      id: input.sharingId,
      decisionMakerId: ctx.user.id,
      revokedAt: null
    },
    select: { id: true, structureId: true }
  })

  if (!sharing) {
    throw notfoundError('Statistics sharing not found')
  }

  await prismaClient.statisticsSharing.update({
    where: { id: sharing.id },
    data: { revokedAt: new Date() }
  })

  await addUserActivity({
    key: 'decisionMaker.sharing.revoke',
    user: ctx.user,
    object: UserActivityObject.Structure,
    objectId: sharing.structureId,
    activity: UserActivityType.UPDATE
  })

  return { revoked: true }
}
