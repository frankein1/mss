import { Prisma } from '@prisma/client'
import { SocialSupportConstraints } from './SocialSupportConstraints'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.HousingHelpRequestWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign(where, {
    socialSupport: SocialSupportConstraints.get(user)
  })

  return where
}

export const HousingHelpRequestConstraints = {
  get
}
