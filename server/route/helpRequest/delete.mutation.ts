import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canDeleteHelpRequest
} from '~/server/security/rules'
import { IdInput, idSchema } from '~/server/schema'
import { HelpRequestRepo } from '~/server/database'

function getHelpRequest(user: SecurityRuleGrantee, id: string) {
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

const handler = async ({
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await HelpRequestRepo.prisma.delete({ where: { id } })
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const helpRequest = await getHelpRequest(user, input.id)
  return canDeleteHelpRequest(user, helpRequest)
}

export const deleteHelpRequestMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
