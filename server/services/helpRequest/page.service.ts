import { HelpRequestSubject, Prisma, SocialSupportStatus } from '@prisma/client'
import { prepareFilters } from './helper'
import {
  GetHelpRequestsInput,
  GetHelpRequestsInputOrderBy,
  QuickEditHelpRequestInput
} from '~/server/schema'
import {
  SecurityRuleContext,
  getHelpRequestPermissions
} from '~/server/security'
import { SortOrder } from '~/types/table'
import { getTotalPages, takeAndSkipFromPagination } from '~/utils/table'
import { HelpRequestRepo } from '~/server/database'
import { prepareDateFields } from '~/utils/prisma'

type GetHelpRequestsOrderBy = Array<
  GetHelpRequestsInputOrderBy[0] & { externalStructure?: SortOrder.Desc }
>

const select = {
  id: true,
  examinationDate: true,
  askedAmount: true,
  allocatedAmount: true,
  paymentMethod: true,
  paymentDate: true,
  handlingDate: true,
  externalStructure: true,
  subject: true,
  type: {
    select: {
      id: true,
      name: true
    }
  },
  instructorOrganization: {
    select: {
      id: true,
      name: true
    }
  },
  socialSupport: {
    select: {
      id: true,
      structureId: true,
      createdById: true,
      status: true,
      dueDate: true,
      createdBy: {
        select: {
          id: true,
          lastName: true,
          firstName: true
        }
      },
      beneficiary: {
        select: {
          id: true,
          structureId: true,
          usualName: true,
          referents: {
            select: {
              id: true
            }
          }
        }
      }
    }
  }
}

function getPageItem(ctx: SecurityRuleContext, id: string) {
  return HelpRequestRepo.findUniqueOrThrow(ctx.user, { select, where: { id } })
}

type PageItem = Prisma.PromiseReturnType<typeof getPageItem>

export async function getPage({
  ctx,
  input
}: {
  ctx: SecurityRuleContext
  input: GetHelpRequestsInput
}) {
  const { user } = ctx

  const { take, skip } = takeAndSkipFromPagination({
    perPage: input.perPage,
    page: input.page
  })

  const where: Prisma.HelpRequestWhereInput = {
    ...prepareFilters(input.filters)
  }

  const orderBy: GetHelpRequestsOrderBy = input.orderBy

  if (orderBy.find(s => !!s.instructorOrganization)) {
    orderBy.unshift({ externalStructure: SortOrder.Desc })
  }

  const count = await HelpRequestRepo.count(user, {
    where
  })

  const helpRequests = await HelpRequestRepo.findMany(ctx.user, {
    where,
    select,
    take,
    skip,
    orderBy: input.orderBy
  })

  const items = helpRequests.map(hr => ({
    permissions: getHelpRequestPermissions({
      ctx,
      beneficiary: hr.socialSupport.beneficiary,
      socialSupport: hr.socialSupport
    }),
    helpRequest: formatOutput(hr)
  }))

  const totalPages = getTotalPages({ count, perPage: input.perPage })

  return { items, count, totalPages }
}

export async function updatePageItem(
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

  const hr = await await HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data,
    select
  })
  const permissions = getHelpRequestPermissions({
    ctx,
    beneficiary: hr.socialSupport.beneficiary,
    socialSupport: hr.socialSupport
  })
  return {
    helpRequest: formatOutput(hr),
    permissions
  }
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

function formatOutput(helpRequest: PageItem) {
  const { socialSupport, ...data } = helpRequest
  return {
    ...socialSupport,
    ...data
  }
}
