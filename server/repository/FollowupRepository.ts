import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee, hasAllowedRole } from '~/server/security'

const userConstraints = (user: SecurityRuleGrantee) => {
  const where = {}
  if (hasAllowedRole(user, ['Administrator'])) {
    return {}
  }
  // SAME STRUCTURE
  Object.assign(where, { structureId: user.structureId })

  // REFERENT CASE
  if (hasAllowedRole(user, ['Referent'])) {
    Object.assign(where, {
      beneficiary: { referents: { some: { id: user.id } } }
    })
  }
  return where
}

function systemFindMany<T extends Prisma.FollowupFindManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.FollowupFindManyArgs>
) {
  return prismaClient.followup.findMany(params)
}

function findMany<T extends Prisma.FollowupFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.followup.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.FollowupFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.followup.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.FollowupCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.followup.count(params)
}

function create(_user: SecurityRuleGrantee, params: Prisma.FollowupCreateArgs) {
  return prismaClient.followup.create(params)
}

function update<T extends Prisma.FollowupUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupUpdateArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.followup.update(params)
}

function deleteEntity(
  user: SecurityRuleGrantee,
  params: Prisma.FollowupDeleteArgs
) {
  const { where } = params
  params.where = Object.assign(where || {}, userConstraints(user))
  return prismaClient.followup.delete(params)
}

export const FollowupRepo = {
  systemFindMany,
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  count,
  update
}
