import type { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from './BeneficiaryConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReceptionAgent } from '~/server/security/rules/helpers'

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

export const DocumentConstraints = {
  get
}
