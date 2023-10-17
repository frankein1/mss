import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

export const getConstraintsOnBeneficiary = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, { structureId: user.structureId, archived: null })

  if (isReferent(user)) {
    Object.assign(where, { referents: { some: { id: user.id } } })
  }
  return where
}
