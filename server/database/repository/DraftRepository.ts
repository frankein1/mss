import { Prisma } from '@prisma/client'
import { DraftConstraints } from '../constraints/DraftConstraint'
import { prismaClient } from '~/server/prisma'
import { SecurityRuleGrantee } from '~/server/security'

// VIEW

function findUniqueOrThrow<T extends Prisma.DraftFindUniqueOrThrowArgs>(
  user: SecurityRuleGrantee,
  params: Prisma.SelectSubset<T, Prisma.DraftFindUniqueOrThrowArgs>
) {
  DraftConstraints.append(user, params)
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
