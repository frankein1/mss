import { UserActivityType } from '@prisma/client'
import { prepareGetHelpRequestsPageSelect } from './helper'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditHelpRequestInput,
  quickEditHelpRequestSchema
} from '~/server/schema'
import { SecurityRuleGrantee, canEditHelpRequest } from '~/server/security'
import { HelpRequestRepo } from '~/server/database'
import { prepareDateFields } from '~/utils/prisma'

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
  const data =
    'paymentDate' in rest ? prepareDateFields(rest, ['paymentDate']) : rest

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id },
    data,
    select: prepareGetHelpRequestsPageSelect(user)
  })

  return helpRequest
}

export const quickUpdateHelpRequestMutation = createMutation({
  securityCheck,
  inputValidation: quickEditHelpRequestSchema,
  handler,
  auditLog: {
    key: 'helpRequest.quickUpdate',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
