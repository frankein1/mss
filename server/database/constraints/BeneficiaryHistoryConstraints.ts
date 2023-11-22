import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryHistoryWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign<
    Prisma.BeneficiaryHistoryWhereInput,
    Prisma.BeneficiaryHistoryWhereInput
  >(where, { structureId: user.structureId || undefined })

  if (isReferent(user)) {
    Object.assign<
      Prisma.BeneficiaryHistoryWhereInput,
      Prisma.BeneficiaryHistoryWhereInput
    >(where, {
      beneficiary: {
        referents: { some: { id: user.id } }
      }
    })
  }
  return where
}

export const BeneficiaryHistoryConstraints = {
  get
}
