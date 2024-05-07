import { prismaClient } from '~/server/prisma'

export const DataInclusionStructureRepo = {
  prisma: {
    create: prismaClient.dataInclusionStructure.create,
    findFirst: prismaClient.dataInclusionStructure.findFirst,
    update: prismaClient.dataInclusionStructure.update,
    count: prismaClient.dataInclusionStructure.count
  }
}
