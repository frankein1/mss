import type { Prisma } from '@prisma/client'
import { FollowupRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export function getFollowupWithRelations(
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
      },
      documents: true,
      types: true,
      prescribingOrganization: true,
      createdBy: true
    }
  })
}

export type FollowupWithRelations = Prisma.PromiseReturnType<
  typeof getFollowupWithRelations
>
