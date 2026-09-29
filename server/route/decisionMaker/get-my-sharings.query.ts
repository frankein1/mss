import { prismaClient } from '~~/server/prisma'
import type { DecisionMakerContext } from '~~/server/trpc'

const sharingSelect = {
  id: true,
  createdAt: true,
  revokedAt: true,
  structure: {
    select: { id: true, name: true, type: true, city: true, zipcode: true }
  },
  createdBy: { select: { firstName: true, lastName: true } }
} as const

/**
 * Autorisations de partage dont ce décideur bénéficie, actives et révoquées.
 *
 * Distincte de `getAuthorizedStructures`, qui ne sert qu'à alimenter le filtre
 * des statistiques et n'a pas à exposer qui a accordé quoi ni quand.
 *
 * Les actives reprennent les mêmes conditions que `getAuthorizedStructureIds`,
 * seule source du périmètre : non révoquée, non expirée, structure active.
 * Une structure désactivée n'apparaît donc dans aucun des deux blocs — voir le
 * mémo « gestion des structures supprimées » de la maquette.
 */
export async function getMySharings(ctx: DecisionMakerContext) {
  const now = new Date()

  const [active, revoked] = await Promise.all([
    prismaClient.statisticsSharing.findMany({
      where: {
        decisionMakerId: ctx.user.id,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        structure: { disabled: false }
      },
      select: sharingSelect,
      orderBy: { structure: { name: 'asc' } }
    }),
    prismaClient.statisticsSharing.findMany({
      where: {
        decisionMakerId: ctx.user.id,
        revokedAt: { not: null }
      },
      select: sharingSelect,
      orderBy: { revokedAt: 'desc' }
    })
  ])

  return { active, revoked }
}
