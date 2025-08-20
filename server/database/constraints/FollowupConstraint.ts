import type { Prisma } from '@prisma/client'
import { SocialSupportConstraints } from './SocialSupportConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.FollowupWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    socialSupport: SocialSupportConstraints.get(user)
  })

  return where
}

export const FollowupConstraints = {
  get,
  update: get
}
