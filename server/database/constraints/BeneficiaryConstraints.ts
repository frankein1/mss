import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
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

const append = <T extends {}>(user: SecurityRuleGrantee, where: T) => {
  return Object.assign(where, get(user))
}

export const BeneficiaryConstraints = {
  get,
  append
}
