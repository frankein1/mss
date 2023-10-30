import { SecurityRuleGrantee, isAdmin } from '~/server/security'

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

export const UserConstraints = {
  get
}
