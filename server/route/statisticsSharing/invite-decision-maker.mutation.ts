import { UserActivityObject, UserActivityType, UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import {
  inviteDecisionMakerSchema,
  type InviteDecisionMakerInput
} from '~~/server/schema'
import { prismaClient } from '~~/server/prisma'
import { StatisticsSharingRepo } from '~~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

/**
 * Invite un élu / décideur à consulter les statistiques de la structure.
 *
 * Le compte est créé ici s'il n'existe pas encore : MSS refuse toute
 * connexion d'un utilisateur inconnu (voir login-callback), donc l'invitation
 * doit précéder la première connexion ProConnect. Le compte est créé sans
 * structure — elle sera déduite du SIRET ProConnect à la première connexion.
 *
 * L'invitation ne donne aucun accès par elle-même : c'est l'autorisation de
 * partage créée juste après qui définit le périmètre du décideur.
 */
const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: InviteDecisionMakerInput
}) => {
  const existingUser = await prismaClient.user.findUnique({
    where: { email: input.email },
    select: { id: true, role: true }
  })

  if (existingUser && existingUser.role !== UserRole.DecisionMaker) {
    throw new TRPCError({
      code: 'CONFLICT',
      message:
        'statistics-sharing: this email already belongs to a non decision maker account'
    })
  }

  const decisionMaker =
    existingUser ??
    (await prismaClient.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: UserRole.DecisionMaker
      },
      select: { id: true, role: true }
    }))

  const alreadyShared = await StatisticsSharingRepo.findMany(ctx.user, {
    where: { decisionMakerId: decisionMaker.id, revokedAt: null },
    select: { id: true }
  })

  if (alreadyShared.length > 0) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'statistics-sharing: this decision maker is already authorized'
    })
  }

  // structure et createdBy sont aussi injectés par les contraintes du
  // repository ; ils sont répétés ici pour satisfaire le typage de Prisma,
  // comme le fait le reste du code.
  return StatisticsSharingRepo.create(ctx.user, {
    data: {
      decisionMaker: { connect: { id: decisionMaker.id } },
      structure: { connect: { id: ctx.structure.id } },
      createdBy: { connect: { id: ctx.user.id } }
    },
    select: { id: true }
  })
}

export const inviteDecisionMakerMutation = createMutation({
  inputValidation: inviteDecisionMakerSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'statisticsSharing.invite',
    target: UserActivityObject.Structure,
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.CREATE
  }
})
