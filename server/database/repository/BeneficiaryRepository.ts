import type { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from '../constraints'
import {
  appendConstraints,
  appendCreateConstraints
} from './helper/appendConstraints'
import { prismaClient } from '~~/server/prisma'
import type { SecurityRuleGrantee } from '~~/server/security'

// READ

function findMany<T extends Prisma.BeneficiaryFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryFindManyArgs>
) {
  appendConstraints(user, params, BeneficiaryConstraints.get)
  return prismaClient.beneficiary.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.BeneficiaryFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryFindUniqueOrThrowArgs>
) {
  appendConstraints(user, params, BeneficiaryConstraints.get)
  return prismaClient.beneficiary.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.BeneficiaryCountArgs) {
  appendConstraints(user, params, BeneficiaryConstraints.get)

  return prismaClient.beneficiary.count(params)
}

function create<T extends Prisma.BeneficiaryCreateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryCreateArgs>
) {
  appendCreateConstraints(user, params, BeneficiaryConstraints.create)
  return prismaClient.beneficiary.create(params)
}

function update<T extends Prisma.BeneficiaryUpdateArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryUpdateArgs>
) {
  appendConstraints(user, params, BeneficiaryConstraints.update)
  return prismaClient.beneficiary.update(params)
}

export const BeneficiaryRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  create,
  update,
  prisma: {
    count: prismaClient.beneficiary.count,
    groupBy: prismaClient.beneficiary.groupBy,
    create: prismaClient.beneficiary.create,
    update: prismaClient.beneficiary.update,
    updateMany: prismaClient.beneficiary.updateMany,
    delete: prismaClient.beneficiary.delete,
    /** Unwrapped findMany should only be used in operations initiated by the server
    and NOT by a user as no constraints on structure, referents or draft status is included.
    For user-initiated actions, use BeneficiaryRepo.findMany. */
    findMany: prismaClient.beneficiary.findMany,
    findUniqueOrThrow: prismaClient.beneficiary.findUniqueOrThrow
  }
}
