import { getConstraintOnBeneficiary } from './getConstraintOnBeneficiary'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReceptionAgent } from '~/server/security/rules/helpers'

export const getConstraintOnDocument = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }

  if (isReceptionAgent(user)) {
    Object.assign(where, { createdById: user.id })
  } else {
    Object.assign(where, {
      OR: [
        { confidential: false },
        { confidential: true, createdById: user.id }
      ]
    })
  }
  // append constraints on beneficiary relation
  Object.assign(where, {
    beneficiary: getConstraintOnBeneficiary(user)
  })
  return where
}
