import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.DocumentFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindManyArgs>
) {
  return prismaClient.document.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.DocumentFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindUniqueOrThrowArgs>
) {
  return prismaClient.document.findUniqueOrThrow(params)
}

function create(_user: SecurityRuleGrantee, params: Prisma.DocumentCreateArgs) {
  return prismaClient.document.create(params)
}

function update<T extends Prisma.DocumentUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentUpdateArgs>
) {
  return prismaClient.document.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.DocumentDeleteArgs
) {
  return prismaClient.document.delete(params)
}

function count(_user: SecurityRuleGrantee, params: Prisma.DocumentCountArgs) {
  return prismaClient.document.count(params)
}

export const DocumentRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  update,
  count
}
