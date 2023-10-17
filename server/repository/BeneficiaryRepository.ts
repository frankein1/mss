import { Prisma } from '@prisma/client'
import { getConstraintOnBeneficiary } from './constraints/getConstraintOnBeneficiary'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

const viewConstraints = (user: SecurityRuleGrantee) =>
  getConstraintOnBeneficiary(user)

// READ

function findMany<T extends Prisma.BeneficiaryFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, viewConstraints(user))
  return prismaClient.beneficiary.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.BeneficiaryFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.BeneficiaryFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, viewConstraints(user))
  return prismaClient.beneficiary.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.BeneficiaryCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, viewConstraints(user))
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
