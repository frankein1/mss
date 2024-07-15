import { defineEventHandler } from 'h3'
import { StructureRepo } from '~/server/database'
import apiTokenMiddleware from '~/server/utils/apiTokenMiddleware'

export default defineEventHandler({
  onRequest: [apiTokenMiddleware],
  handler: async () => {
    return await StructureRepo.prisma.findMany({
      where: {
        disabled: false
      },
      select: {
        id: true,
        siret: true,
        type: true,
        name: true,
        zipcode: true,
        city: true,
        address: true
      },
      orderBy: [{ name: 'desc' }]
    })
  }
})
