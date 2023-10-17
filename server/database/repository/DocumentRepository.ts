import { Prisma } from '@prisma/client'
import { getConstraintOnDocument } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findMany<T extends Prisma.DocumentFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnDocument(user))
  return prismaClient.document.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.DocumentFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnDocument(user))
  return prismaClient.document.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.DocumentCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnDocument(user))
  return prismaClient.document.count(params)
}

// CREATE / UPDATE / DELETE

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

export const DocumentRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  update,
  count
}
