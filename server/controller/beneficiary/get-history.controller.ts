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
import { prepareFollowupFilters } from '~/utils/filters'
import { prepareHelpRequestFilters } from '~/utils/helpRequest'
import {
  getBeneficiarySecurityTarget,
  BeneficiarySecurityTarget
} from '~/server/security'
import { notfoundError, ProtectedAppContext } from '~/server/trpc'
import {
  canListBeneficiaryFollowups,
  canListCommentsToFollowup,
  canListCommentsToHelpRequest,
  canListBeneficiaryHelpRequests
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

const historyItemInclude = {
  _count: {
    select: {
      Notification: {
        where: { read: false }
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
  }
}

async function getFollowups(
  user: User,
  beneficiary: NonNullable<BeneficiarySecurityTarget>,
  filters: FollowupFilterInput
) {
  if (!canListBeneficiaryFollowups(user, beneficiary)) {
    return []
  }

  const commentsInclude = canListCommentsToFollowup(user, beneficiary)
    ? {
        include: {
          createdBy: { select: createdBySelect }
        }
      }
    : undefined

  const followups = await prismaClient.followup.findMany({
    where: {
      beneficiaryId: beneficiary.id,
      ...prepareFollowupFilters(filters)
    },
    include: {
      ...historyItemInclude,
      comments: commentsInclude,
      types: true
    },
    orderBy: { date: 'desc' }
  })
  return followups.map(f => ({ ...f, isFollowup: true as const }))
}

async function getHelpRequests(
  user: User,
  beneficiary: NonNullable<BeneficiarySecurityTarget>,
  filters: HelpRequestFilterInput
) {
  if (!canListBeneficiaryHelpRequests(user, beneficiary)) {
    return []
  }

  const commentsInclude = canListCommentsToHelpRequest(user, beneficiary)
    ? {
        include: {
          createdBy: { select: createdBySelect }
        }
      }
    : undefined

  const helpRequests = await prismaClient.helpRequest.findMany({
    where: {
      beneficiaryId: beneficiary.id,
      ...prepareHelpRequestFilters(filters)
    },
    include: {
      ...historyItemInclude,
      comments: commentsInclude,
      type: true,
      instructorOrganization: {
        select: {
          name: true
        }
      }
    },
    orderBy: { openingDate: 'desc' }
  })
  return helpRequests.map(h => ({ ...h, isFollowup: false as const }))
}

type HistoryFollowup = Prisma.PromiseReturnType<typeof getFollowups>[0]
type HistoryHelpRequest = Prisma.PromiseReturnType<typeof getHelpRequests>[0]

type HistoryItem = HistoryFollowup | HistoryHelpRequest

function getHistoryItemDate(h: HistoryItem) {
  return h.isFollowup ? h.date : h.openingDate
}

function sortHistoryItem(a: HistoryItem, b: HistoryItem) {
  const dateA = getHistoryItemDate(a)
  const dateB = getHistoryItemDate(b)
  return dateA >= dateB ? -1 : 1
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

  if (filtersAppliesToFollowups(filters)) {
    return getFollowups(user, beneficiary, filters)
  }

  if (filtersAppliesToHelpRequests(filters)) {
    return getHelpRequests(user, beneficiary, filters)
  }

  if (!filtersAppliesToFollowupsAndHelpRequests(filters)) {
    return []
  }

  const [followups, helpRequests] = await Promise.all([
    getFollowups(user, beneficiary, filters),
    getHelpRequests(user, beneficiary, filters)
  ])

  return [...followups, ...helpRequests].sort(sortHistoryItem)
}
