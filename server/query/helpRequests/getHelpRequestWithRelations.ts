import { Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'

export function getHelpRequestWithRelations(
  user: SecurityRuleGrantee,
  id: string
) {
  return HelpRequestRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      subject: true,
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      prescribingOrganization: true,
      instructorOrganization: true,
      type: true,
      createdBy: true
    }
  })
}

export type HelpRequestWithRelations = Prisma.PromiseReturnType<
  typeof getHelpRequestWithRelations
>
