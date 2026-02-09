import type { Prisma } from '~/prisma/generated/client'
import { SocialSupportConstraints } from './SocialSupportConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.FollowupWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  // The user.structureId check is performed in SocialSupportConstraints
  Object.assign<Prisma.FollowupWhereInput, Prisma.FollowupWhereInput>(where, {
    socialSupport: SocialSupportConstraints.get(user)
  })

  return where
}

export const FollowupConstraints = {
  get,
  update: get
}
