import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

const userConstraints = (user: SecurityRuleGrantee) => {
  return { createdById: user.id }
}

function findUniqueOrThrow<T extends Prisma.DraftFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.draft.findUniqueOrThrow(params)
}

function create(_user: SecurityRuleGrantee, params: Prisma.DraftCreateArgs) {
  return prismaClient.draft.create(params)
}

function update<T extends Prisma.DraftUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftUpdateArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.draft.update(params)
}

function deleteEntity(
  user: SecurityRuleGrantee,
  params: Prisma.DraftDeleteArgs
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.draft.delete(params)
}

export const DraftRepo = {
  findUniqueOrThrow,
  create,
  deleteEntity,
  update
}
