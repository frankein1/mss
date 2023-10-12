import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/query'
import { SecurityRuleGrantee } from '~/server/security'

export function getHelpRequestsecurityTarget(
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
  typeof getHelpRequestsecurityTarget
>
