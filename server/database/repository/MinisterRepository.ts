import type { Prisma } from '@prisma/client'
import {
  appendConstraints,
  appendCreateConstraints
} from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import type { SecurityRuleGrantee } from '~/server/security'
import { MinisterConstraints } from '../constraints/MinisterConstraints'

function findMany<T extends Prisma.MinisterEntityFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.MinisterEntityFindManyArgs>
) {
  appendConstraints(user, params, MinisterConstraints.get)
  return prismaClient.ministerEntity.findMany(params)
}

function findUnique<T extends Prisma.MinisterEntityFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.MinisterEntityFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, MinisterConstraints.get)
  return prismaClient.ministerEntity.findUnique(params)
}

function update<T extends Prisma.MinisterEntityUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.MinisterEntityUpdateArgs>
) {
  appendConstraints(user, params, MinisterConstraints.update)
  return prismaClient.ministerEntity.update(params)
}

function create<T extends Prisma.MinisterEntityCreateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.MinisterEntityCreateArgs>
) {
  appendCreateConstraints(user, params, MinisterConstraints.create)
  return prismaClient.ministerEntity.create(params)
}

export const MinisterRepo = {
  prisma: {
    //
  },
  findMany,
  findUnique,
  update,
  create
}
