import { BeneficiaryConstraints } from './BeneficiaryConstraints'
import { SecurityRuleGrantee, isAdmin } from '~/server/security'

const get = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId,
    beneficiary: BeneficiaryConstraints.get(user)
  })

  return where
}

export const HelpRequestConstraints = {
  get
}
