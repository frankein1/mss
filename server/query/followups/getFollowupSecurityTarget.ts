import { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export function getFollowupSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return FollowupRepo.findUniqueOrThrow(user, {
    where: { id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
}

export type FollowupSecurityTarget = Prisma.PromiseReturnType<
  typeof getFollowupSecurityTarget
>
