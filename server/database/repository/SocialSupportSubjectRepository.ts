import type { Prisma } from '@prisma/client'
import { SocialSupportSubjectConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

// VIEW

function findMany<T extends Prisma.SocialSupportSubjectFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportSubjectFindManyArgs>
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.get)
  return prismaClient.socialSupportSubject.findMany(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SocialSupportSubjectCountArgs
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.get)
  return prismaClient.socialSupportSubject.count(params)
}

function findUniqueOrThrow<
  T extends Prisma.SocialSupportSubjectFindUniqueOrThrowArgs
>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<
    T,
    Prisma.SocialSupportSubjectFindUniqueOrThrowArgs
  >
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.get)
  return prismaClient.socialSupportSubject.findUniqueOrThrow(params)
}

function update<T extends Prisma.SocialSupportSubjectUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportSubjectUpdateArgs>
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.update)
  return prismaClient.socialSupportSubject.update(params)
}

function updateMany<T extends Prisma.SocialSupportSubjectUpdateManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SocialSupportSubjectUpdateManyArgs>
) {
  appendConstraints(user, params, SocialSupportSubjectConstraints.update)
  return prismaClient.socialSupportSubject.updateMany(params)
}

export const SocialSupportSubjectRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  update,
  updateMany,
  prisma: {
    create: prismaClient.socialSupportSubject.create,
    createMany: prismaClient.socialSupportSubject.createMany,
    delete: prismaClient.socialSupportSubject.delete,
    deleteMany: prismaClient.socialSupportSubject.deleteMany,
    findMany: prismaClient.socialSupportSubject.findMany,
    groupBy: prismaClient.socialSupportSubject.groupBy
  }
}
