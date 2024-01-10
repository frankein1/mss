import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetHistoryInput, getHistorySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getDocumentPermissions,
  SecurityRuleGrantee,
  getHelpRequestPermissions,
  getFollowupPermissions,
  SecurityRuleContext
} from '~/server/security'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { BeneficiaryHistoryRepo } from '~/server/database'
import {
  BeneficiarySecurityTarget,
  BeneficiaryService
} from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetHistoryInput
) => {
  const permissions = await BeneficiaryService.getUpdatePermission(
    ctx,
    input.beneficiaryId
  )
  return permissions.view.history
}

type HistoryFilters = GetHistoryInput['filters']

const createdBySelect = {
  firstName: true,
  lastName: true,
  email: true
}

function prepareHistoryFilters(filters: HistoryFilters, beneficiaryId: string) {
  const formattedFilters: Prisma.SocialSupportWhereInput = {}
  formattedFilters.followup = {}
  formattedFilters.helpRequest = {}

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
    formattedFilters.followup.medium = { in: filters.medium }
  }

  if (filters.examinationDate) {
    formattedFilters.helpRequest.examinationDate = filters.examinationDate
  }

  if (filters.externalStructure !== undefined) {
    formattedFilters.helpRequest.externalStructure =
      filters.externalStructure === 'true'
  }

  if (filters.handlingDate !== undefined) {
    formattedFilters.helpRequest.handlingDate =
      filters.handlingDate === 'true' ? { not: null } : null
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  // FIX: faut-il rajouter un type de social support ?
  // if (filters.typeSuivi) {
  //   formattedFilters.isFollowup = filters.typeSuivi === TypeSuivi.Followup
  // }

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
      documents: {
        select: {
          key: true,
          name: true,
          createdById: true,
          confidential: true
        }
      },
      comments: {
        orderBy: { created: 'asc' },
        include: COMMENT_RELATIONS_INCLUDE
      },
      helpRequest: {
        select: {
          id: true
        }
      },
      followup: {
        select: {
          id: true
        }
      },
      _count: {
        select: {
          notifications: {
            where: { read: false, recipientId: user.id }
          }
        }
      },
      types: true
    },
    orderBy: { date: 'desc' }
  })
}

type Histories = Prisma.PromiseReturnType<typeof getHistories>

function flattenHistories(
  histories: Histories,
  ctx: ProtectedAppContext,
  beneficiary: BeneficiarySecurityTarget
) {
  return histories.map(history => {
    const { followup, types, documents, comments, _count, ...data } = history
    const { user } = ctx

    const documentsWithPermissions = documents?.map(document => ({
      document,
      permissions: getDocumentPermissions({
        ctx,
        beneficiary,
        document
      })
    }))

    const historyPermissions = followup
      ? getFollowupPermissions({
          user,
          beneficiary: data.beneficiary,
          socialSupport: history
        })
      : getHelpRequestPermissions({
          ctx,
          target: { beneficiary: data.beneficiary, socialSupport: history }
        })

    return {
      data: {
        ...data,
        documents: documentsWithPermissions,
        comments,
        hasUnreadNotifications: !!_count.notifications,
        followUpTypes: types
      },
      permissions: historyPermissions
    }
  })
}

const handler = async ({
  input,
  ctx
}: {
  input: GetHistoryInput
  ctx: ProtectedAppContext
}) => {
  const { beneficiaryId, filters } = input

  const [totalCount, histories, beneficiary] = await Promise.all([
    BeneficiaryHistoryRepo.count(ctx.user, {
      where: {
        beneficiaryId
      }
    }),
    getHistories(filters, ctx.user, beneficiaryId),
    BeneficiaryService.getBeneficiarySecurityTarget(
      ctx.user,
      input.beneficiaryId
    )
  ])

  return {
    histories: flattenHistories(histories, ctx, beneficiary),
    totalCount
  }
}

export const getBeneficiaryHistoriesQuery = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
