import { Prisma } from '@prisma/client'
import { BeneficiaryConstraints } from './BeneficiaryConstraints'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.HousingHelpRequestWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    socialSupport: {
      structureId: user.structureId,
      beneficiary: BeneficiaryConstraints.get(user)
    }
  })

  return where
}

export const HousingHelpRequestConstraints = {
  get
}
