import { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from '../constraints'
import { appendConstraints } from './helper/appendConstraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

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

export const BeneficiaryRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  prisma: {
    groupBy: prismaClient.beneficiary.groupBy,
    create: prismaClient.beneficiary.create,
    update: prismaClient.beneficiary.update,
    delete: prismaClient.beneficiary.delete
  }
}
