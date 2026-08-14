import type { Prisma } from '@prisma/client'
import { FamilyFileConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

// READ

function findMany<T extends Prisma.FamilyFileFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FamilyFileFindManyArgs>
) {
  appendConstraints(user, params, FamilyFileConstraints.get)
  return prismaClient.familyFile.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.FamilyFileFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FamilyFileFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, FamilyFileConstraints.get)
  return prismaClient.familyFile.findUniqueOrThrow(params)
}

function update<T extends Prisma.FamilyFileUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FamilyFileUpdateArgs>
) {
  appendConstraints(user, params, FamilyFileConstraints.update)
  return prismaClient.familyFile.update(params)
}

function deleteWithConstraints<T extends Prisma.FamilyFileDeleteArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FamilyFileDeleteArgs>
) {
  appendConstraints(user, params, FamilyFileConstraints.delete)
  return prismaClient.familyFile.delete(params)
}

export const FamilyFileRepo = {
  findMany,
  findUniqueOrThrow,
  update,
  delete: deleteWithConstraints,
  prisma: {
    update: prismaClient.familyFile.update,
    create: prismaClient.familyFile.create,
    delete: prismaClient.familyFile.delete,
    deleteMany: prismaClient.familyFile.deleteMany
  }
}
