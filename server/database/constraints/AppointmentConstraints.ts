import type { Prisma } from '~/prisma/generated/client'
import { SocialSupportConstraints } from './SocialSupportConstraints'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.AppointmentWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign<Prisma.AppointmentWhereInput, Prisma.AppointmentWhereInput>(
    where,
    {
      socialSupport: SocialSupportConstraints.get(user)
    }
  )

  return where
}

export const AppointmentConstraints = {
  get,
  update: get
}
