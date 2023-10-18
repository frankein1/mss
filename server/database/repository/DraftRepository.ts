import { Prisma } from '@prisma/client'
import { getConstraintOnDraft } from '../constraints/getConstraintOnDraft'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findUniqueOrThrow<T extends Prisma.DraftFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftFindUniqueOrThrowArgs>
) {
  const { where } = params
  params.where = Object.assign(where || {}, getConstraintOnDraft(user))
  return prismaClient.draft.findUniqueOrThrow(params)
}

// CREATE / UPDATE / DELETE

function create(_user: SecurityRuleGrantee, params: Prisma.DraftCreateArgs) {
  return prismaClient.draft.create(params)
}

function update<T extends Prisma.DraftUpdateArgs>(
  _user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftUpdateArgs>
) {
  return prismaClient.draft.update(params)
}

function deleteEntity(
  _user: SecurityRuleGrantee,
  params: Prisma.DraftDeleteArgs
) {
  return prismaClient.draft.delete(params)
}

export const DraftRepo = {
  findUniqueOrThrow,
  create,
  deleteEntity,
  update
}
