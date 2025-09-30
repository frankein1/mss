import { defineEventHandler } from 'h3'
import { StructureRepo } from '~/server/database'
import apiTokenMiddleware from '~/server/utils/apiTokenMiddleware'
import dayjs from 'dayjs'

function isActiveSinceNDays(date: Date | null, nDays: number) {
  return !!date && dayjs(date).add(nDays, 'days').isAfter(dayjs())
}

export default defineEventHandler({
  onRequest: [apiTokenMiddleware],
  handler: async () => {
    const structures = await StructureRepo.prisma.findMany({
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

    return structures.map(s => ({
      id: s.id,
      nom: s.name,
      siret: s.siret?.trim(),
      codePostal: s.zipcode.trim(),
      ville: s.city.trim(),
      utilisateurs: s._count.users,
      accompagnements: s._count.socialSupports,
      metrics: {
        tu: s._count.users,
        yau: s.users.filter(u => isActiveSinceNDays(u.lastAccess, 365)).length,
        mau: s.users.filter(u => isActiveSinceNDays(u.lastAccess, 30)).length,
        wau: s.users.filter(u => isActiveSinceNDays(u.lastAccess, 7)).length
      }
    }))
  }
})
