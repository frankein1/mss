import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetHistoryInput, getHistorySchema } from '~/server/schema'
import { TypeSuivi } from '~/types/history'
import { getBeneficiarySecurityTarget } from '~/server/query'
import { ProtectedAppContext } from '~/server/trpc'
import { getBeneficiaryHistoryPermissions } from '~/server/security'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { BeneficiaryHistoryRepo } from '~/server/database'

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: GetHistoryInput
) => {
  const target = await getBeneficiarySecurityTarget(user, input.beneficiaryId)
  const permissions = getBeneficiaryHistoryPermissions({ user, target })
  return permissions.view
}

type HistoryFilters = GetHistoryInput['filters']

const createdBySelect = {
  firstName: true,
  lastName: true,
  email: true
}

function prepareHistoryFilters(filters: HistoryFilters, beneficiaryId: string) {
  const formattedFilters: Prisma.BeneficiaryHistoryWhereInput = {}

  if (filters.referents) {
    formattedFilters.beneficiary = {
      id: beneficiaryId,
      referents: {
        some: { id: { in: filters.referents } }
      }
    }
  } else {
    formattedFilters.beneficiary = { id: beneficiaryId }
  }

  if (filters.status) {
    formattedFilters.status = filters.status
  }

  if (filters.medium) {
    formattedFilters.medium = { in: filters.medium }
  }

  if (filters.examinationDate) {
    formattedFilters.examinationDate = filters.examinationDate
  }

  if (filters.externalStructure !== undefined) {
    formattedFilters.externalStructure = filters.externalStructure === 'true'
  }

  if (filters.handlingDate !== undefined) {
    formattedFilters.handlingDate =
      filters.handlingDate === 'true' ? { not: null } : null
  }

  if (filters.followupTypes) {
    formattedFilters.typeIds = { hasSome: filters.followupTypes }
  }

  if (filters.typeSuivi) {
    formattedFilters.isFollowup = filters.typeSuivi === TypeSuivi.Followup
  }

  return formattedFilters
}

function getHistories(
  filters: HistoryFilters,
  user: SecurityRuleGrantee,
  beneficiaryId: string
) {
  return BeneficiaryHistoryRepo.findMany(user, {
    where: prepareHistoryFilters(filters, beneficiaryId),
    include: {
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
      instructorOrganization: {
        select: {
          name: true
        }
      },
      followup: {
        include: {
          documents: {
            select: {
              key: true,
              name: true
            }
          },
          comments: {
            orderBy: { created: 'asc' },
            include: COMMENT_RELATIONS_INCLUDE
          },
          _count: {
            select: {
              notifications: {
                where: { read: false, recipientId: user.id }
              }
            }
          },
          types: true
        }
      },
      helpRequest: {
        include: {
          documents: {
            select: {
              key: true,
              name: true
            }
          },
          comments: {
            orderBy: { created: 'asc' },
            include: COMMENT_RELATIONS_INCLUDE
          },
          _count: {
            select: {
              notifications: {
                where: { read: false, recipientId: user.id }
              }
            }
          },
          type: true
        }
      }
    },
    orderBy: { date: 'desc' }
  })
}

type Histories = Prisma.PromiseReturnType<typeof getHistories>

function flattenHistories(histories: Histories) {
  return histories.map(history => {
    const { followup, helpRequest, ...data } = history

    return {
      ...data,
      documents: followup?.documents || helpRequest?.documents,
      comments: followup?.comments || helpRequest?.comments,
      hasUnreadNotifications: !!(
        followup?._count.notifications || helpRequest?._count.notifications
      ),
      followUpTypes:
        followup?.types || (helpRequest ? [helpRequest.type] : undefined)
    }
  })
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: GetHistoryInput
  ctx: ProtectedAppContext
}) => {
  const { beneficiaryId, filters } = input

  const [totalCount, histories] = await Promise.all([
    BeneficiaryHistoryRepo.count(user, {
      where: {
        beneficiaryId
      }
    }),
    getHistories(filters, user, beneficiaryId)
  ])

  return {
    histories: flattenHistories(histories),
    totalCount
  }
}

export const getBeneficiaryHistoriesQuery = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
