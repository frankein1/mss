import type { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from './BeneficiaryConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryRelativeWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign<
    Prisma.BeneficiaryRelativeWhereInput,
    Prisma.BeneficiaryRelativeWhereInput
  >(where, {
    beneficiary: BeneficiaryConstraints.get(user)
  })

  return where
}

const update = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryRelativeWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  // The user.structureId check is performed in BeneficiaryConstraints
  Object.assign<
    Prisma.BeneficiaryRelativeWhereInput,
    Prisma.BeneficiaryRelativeWhereInput
  >(where, { beneficiary: BeneficiaryConstraints.get(user) })

  return where
}

export const BeneficiaryRelativeConstraints = {
  get,
  update
}
