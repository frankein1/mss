import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetHistoryInput, getHistorySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getDocumentPermissions,
  SecurityRuleGrantee,
  SecurityRuleContext,
  getSocialSupportPermissions,
  getCommentPermissions,
  getAppContextPermissions
} from '~/server/security'
import { SocialSupportRepo } from '~/server/database'
import {
  BeneficiarySecurityTarget,
  BeneficiaryService
} from '~/server/services'
import {
  filterHelpRequest,
  filterSocialSupport,
  filterFollowup,
  filterHousingHelpRequest
} from '~/server/services/helper'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetHistoryInput
) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.beneficiaryId
  )
  return permissions.list.history
}

type HistoryFilters = GetHistoryInput['filters']

function prepareSocialSupportFilters(
  filters: HistoryFilters,
  beneficiaryId: string
) {
  const formattedFilters: Prisma.SocialSupportWhereInput = {}

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
    formattedFilters.followup = { medium: { in: filters.medium } }
  }

  if (filters.examinationDate) {
    formattedFilters.helpRequest = { examinationDate: filters.examinationDate }
  }

  if (filters.externalStructure !== undefined) {
    const isExternalStructure = filters.externalStructure === 'true'
    if (formattedFilters.helpRequest) {
      formattedFilters.helpRequest.externalStructure = isExternalStructure
    } else {
      formattedFilters.helpRequest = { externalStructure: isExternalStructure }
    }
  }

  if (filters.handlingDate !== undefined) {
    const handlingDate = filters.handlingDate === 'true' ? { not: null } : null
    if (formattedFilters.helpRequest) {
      formattedFilters.helpRequest.handlingDate = handlingDate
    } else {
      formattedFilters.helpRequest = { handlingDate }
    }
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.typeSuivi) {
    formattedFilters.socialSupportType = filters.typeSuivi
  }

  return formattedFilters
}

function loadSocialSupports(
  filters: HistoryFilters,
  user: SecurityRuleGrantee,
  beneficiaryId: string
) {
  return SocialSupportRepo.findMany(user, {
    where: prepareSocialSupportFilters(filters, beneficiaryId),
    include: {
      createdBy: true,
      beneficiary: {
        include: {
          referents: true
        }
      },
      documents: true,
      comments: {
        orderBy: { created: 'asc' },
        include: {
          createdBy: true
        }
      },
      helpRequest: {
        include: {
          prescribingOrganization: true,
          instructorOrganization: true
        }
      },
      followup: {
        include: {
          prescribingOrganization: true
        }
      },
      housingHelpRequest: {
        include: {
          instructorOrganization: true
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

type SocialSupports = Prisma.PromiseReturnType<typeof loadSocialSupports>

function formatResult(
  socialSupports: SocialSupports,
  ctx: ProtectedAppContext,
  beneficiary: BeneficiarySecurityTarget
) {
  return socialSupports.map(socialSupport => {
    const { _count } = socialSupport

    const socialSupportPermissions = getSocialSupportPermissions({
      ctx,
      beneficiary,
      socialSupport
    })

    const appPermissions = getAppContextPermissions(ctx)

    const { followup, helpRequest, housingHelpRequest } = socialSupport

    const conditions = {
      minister: appPermissions.module.ministere,
      dueDate: socialSupportPermissions.get.dueDate,
      details: socialSupportPermissions.get.details,
      privateSynthesis: socialSupportPermissions.get.privateSynthesis
    }

    const filteredSocialSupport = filterSocialSupport({
      socialSupport,
      conditions
    })
    const filteredHelpRequest = helpRequest
      ? filterHelpRequest({
          helpRequest,
          conditions
        })
      : null

    const filteredFollowup = followup
      ? filterFollowup({
          followup,
          conditions
        })
      : null
    const filteredHousingHelpRequest = housingHelpRequest
      ? filterHousingHelpRequest({ housingHelpRequest, conditions })
      : null

    const { documents, comments, ...otherData } = filteredSocialSupport

    const documentItems = documents?.map(document => ({
      document,
      permissions: getDocumentPermissions({
        ctx,
        beneficiary,
        document
      })
    }))
    const commentItems = comments?.map(comment => ({
      comment,
      permissions: getCommentPermissions({
        ctx,
        comment
      })
    }))

    return {
      data: {
        ...otherData,
        comments: commentItems,
        documents: documentItems,
        hasUnreadNotifications: !!_count.notifications,
        followup: filteredFollowup,
        helpRequest: filteredHelpRequest,
        housingHelpRequest: filteredHousingHelpRequest
      },
      permissions: socialSupportPermissions
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

  const [totalCount, socialSupports, beneficiary] = await Promise.all([
    SocialSupportRepo.count(ctx.user, {
      where: {
        beneficiaryId
      }
    }),
    loadSocialSupports(filters, ctx.user, beneficiaryId),
    BeneficiaryService.getBeneficiarySecurityTarget(
      ctx.user,
      input.beneficiaryId
    )
  ])

  return {
    items: formatResult(socialSupports, ctx, beneficiary),
    totalCount
  }
}

type SocialSupportsOutput = Prisma.PromiseReturnType<typeof handler>
export type SocialSupportItem = SocialSupportsOutput['items'][0]
export type SocialSupportData = SocialSupportItem['data']

export type FollowupData = NonNullable<SocialSupportData['followup']>
export type HelpRequestData = NonNullable<SocialSupportData['helpRequest']>
export type HousingHelpRequestData = NonNullable<
  SocialSupportData['housingHelpRequest']
>

export type CommentItems = Exclude<SocialSupportData['comments'], undefined>
export type CommentItem = CommentItems[number]
export type CommentData = CommentItem['comment']

export type DocumentItems = Exclude<SocialSupportData['documents'], undefined>

export const getSocialSupports = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
