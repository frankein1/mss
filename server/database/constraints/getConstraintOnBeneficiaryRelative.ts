import { getConstraintOnBeneficiary } from './getConstraintOnBeneficiary'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

export const getConstraintOnBeneficiaryRelative = (
  user: SecurityRuleGrantee
) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    beneficiary: getConstraintOnBeneficiary(user),
    linkedBeneficiary: getConstraintOnBeneficiary(user)
  })

  return where
}
