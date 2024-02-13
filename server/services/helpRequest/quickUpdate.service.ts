import { SocialSupportStatus, Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { QuickEditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'

export async function quickUpdate(
  ctx: SecurityRuleContext,
  input: QuickEditHelpRequestInput
) {
  const { user } = ctx
  const { financialSupport } = await HelpRequestRepo.findUniqueOrThrow(user, {
    where: {
      id: input.id
    },
    select: {
      financialSupport: true
    }
  })

  const data = prepareData(financialSupport, input)

  return await HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data,
    select: {
      allocatedAmount: true,
      paymentMethod: true,
      paymentDate: true,
      fileInstruction: {
        select: {
          socialSupport: {
            select: {
              status: true
            }
          }
        }
      }
    }
  })
}

function prepareData(
  isFinancial: boolean,
  { id: _id, ...data }: QuickEditHelpRequestInput
) {
  if (isFinancial && ('allocatedAmount' in data || 'paymentMethod' in data)) {
    return data
  }

  if ('paymentDate' in data) {
    return data
  }

  if ('status' in data) {
    const status = data.status
    let _data: Prisma.HelpRequestUpdateInput = {}
    _data = {
      ..._data,
      fileInstruction: { update: { socialSupport: { update: { status } } } }
    }
    if (
      status !== SocialSupportStatus.Accepted &&
      status !== SocialSupportStatus.Refused
    ) {
      _data = { ..._data, fileInstruction: { update: { decisionDate: null } } }
    }
    if (status !== SocialSupportStatus.Accepted) {
      _data = { ..._data, handlingDate: null, allocatedAmount: null }
    }
    if (status !== SocialSupportStatus.Refused) {
      _data = { ..._data, fileInstruction: { update: { refusalReason: null } } }
    }
    return _data
  }

  return {}
}
