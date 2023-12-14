import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  getHelpRequestPermissions
} from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { HelpRequestRepo } from '~/server/database'
import { getStructureByUser } from '~/server/query'

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
  const [target, structure] = await Promise.all([
    getHelpRequest(user, input.id),
    getStructureByUser(user)
  ])
  const permissions = getHelpRequestPermissions({ user, target, structure })
  return permissions.delete
}

export const deleteHelpRequestMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'helpRequest.delete',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
