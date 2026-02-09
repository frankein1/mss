import type { Prisma } from '~/prisma/generated/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.BeneficiaryWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  // A non admin user should always have structure id filled
  if (!user.structureId) {
    throw new Error('beneficiary-constraints: missing structure id')
  }

  Object.assign<Prisma.BeneficiaryWhereInput, Prisma.BeneficiaryWhereInput>(
    where,
    {
      structureId: user.structureId
    }
  )

  if (isReferent(user)) {
    Object.assign<Prisma.BeneficiaryWhereInput, Prisma.BeneficiaryWhereInput>(
      where,
      {
        familyFile: { referents: { some: { id: user.id } } }
      }
    )
  }

  return where
}

export const BeneficiaryConstraints = {
  get,
  update: get
}
