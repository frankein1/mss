import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    ownedByStructureId: user.structureId,
    inactive: false
  })

  return where
}

const getNoInactiveCondition = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    ownedByStructureId: user.structureId
  })

  return where
}

export const SocialSupportSubjectConstraints = {
  get,
  getNoInactiveCondition
}
