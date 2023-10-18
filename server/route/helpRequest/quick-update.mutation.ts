import { UserActivityType } from '@prisma/client'
import { prepareGetHelpRequestsPageSelect } from './helper'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditHelpRequestInput,
  quickEditHelpRequestSchema
} from '~/server/schema'
import {
  SecurityRuleGrantee,
  canEditHelpRequest
} from '~/server/security/rules'
import { addUserActivity } from '~/server/query'
import { HelpRequestRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: QuickEditHelpRequestInput
) => {
  const target = await HelpRequestRepo.findUniqueOrThrow(user, {
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
  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id },
    data: rest,
    select: prepareGetHelpRequestsPageSelect(user)
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
