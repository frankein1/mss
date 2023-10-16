import { Prisma } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee, hasAllowedRole } from '~/server/security'

const viewConstraints = (user: SecurityRuleGrantee) => {
  const where = {}
  if (hasAllowedRole(user, ['Administrator'])) {
    return where
  }
  // SAME STRUCTURE
  Object.assign(where, { structureId: user.structureId })

  // REFERENT CASE
  if (hasAllowedRole(user, ['Referent'])) {
    Object.assign(where, { referents: { some: { id: user.id } } })
  }
  return where
}

// VIEW

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
  create,
  deleteEntity,
  count,
  update
}
