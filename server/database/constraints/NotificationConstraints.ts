import { SecurityRuleGrantee, isAdmin } from '~/server/security'

const get = (user: SecurityRuleGrantee) => {
  const where = {}
  if (isAdmin(user)) {
    return where
  }

  Object.assign(where, {
    recipientId: user.id
  })
  return where
}

export const NotificationConstraints = {
  get
}
