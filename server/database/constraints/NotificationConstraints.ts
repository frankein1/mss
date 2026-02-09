import type { Prisma } from '~/prisma/generated/client'
import type { SecurityRuleGrantee } from '~/server/security'
import { isAdmin } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.NotificationWhereInput = {}
  if (isAdmin(user)) {
    return where
  }

  Object.assign<Prisma.NotificationWhereInput, Prisma.NotificationWhereInput>(
    where,
    {
      recipientId: user.id
    }
  )
  return where
}

export const NotificationConstraints = {
  get
}
