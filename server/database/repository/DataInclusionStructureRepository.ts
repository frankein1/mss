import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.DataInclusionStructureFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DataInclusionStructureFindManyArgs>
) {
  return prismaClient.dataInclusionStructure.findMany(params)
}

export const DataInclusionStructureRepo = {
  findMany,
  prisma: {
    create: prismaClient.dataInclusionStructure.create,
    findFirst: prismaClient.dataInclusionStructure.findFirst,
    update: prismaClient.dataInclusionStructure.update,
    count: prismaClient.dataInclusionStructure.count
  }
}
