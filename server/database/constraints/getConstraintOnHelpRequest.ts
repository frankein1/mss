import { getConstraintOnBeneficiary } from './getConstraintOnBeneficiary'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

export const getConstraintOnHelpRequest = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId,
    beneficiary: getConstraintOnBeneficiary(user)
  })

  return where
}

export const appendConstraintOnHelpRequest = <T extends {}>(
  user: SecurityRuleGrantee,
  where: T
) => {
  return Object.assign(where, getConstraintOnHelpRequest(user))
}
