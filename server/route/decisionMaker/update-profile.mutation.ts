import { UserActivityObject, UserActivityType } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import { addUserActivity } from '~~/server/query/userActivity/addUserActivity'
import type { UpdateDecisionMakerProfileInput } from '~~/server/schema'
import type { DecisionMakerContext } from '~~/server/trpc'

/**
 * Mise à jour par un décideur de son propre nom et prénom.
 *
 * Le seul compte modifiable est celui du contexte : l'identifiant ne vient
 * jamais de l'entrée. Le schéma n'accepte ni e-mail ni rôle ni structure, donc
 * il n'y a rien d'autre à vérifier ici.
 */
export async function updateMyProfile(
  ctx: DecisionMakerContext,
  input: UpdateDecisionMakerProfileInput
) {
  const user = await prismaClient.user.update({
    where: { id: ctx.user.id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName
    },
    select: { firstName: true, lastName: true, email: true }
  })

  await addUserActivity({
    key: 'decisionMaker.profile.update',
    user: ctx.user,
    object: UserActivityObject.User,
    objectId: ctx.user.id,
    activity: UserActivityType.UPDATE,
    content: input
  })

  return user
}
