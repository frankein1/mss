import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export function getHelpRequestSecurityTarget(
  user: SecurityRuleGrantee,
  id: string
) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
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

export type HelpRequestSecurityTarget = Prisma.PromiseReturnType<
  typeof getHelpRequestSecurityTarget
>
