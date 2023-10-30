import { SecurityRuleGrantee, isAdmin } from '~/server/security'

const get = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    ownedByStructureId: user.structureId
  })

  return where
}

export const FollowupTypeConstraints = {
  get
}
