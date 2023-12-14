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
  getHelpRequestPermissions
} from '~/server/security'
import { HelpRequestRepo } from '~/server/database'
import { prepareDateFields } from '~/utils/prisma'
import { getStructureByUser } from '~/server/query'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: QuickEditHelpRequestInput
) => {
  const [target, structure] = await Promise.all([
    HelpRequestRepo.findUniqueOrThrow(user, {
    where: { id: input.id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
    }),
    getStructureByUser(user)
  ])
  const permissions = getHelpRequestPermissions({ user, structure, target })
  return permissions.edit
}

const handler = async ({
  input: { id, ...rest },
  ctx: { user, structure }
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const data =
    'paymentDate' in rest ? prepareDateFields(rest, ['paymentDate']) : rest

  const permissions = getHelpRequestPermissions({ user, structure })

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id },
    data,
    select: prepareGetHelpRequestsPageSelect(permissions)
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
