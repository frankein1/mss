import { Prisma } from '@prisma/client'
import { getConstraintOnHelpRequest } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// SYSTEM

function systemFindMany<T extends Prisma.HelpRequestFindManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  return prismaClient.helpRequest.findMany(params)
}

// VIEW

function findMany<T extends Prisma.HelpRequestFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnHelpRequest(user))
  return prismaClient.helpRequest.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.HelpRequestFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnHelpRequest(user))
  return prismaClient.helpRequest.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.HelpRequestCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnHelpRequest(user))
  return prismaClient.helpRequest.count(params)
}

function aggregate<T extends Prisma.HelpRequestAggregateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.Subset<T, Prisma.HelpRequestAggregateArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnHelpRequest(user))
  return prismaClient.helpRequest.aggregate(params)
}

// CREATE / UPDATE / DELETE

function create(
  _user: SecurityRuleGrantee,
  params: Prisma.HelpRequestCreateArgs
) {
  return prismaClient.helpRequest.create(params)
}

function update<T extends Prisma.HelpRequestUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestUpdateArgs>
) {
  return prismaClient.helpRequest.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.HelpRequestDeleteArgs
) {
  return prismaClient.helpRequest.delete(params)
}

export const HelpRequestRepo = {
  aggregate,
  systemFindMany,
  findMany,
  findUniqueOrThrow,
  create,
  groupBy: prismaClient.helpRequest.groupBy,
  deleteEntity,
  count,
  update
}
