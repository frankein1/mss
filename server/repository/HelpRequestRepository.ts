import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee, hasAllowedRole } from '~/server/security'

const tableConstraints = (user: SecurityRuleGrantee) => {
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

function systemFindMany<T extends Prisma.HelpRequestFindManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  return prismaClient.helpRequest.findMany(params)
}

function findMany<T extends Prisma.HelpRequestFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, tableConstraints(user))
  return prismaClient.helpRequest.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.HelpRequestFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, tableConstraints(user))
  return prismaClient.helpRequest.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.HelpRequestCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, tableConstraints(user))
  return prismaClient.helpRequest.count(params)
}

function aggregate<T extends Prisma.HelpRequestAggregateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.Subset<T, Prisma.HelpRequestAggregateArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, tableConstraints(user))
  return prismaClient.helpRequest.aggregate(params)
}

function create(
  _user: SecurityRuleGrantee,
  params: Prisma.HelpRequestCreateArgs
) {
  return prismaClient.helpRequest.create(params)
}

function update<T extends Prisma.HelpRequestUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestUpdateArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, tableConstraints(user))
  return prismaClient.helpRequest.update(params)
}

function deleteEntity(
  user: SecurityRuleGrantee,
  params: Prisma.HelpRequestDeleteArgs
) {
  const { where } = params
  params.where = Object.assign(where || {}, tableConstraints(user))
  return prismaClient.helpRequest.delete(params)
}

export const HelpRequestRepo = {
  aggregate,
  systemFindMany,
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  count,
  update
}
