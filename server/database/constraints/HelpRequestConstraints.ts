import { BeneficiaryConstraints } from './BeneficiaryConstraints'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

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
