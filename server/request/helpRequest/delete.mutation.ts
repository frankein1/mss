import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/request'
import { ProtectedAppContext } from '~/server/trpc'
import {
  SecurityRuleGrantee,
  canDeleteHelpRequest
} from '~/server/security/rules'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { IdInput, idSchema } from '~/server/schema'

function getHelpRequest(id: string) {
  return prismaClient.helpRequest.findUniqueOrThrow({
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
  input: { id },
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await prismaClient.helpRequest.delete({ where: { id } })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'HelpRequest',
    objectId: id
  })
}

const securityCheck = async (user: SecurityRuleGrantee, input: IdInput) => {
  const helpRequest = await getHelpRequest(input.id)
  return canDeleteHelpRequest(user, helpRequest)
}

export const deleteHelpRequestMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler
})
