import { prismaClient } from '~~/server/prisma'

/**
 * Structures qu'un décideur est autorisé à consulter.
 *
 * C'est l'unique source du périmètre d'un décideur : elle est lue en base à
 * chaque requête et ne doit jamais provenir d'une entrée client. Un filtre
 * côté interface ne peut que restreindre cette liste, jamais l'élargir.
 *
 * Une autorisation compte si elle n'est ni révoquée, ni expirée, et si la
 * structure qui partage est toujours active.
 */
export async function getAuthorizedStructureIds(decisionMakerId: string) {
  const now = new Date()

  const sharings = await prismaClient.statisticsSharing.findMany({
    where: {
      decisionMakerId,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      structure: { disabled: false }
    },
    select: { structureId: true }
  })

  return sharings.map(sharing => sharing.structureId)
}
