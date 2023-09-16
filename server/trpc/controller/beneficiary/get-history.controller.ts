import type { Prisma, User } from '@prisma/client'
import { HelpRequestStatus, FollowupStatus } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import type {
  GetHistoryInput,
  BeneficiaryHistoryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput
} from '~/server/schema'
import { TypeSuivi } from '~/types/history'
import {
  prepareFollowupFilters,
  prepareHelpRequestFilters
} from '~/utils/filters'
import {
  getBeneficiarySecurityTarget,
  BeneficiarySecurityTarget
} from '~/server/security'
import { notfoundError, ProtectedAppContext } from '~/server/trpc'
import {
  canListBeneficiaryFollowups,
  canListCommentsToFollowup,
  canListCommentsToHelpRequest,
  canListBeneficiaryHelpRequests,
  canOnlyListItsBeneficiaries
} from '~/server/security/rules'

function filtersAppliesToFollowups(
  filters: BeneficiaryHistoryFilterInput
): filters is FollowupFilterInput {
  return !!(
    (filters.typeSuivi && filters.typeSuivi === TypeSuivi.Followup) ||
    filters.medium ||
    (filters.status && filters.status in FollowupStatus)
  )
}

function filtersAppliesToHelpRequests(
  filters: BeneficiaryHistoryFilterInput
): filters is HelpRequestFilterInput {
  return !!(
    (filters.typeSuivi && filters.typeSuivi === TypeSuivi.HelpRequest) ||
    filters.examinationDate ||
    filters.externalStructure ||
    filters.handlingDate ||
    (filters.status && filters.status in HelpRequestStatus)
  )
}

function filtersAppliesToFollowupsAndHelpRequests(
  filters: BeneficiaryHistoryFilterInput
): filters is FollowupFilterInput & HelpRequestFilterInput {
  return (
    !filters.examinationDate &&
    !filters.externalStructure &&
    !filters.handlingDate &&
    !filters.medium &&
    !filters.status &&
    !filters.typeSuivi
  )
}

const createdBySelect = {
  firstName: true,
  lastName: true,
  email: true
}

const historyItemInclude = (userId: string) => ({
  _count: {
    select: {
      Notification: {
        where: { read: false, recipientId: userId }
      }
    }
  },
  createdBy: {
    select: createdBySelect
  },
  beneficiary: {
    select: {
      structureId: true,
      referents: true
    }
  },
  prescribingOrganization: {
    select: {
      name: true
    }
  },
  documents: {
    select: {
      key: true,
      name: true
    }
  }
})

async function getFollowups(
  user: User,
  beneficiary: NonNullable<BeneficiarySecurityTarget>,
  filters: FollowupFilterInput
) {
  if (!canListBeneficiaryFollowups(user, beneficiary)) {
    return []
  }

  const followups = await prismaClient.followup.findMany({
    where: {
      beneficiaryId: beneficiary.id,
      ...prepareFollowupFilters(filters, canOnlyListItsBeneficiaries(user))
    },
    include: {
      ...historyItemInclude(user.id),
      comments: {
        include: {
          createdBy: { select: createdBySelect }
        }
      },
      types: true
    },
    orderBy: { date: 'desc' }
  })

  return followups.map(f => ({
    ...f,
    isFollowup: true as const,
    comments: canListCommentsToFollowup(user, beneficiary)
      ? f.comments
      : undefined
  }))
}

async function getHelpRequests(
  user: User,
  beneficiary: NonNullable<BeneficiarySecurityTarget>,
  filters: HelpRequestFilterInput
) {
  if (!canListBeneficiaryHelpRequests(user, beneficiary)) {
    return []
  }

  const helpRequests = await prismaClient.helpRequest.findMany({
    where: {
      beneficiaryId: beneficiary.id,
      ...prepareHelpRequestFilters(filters, canOnlyListItsBeneficiaries(user))
    },
    include: {
      ...historyItemInclude(user.id),
      comments: {
        include: {
          createdBy: { select: createdBySelect }
        }
      },
      type: true,
      instructorOrganization: {
        select: {
          name: true
        }
      }
    },
    orderBy: { openingDate: 'desc' }
  })

  return helpRequests.map(h => ({
    ...h,
    isFollowup: false as const,
    comments: canListCommentsToHelpRequest(user, beneficiary)
      ? h.comments
      : undefined
  }))
}

async function getHistoryTotalCount(
  user: User,
  beneficiary: NonNullable<BeneficiarySecurityTarget>
) {
  let followupsCount = 0
  let helpRequestsCount = 0

  if (canListBeneficiaryFollowups(user, beneficiary)) {
    followupsCount = await prismaClient.followup.count({
      where: {
        beneficiaryId: beneficiary.id
      }
    })
  }

  if (canListBeneficiaryHelpRequests(user, beneficiary)) {
    helpRequestsCount = await prismaClient.helpRequest.count({
      where: {
        beneficiaryId: beneficiary.id
      }
    })
  }

  return followupsCount + helpRequestsCount
}

type HistoryFollowup = Prisma.PromiseReturnType<typeof getFollowups>[0]
type HistoryHelpRequest = Prisma.PromiseReturnType<typeof getHelpRequests>[0]

export type HistoryItem = HistoryFollowup | HistoryHelpRequest

function getHistoryItemDate(h: HistoryItem) {
  return h.isFollowup ? h.date : h.openingDate
}

function sortHistoryItem(a: HistoryItem, b: HistoryItem) {
  const dateA = getHistoryItemDate(a)
  const dateB = getHistoryItemDate(b)
  return dateA >= dateB ? -1 : 1
}

function getHistoryResponse(
  history: (HistoryFollowup | HistoryHelpRequest)[],
  totalCount: number
) {
  return {
    history,
    totalCount
  }
}

export const getBeneficiaryHistoryHandler = async ({
  input,
  ctx: { user }
}: {
  input: GetHistoryInput
  ctx: ProtectedAppContext
}) => {
  const { beneficiaryId, filters } = input

  const beneficiary = await getBeneficiarySecurityTarget(beneficiaryId)

  if (!beneficiary) {
    throw notfoundError()
  }

  const historyTotalCount = await getHistoryTotalCount(user, beneficiary)

  if (filtersAppliesToFollowups(filters)) {
    const history = await getFollowups(user, beneficiary, filters)
    return getHistoryResponse(history, historyTotalCount)
  }

  if (filtersAppliesToHelpRequests(filters)) {
    const history = await getHelpRequests(user, beneficiary, filters)
    return getHistoryResponse(history, historyTotalCount)
  }

  if (!filtersAppliesToFollowupsAndHelpRequests(filters)) {
    return getHistoryResponse([], historyTotalCount)
  }

  const [followups, helpRequests] = await Promise.all([
    getFollowups(user, beneficiary, filters),
    getHelpRequests(user, beneficiary, filters)
  ])
  return getHistoryResponse(
    [...followups, ...helpRequests].sort(sortHistoryItem),
    historyTotalCount
  )
}
