import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

export const getConstraintOnPrescribingOrganization = (
  user: SecurityRuleGrantee
) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId
  })

  return where
}
