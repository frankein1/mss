import type { Prisma } from '@prisma/client'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

function findMany<T extends Prisma.DataInclusionStructureV1FindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DataInclusionStructureV1FindManyArgs>
) {
  return prismaClient.dataInclusionStructureV1.findMany(params)
}

export const DataInclusionStructureV1Repo = {
  findMany,
  prisma: {
    create: prismaClient.dataInclusionStructureV1.create,
    findFirst: prismaClient.dataInclusionStructureV1.findFirst,
    update: prismaClient.dataInclusionStructureV1.update,
    count: prismaClient.dataInclusionStructureV1.count
  }
}
