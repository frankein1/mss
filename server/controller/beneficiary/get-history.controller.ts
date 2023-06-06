import type { Prisma } from '@prisma/client'
import { HelpRequestStatus, FollowupStatus } from '@prisma/client'
import { prismaClient } from '~/server/prisma'
import type {
  GetHistoryInput,
  BeneficiaryHistoryFilterInput,
  FollowupFilterInput,
  HelpRequestFilterInput
} from '~/server/schema'
import { TypeSuivi } from '~/types/history'
import { prepareFollowupFilters } from '~/utils/followup/filters'
import { prepareHelpRequestFilters } from '~/utils/helpRequest/filters'

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

async function getFollowups(
  beneficiaryId: string,
  filters: FollowupFilterInput
) {
  const followups = await prismaClient.followup.findMany({
    where: { beneficiaryId, ...prepareFollowupFilters(filters) },
    include: {
      Notification: { where: { read: false } }
    },
    orderBy: { date: 'desc' }
  })
  return followups.map(f => ({ ...f, isFollowup: true as const }))
}

async function getHelpRequests(
  beneficiaryId: string,
  filters: HelpRequestFilterInput
) {
  const helpRequests = await prismaClient.helpRequest.findMany({
    where: { beneficiaryId, ...prepareHelpRequestFilters(filters) },
    include: {
      Notification: { where: { read: false } }
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
  input
}: {
  input: GetHistoryInput
}) => {
  const { beneficiaryId, filters } = input

  if (filtersAppliesToFollowups(filters)) {
    return getFollowups(beneficiaryId, filters)
  }

  if (filtersAppliesToHelpRequests(filters)) {
    return getHelpRequests(beneficiaryId, filters)
  }

  if (!filtersAppliesToFollowupsAndHelpRequests(filters)) {
    return []
  }

  const [followups, helpRequests] = await Promise.all([
    getFollowups(beneficiaryId, filters),
    getHelpRequests(beneficiaryId, filters)
  ])

  return [...followups, ...helpRequests].sort(sortHistoryItem)
}
