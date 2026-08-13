import type { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from './BeneficiaryConstraints'
import type { SecurityRuleGrantee } from '~~/server/security'
import { isAdmin, isReceptionAgent } from '~~/server/security/rules/helpers'
import { TRPCError } from '@trpc/server'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.DocumentWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  if (!user.structureId) {
    throw new Error('document-constraints: missing structure id')
  }

  if (isReceptionAgent(user)) {
    Object.assign<Prisma.DocumentWhereInput, Prisma.DocumentWhereInput>(where, {
      createdById: user.id
    })
  }
  // append constraints on beneficiary relation
  Object.assign<Prisma.DocumentWhereInput, Prisma.DocumentWhereInput>(where, {
    beneficiary: BeneficiaryConstraints.get(user)
  })
  return where
}

const create = (user: SecurityRuleGrantee) => {
  const data: Partial<Prisma.DocumentCreateInput> = {}
  if (isAdmin(user)) {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'document-constraints: create not implemented for admin'
    })
  }

  if (!user.structureId) {
    throw new Error('document-constraints: missing structure id')
  }

  Object.assign<
    Partial<Prisma.DocumentCreateInput>,
    Partial<Prisma.DocumentCreateInput>
  >(data, {
    createdBy: { connect: { id: user.id } }
  })
  return data
}

export const DocumentConstraints = {
  get,
  create
}
