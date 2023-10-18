import { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from '../constraints'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// READ

function findMany<T extends Prisma.BeneficiaryFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryFindManyArgs>
) {
  BeneficiaryConstraints.append(user, params)
  return prismaClient.beneficiary.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.BeneficiaryFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryFindUniqueOrThrowArgs>
) {
  BeneficiaryConstraints.append(user, params)
  return prismaClient.beneficiary.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.BeneficiaryCountArgs) {
  BeneficiaryConstraints.append(user, params)
  return prismaClient.beneficiary.count(params)
}

// CREATE / UPDATE / DELETE

function create(
  _user: SecurityRuleGrantee,
  params: Prisma.BeneficiaryCreateArgs
) {
  return prismaClient.beneficiary.create(params)
}

function update<T extends Prisma.BeneficiaryUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryUpdateArgs>
) {
  return prismaClient.beneficiary.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.BeneficiaryDeleteArgs
) {
  return prismaClient.beneficiary.delete(params)
}

export const BeneficiaryRepo = {
  findMany,
  findUniqueOrThrow,
  count,
  groupBy: prismaClient.beneficiary.groupBy,
  create,
  deleteEntity,
  update
}
