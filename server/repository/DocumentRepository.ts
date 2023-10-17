import { Prisma } from '@prisma/client'
import { isAdmin, isReceptionAgent } from '../security/rules/helpers'
import { getConstraintsOnBeneficiary } from './helper/getConstraintOnBeneficiary'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

const viewConstraints = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }

  if (isReceptionAgent(user)) {
    Object.assign(where, { createdById: user.id })
  } else {
    Object.assign(where, {
      OR: [
        { confidential: false },
        { confidential: true, createdById: user.id }
      ]
    })
  }
  // append constraints on beneficiary relation
  Object.assign(where, {
    beneficiary: getConstraintsOnBeneficiary(user)
  })
  return where
}

// VIEW

function findMany<T extends Prisma.DocumentFindManyArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindManyArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, viewConstraints(user))
  return prismaClient.document.findMany(params)
}

function findUniqueOrThrow<T extends Prisma.DocumentFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, viewConstraints(user))
  return prismaClient.document.findUniqueOrThrow(params)
}

function count(user: SecurityRuleGrantee, params: Prisma.DocumentCountArgs) {
  const { where } = params
  params.where = Object.assign(where || {}, viewConstraints(user))
  return prismaClient.document.count(params)
}

// CREATE / UPDATE / DELETE

function create(_user: SecurityRuleGrantee, params: Prisma.DocumentCreateArgs) {
  return prismaClient.document.create(params)
}

function update<T extends Prisma.DocumentUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DocumentUpdateArgs>
) {
  return prismaClient.document.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.DocumentDeleteArgs
) {
  return prismaClient.document.delete(params)
}

export const DocumentRepo = {
  findMany,
  findUniqueOrThrow,
  create,
  deleteEntity,
  update,
  count
}
