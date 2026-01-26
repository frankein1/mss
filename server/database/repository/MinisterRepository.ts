import type { Prisma } from '@prisma/client'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'
import { MinisterConstraints } from '../constraints/MinisterConstraints'

function findMany<T extends Prisma.MinisterEntityFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.MinisterEntityFindManyArgs>
) {
  appendConstraints(user, params, MinisterConstraints.get)
  return prismaClient.ministerEntity.findMany(params)
}

function findUnique<T extends Prisma.MinisterEntityFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.MinisterEntityFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, MinisterConstraints.get)
  return prismaClient.ministerEntity.findUnique(params)
}

export const MinisterRepo = {
  prisma: {
    update: prismaClient.ministerEntity.update,
    findUniqueOrThrow: prismaClient.ministerEntity.findUniqueOrThrow,
    create: prismaClient.ministerEntity.create,
    findMany: prismaClient.ministerEntity.findMany
  },
  findMany,
  findUnique
}
