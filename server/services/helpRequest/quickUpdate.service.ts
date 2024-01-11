import { SocialSupportStatus, HelpRequestSubject, Prisma } from '@prisma/client'
import { HelpRequestRepo } from '~/server/database'
import { QuickEditHelpRequestInput } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { prepareDateFields } from '~/utils/prisma'

export async function quickUpdate(
  ctx: SecurityRuleContext,
  input: QuickEditHelpRequestInput
) {
  const { user } = ctx
  const { subject } = await HelpRequestRepo.findUniqueOrThrow(user, {
    where: {
      id: input.id
    },
    select: {
      subject: true
    }
  })

  const data = prepareData(subject, input)

  await HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data
  })
}

function prepareData(
  subject: HelpRequestSubject,
  { id: _id, ...data }: QuickEditHelpRequestInput
) {
  const isFinancial = subject === HelpRequestSubject.Financial
  if (isFinancial && ('allocatedAmount' in data || 'paymentMethod' in data)) {
    return data
  }

  if ('paymentDate' in data) {
    return prepareDateFields(data, ['paymentDate'])
  }

  if ('status' in data) {
    const status = data.status
    let _data: Prisma.HelpRequestUpdateInput = {}
    _data = { ..._data, socialSupport: { update: { status } } }
    if (
      status !== SocialSupportStatus.Accepted &&
      status !== SocialSupportStatus.Refused
    ) {
      _data = { ..._data, decisionDate: null }
    }
    if (status !== SocialSupportStatus.Accepted) {
      _data = { ..._data, handlingDate: null, allocatedAmount: null }
    }
    if (status !== SocialSupportStatus.Refused) {
      _data = { ..._data, refusalReason: null }
    }
    return _data
  }

  return {}
}
