import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

export const getConstraintOnStructure = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }

  Object.assign(where, {
    id: user.structureId
  })
  return where
}
