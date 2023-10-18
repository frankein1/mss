import { Prisma } from '@prisma/client'
import { DocumentConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.DocumentFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindManyArgs>
) {
  appendConstraints(user, params, DocumentConstraints)
  return prismaClient.document.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.DocumentFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, DocumentConstraints)
  return prismaClient.document.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.DocumentCountArgs) {
  appendConstraints(user, params, DocumentConstraints)
  return prismaClient.document.count(params)
}

export const DocumentRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  prisma: {
    create: prismaClient.document.create,
    delete: prismaClient.document.delete,
    update: prismaClient.document.update
  }
}
