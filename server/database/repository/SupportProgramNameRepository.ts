import type { Prisma } from '@prisma/client'
import { SupportProgramNameConstraints } from '../constraints'
import {
  appendConstraints,
  appendCreateConstraints
} from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'

function findMany<T extends Prisma.SupportProgramNameFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramNameFindManyArgs>
) {
  appendConstraints(user, params, SupportProgramNameConstraints.get)
  return prismaClient.supportProgramName.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.SupportProgramNameFindUniqueArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramNameFindUniqueArgs>
) {
  appendConstraints(user, params, SupportProgramNameConstraints.get)
  return prismaClient.supportProgramName.findUniqueOrThrow(params)
}

function create<T extends Prisma.SupportProgramNameCreateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramNameCreateArgs>
) {
  appendCreateConstraints(user, params, SupportProgramNameConstraints.create)
  return prismaClient.supportProgramName.create(params)
}

function update<T extends Prisma.SupportProgramNameUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramNameUpdateArgs>
) {
  appendConstraints(user, params, SupportProgramNameConstraints.update)
  return prismaClient.supportProgramName.update(params)
}

function deleteOne<T extends Prisma.SupportProgramNameDeleteArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.SupportProgramNameDeleteArgs>
) {
  appendConstraints(user, params, SupportProgramNameConstraints.delete)
  return prismaClient.supportProgramName.delete(params)
}

function count(
  user: SecurityRuleGrantee,
  params: Prisma.SupportProgramNameCountArgs
) {
  appendConstraints(user, params, SupportProgramNameConstraints.get)
  return prismaClient.supportProgramName.count(params)
}

export const SupportProgramNameRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  update,
  delete: deleteOne,
  count,
  prisma: prismaClient.supportProgramName
}
