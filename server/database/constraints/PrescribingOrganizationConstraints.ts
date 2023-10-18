import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    structureId: user.structureId
  })

  return where
}

const append = <T extends {}>(user: SecurityRuleGrantee, where: T) => {
  return Object.assign(where, get(user))
}

export const PrescribingOrganizationConstraints = {
  get,
  append
}
