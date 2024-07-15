import { defineEventHandler } from 'h3'
import { StructureRepo } from '~/server/database'
import apiTokenMiddleware from '~/server/utils/apiTokenMiddleware'

export default defineEventHandler({
  onRequest: [apiTokenMiddleware],
  handler: async () => {
    const structures = await StructureRepo.prisma.findMany({
      where: {
        disabled: false
      },
      select: {
        id: true,
        name: true,
        zipcode: true,
        _count: {
          select: { users: true, socialSupports: true }
        }
      },
      orderBy: [{ name: 'desc' }]
    })

    return structures.map(s => ({
      id: s.id,
      nom: s.name,
      codePostal: s.zipcode,
      utilisateurs: s._count.users,
      accompagnements: s._count.socialSupports
    }))
  }
})
