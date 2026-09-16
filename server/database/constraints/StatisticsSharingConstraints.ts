import type { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin, isDecisionMaker } from '~~/server/security/rules/helpers'

/**
 * Une autorisation de partage se lit depuis deux côtés :
 * - la structure qui partage ne voit que ses propres autorisations ;
 * - le décideur ne voit que celles qui le désignent.
 */
const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.StatisticsSharingWhereInput = {}

  if (isAdmin(user)) {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'statistics-sharing-constraints: not implemented for admin'
    })
  }

  if (isDecisionMaker(user)) {
    Object.assign<
      Prisma.StatisticsSharingWhereInput,
      Prisma.StatisticsSharingWhereInput
    >(where, { decisionMakerId: user.id })
    return where
  }

  if (!user.structureId) {
    throw new Error('statistics-sharing-constraints: missing structure id')
  }

  Object.assign<
    Prisma.StatisticsSharingWhereInput,
    Prisma.StatisticsSharingWhereInput
  >(where, { structureId: user.structureId })
  return where
}

const create = (user: SecurityRuleGrantee) => {
  const data: Partial<Prisma.StatisticsSharingCreateInput> = {}

  if (isAdmin(user) || isDecisionMaker(user)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message:
        'statistics-sharing-constraints: only a structure member can share'
    })
  }

  if (!user.structureId) {
    throw new Error('statistics-sharing-constraints: missing structure id')
  }

  Object.assign<
    Partial<Prisma.StatisticsSharingCreateInput>,
    Partial<Prisma.StatisticsSharingCreateInput>
  >(data, {
    structure: { connect: { id: user.structureId } },
    createdBy: { connect: { id: user.id } }
  })
  return data
}

export const StatisticsSharingConstraints = {
  get,
  create,
  // L'autorisation d'agir est vérifiée dans le securityCheck des routes
  update: get,
  delete: get
}
