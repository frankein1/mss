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
  SecurityRuleGrantee,
  getHelpRequestPermissions
} from '~/server/security'
import { HelpRequestRepo } from '~/server/database'
import { prepareDateFields } from '~/utils/prisma'
import {
  getStructureByUser,
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
  input,
  ctx: { user, structure }
}: {
  input: QuickEditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
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
      user,
      structure,
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
