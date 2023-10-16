import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// structureId: user.structureId || '',

function systemFindMany<T extends Prisma.HelpRequestFindManyArgs>(
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  return prismaClient.helpRequest.findMany(params)
}

function findMany<T extends Prisma.HelpRequestFindManyArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindManyArgs>
) {
  return prismaClient.helpRequest.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.HelpRequestFindUniqueOrThrowArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.HelpRequestFindUniqueOrThrowArgs>
) {
  return prismaClient.helpRequest.findUniqueOrThrow(params)
}

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
function count(
  _user: SecurityRuleGrantee,
  params: Prisma.HelpRequestCountArgs
) {
  return prismaClient.helpRequest.count(params)
}

function aggregate<T extends Prisma.HelpRequestAggregateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.Subset<T, Prisma.HelpRequestAggregateArgs>
) {
  return prismaClient.helpRequest.aggregate(params)
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
