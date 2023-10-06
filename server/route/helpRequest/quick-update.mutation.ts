import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditHelpRequestInput,
  quickEditHelpRequestSchema
} from '~/server/schema'
import { prismaClient } from '~/server/prisma'
import {
  SecurityRuleGrantee,
  canEditHelpRequest
} from '~/server/security/rules'
import { prepareGetHelpRequestsPageSelect } from '~/utils/helpRequest'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: QuickEditHelpRequestInput
) => {
  const target = await prismaClient.helpRequest.findUniqueOrThrow({
    where: { id: input.id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
  return canEditHelpRequest(user, target)
}

const handler = async ({
  input: { id, ...rest },
  ctx: { user }
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const select = prepareGetHelpRequestsPageSelect(user)

  const helpRequest = await prismaClient.helpRequest.update({
    where: { id },
    data: rest,
    select
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'HelpRequest',
    objectId: helpRequest.id
  })

  return helpRequest
}

export const quickUpdateHelpRequestMutation = createMutation({
  securityCheck,
  inputValidation: quickEditHelpRequestSchema,
  handler
})
