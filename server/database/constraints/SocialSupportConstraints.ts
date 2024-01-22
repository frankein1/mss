import { Prisma } from '@prisma/client'
import { SecurityRuleGrantee } from '~/server/security'
import { isAdmin, isReferent } from '~/server/security/rules/helpers'

const get = (user: SecurityRuleGrantee) => {
  const where: Prisma.SocialSupportWhereInput = {}
  if (isAdmin(user)) {
    return where
  }
  Object.assign<Prisma.SocialSupportWhereInput, Prisma.SocialSupportWhereInput>(
    where,
    { structureId: user.structureId || undefined }
  )

  if (isReferent(user)) {
    Object.assign<
      Prisma.SocialSupportWhereInput,
      Prisma.SocialSupportWhereInput
    >(where, {
      beneficiary: {
        referents: { some: { id: user.id } }
      }
    })
  }
  return where
}

export const SocialSupportConstraints = {
  get,
  remove: get,
  update: get
}
