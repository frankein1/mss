import {
  UserActivityType,
  HelpRequestSubject,
  HelpRequestStatus
} from '@prisma/client'
import { prepareGetHelpRequestsPageSelect } from './helper'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  QuickEditHelpRequestInput,
  quickEditHelpRequestSchema
} from '~/server/schema'
import {
  SecurityRuleContext,
  getHelpRequestPermissions
} from '~/server/security'
import { HelpRequestRepo } from '~/server/database'
import { prepareDateFields } from '~/utils/prisma'
import {
  getHelpRequestWithRelations,
  HelpRequestWithRelations
} from '~/server/query'

function prepareData(
  target: HelpRequestWithRelations,
  { id: _id, ...data }: QuickEditHelpRequestInput
) {
  const isFinancial = target.subject === HelpRequestSubject.Financial
  if (isFinancial && ('allocatedAmount' in data || 'paymentMethod' in data)) {
    return data
  }

  if ('paymentDate' in data) {
    return prepareDateFields(data, ['paymentDate'])
  }

  if ('status' in data) {
    const status = data.status
    let _data = {}
    _data = { ..._data, status }
    if (
      status !== HelpRequestStatus.Accepted &&
      status !== HelpRequestStatus.Refused
    ) {
      _data = { ..._data, decisionDate: null }
    }
    if (status !== HelpRequestStatus.Accepted) {
      _data = { ..._data, handlingDate: null, allocatedAmount: null }
    }
    if (status !== HelpRequestStatus.Refused) {
      _data = { ..._data, refusalReason: null }
    }
    return _data
  }

  return {}
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: QuickEditHelpRequestInput
) => {
  const target = await HelpRequestRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id },
    include: {
      beneficiary: {
        include: {
          referents: true
        }
      }
    }
  })
  const permissions = getHelpRequestPermissions({ ctx, target })
  return permissions.edit
}

const handler = async ({
  input,
  ctx
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const { user, structure } = ctx
  const target = await getHelpRequestWithRelations(user, input.id)

  const data = prepareData(target, input)

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data,
    select: prepareGetHelpRequestsPageSelect({ user, structure })
  })

  return {
    ...helpRequest,
    permissions: getHelpRequestPermissions({
      ctx,
      target: helpRequest
    })
  }
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
