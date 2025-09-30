import { defineEventHandler } from 'h3'
import { StructureRepo } from '~/server/database'
import apiTokenMiddleware from '~/server/utils/apiTokenMiddleware'
import dayjs from 'dayjs'

function isActiveSinceNDays(date: Date | null, nDays: number) {
  return !!date && dayjs(date).add(nDays, 'days').isAfter(dayjs())
}

async function getStructures() {
  return await StructureRepo.prisma.findMany({
    relationLoadStrategy: 'query',
    where: {
      disabled: false
    },
    select: {
      id: true,
      name: true,
      siret: true,
      zipcode: true,
      city: true,
      _count: {
        select: { users: true, socialSupports: true }
      },
      users: {
        select: {
          lastAccess: true
        }
      }
    },
    orderBy: [{ name: 'desc' }]
  })
}

type Structure = Awaited<ReturnType<typeof getStructures>>[0]

type Indicateur = {
  id: string
  nom: string
  siret: string | undefined
  codePostal: string
  ville: string
  utilisateurs: number
  accompagnements: number
  metrics: {
    tu: number
    yau: number
    mau: number
    wau: number
  }
}

/** Data corresponding to different structures with same siret are merged and the
 * ids are kept in the field `idsSecondaires`
 */
function mergeSirets(indicateurs: Indicateur[]) {
  const merged: Record<string, Indicateur & { idsSecondaires?: string[] }> = {}

  indicateurs.forEach(indic => {
    const siret = indic.siret

    if (!siret) {
      return
    }

    if (merged[siret] === undefined) {
      merged[siret] = { ...indic }
    } else {
      merged[siret] = {
        ...merged[siret],
        idsSecondaires: [...(merged[siret].idsSecondaires || []), indic.id],
        utilisateurs: merged[siret].utilisateurs + indic.utilisateurs,
        accompagnements: merged[siret].accompagnements + indic.accompagnements,
        metrics: {
          tu: merged[siret].metrics.tu + indic.metrics.tu,
          yau: merged[siret].metrics.yau + indic.metrics.yau,
          mau: merged[siret].metrics.mau + indic.metrics.mau,
          wau: merged[siret].metrics.wau + indic.metrics.wau
        }
      }
    }
  })

  return Object.values(merged)
}

export default defineEventHandler({
  onRequest: [apiTokenMiddleware],
  handler: async () => {
    const structures = await getStructures()

    return mergeSirets(
      structures.map(s => ({
        id: s.id,
        nom: s.name,
        siret: s.siret?.replaceAll(' ', ''),
        codePostal: s.zipcode.trim(),
        ville: s.city.trim(),
        utilisateurs: s._count.users,
        accompagnements: s._count.socialSupports,
        metrics: {
          tu: s._count.users,
          yau: s.users.filter(u => isActiveSinceNDays(u.lastAccess, 365))
            .length,
          mau: s.users.filter(u => isActiveSinceNDays(u.lastAccess, 30)).length,
          wau: s.users.filter(u => isActiveSinceNDays(u.lastAccess, 7)).length
        }
      })) satisfies Indicateur[]
    )
  }
})
