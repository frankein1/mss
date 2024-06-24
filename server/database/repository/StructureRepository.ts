import { Prisma } from '@prisma/client'
import { StructureConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.StructureFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureFindManyArgs>
) {
  appendConstraints(user, params, StructureConstraints.get)

  return prismaClient.structure.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.StructureFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.StructureFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, StructureConstraints.get)
  return prismaClient.structure.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.StructureCountArgs) {
  appendConstraints(user, params, StructureConstraints.get)
  return prismaClient.structure.count(params)
}

export const StructureRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  prisma: {
    findMany: prismaClient.structure.findMany,
    create: prismaClient.structure.create,
    update: prismaClient.structure.update,
    updateMany: prismaClient.structure.updateMany,
    delete: prismaClient.structure.delete
  }
}
