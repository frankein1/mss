import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canOnlyListItsUploadedDocuments
} from '~/server/security'

function userConstraints(user: SecurityRuleGrantee) {
  if (canOnlyListItsUploadedDocuments(user)) {
    return { createdById: user.id }
  }

  return {
    OR: [{ confidential: false }, { confidential: true, createdById: user.id }]
  }
}

function findMany<T extends Prisma.DocumentFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.document.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.DocumentFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.document.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.DocumentCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.document.count(params)
}

function create(_user: SecurityRuleGrantee, params: Prisma.DocumentCreateArgs) {
  return prismaClient.document.create(params)
}

function update<T extends Prisma.DocumentUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentUpdateArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.document.update(params)
}

function deleteEntity(
  user: SecurityRuleGrantee,
  params: Prisma.DocumentDeleteArgs
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
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
