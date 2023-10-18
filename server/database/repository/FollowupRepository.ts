import { Prisma } from '@prisma/client'
import { FollowupConstraints } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// SYSTEM
function systemFindMany<T extends Prisma.FollowupFindManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.FollowupFindManyArgs>
) {
  return prismaClient.followup.findMany(params)
}

// VIEW

function findMany<T extends Prisma.FollowupFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupFindManyArgs>
) {
  FollowupConstraints.append(user, params)
  return prismaClient.followup.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.FollowupFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupFindUniqueOrThrowArgs>
) {
  FollowupConstraints.append(user, params)
  return prismaClient.followup.findUniqueOrThrow(params)
}

// CREATE / UPDATE / DELETE

function create(_user: SecurityRuleGrantee, params: Prisma.FollowupCreateArgs) {
  return prismaClient.followup.create(params)
}

function update<T extends Prisma.FollowupUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.FollowupUpdateArgs>
) {
  return prismaClient.followup.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.FollowupDeleteArgs
) {
  return prismaClient.followup.delete(params)
}
function count(_user: SecurityRuleGrantee, params: Prisma.FollowupCountArgs) {
  return prismaClient.followup.count(params)
}

export const FollowupRepo = {
  systemFindMany,
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  count,
  update,
  groupBy: prismaClient.followup.groupBy
}
