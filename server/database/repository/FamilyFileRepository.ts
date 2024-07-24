import { Prisma } from '@prisma/client'
import { FamilyFileConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

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

export const FamilyFileRepo = {
  findMany,
  findUniqueOrThrow,
  prisma: {
    update: prismaClient.familyFile.update
  }
}
