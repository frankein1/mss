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
  filterSocialSupport,
  filterFollowup,
  filterFileInstruction,
  filterHousingHelpRequest,
  filterHelpRequest
} from '~/server/services/helper'
import { TypeSuivi } from '~/client/options'

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
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.examinationDate = filters.examinationDate
  }

  if (filters.externalStructure !== undefined) {
    const isExternalStructure = filters.externalStructure === 'true'
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.externalStructure = isExternalStructure
  }

  if (filters.handlingDate !== undefined) {
    const handlingDate = filters.handlingDate === 'true' ? { not: null } : null
    formattedFilters.fileInstruction = formattedFilters.fileInstruction || {}
    formattedFilters.fileInstruction.helpRequest =
      formattedFilters.fileInstruction.helpRequest || {}
    formattedFilters.fileInstruction.helpRequest.handlingDate = handlingDate
  }

  if (filters.followupTypes) {
    formattedFilters.types = { some: { id: { in: filters.followupTypes } } }
  }

  if (filters.typeSuivi) {
    switch (filters.typeSuivi) {
      case TypeSuivi.Followup:
        formattedFilters.socialSupportType = 'Followup'
        break
      case TypeSuivi.AllHelpRequest:
        formattedFilters.socialSupportType = {
          in: ['HelpRequest', 'HelpRequestHousing']
        }
        break
      case TypeSuivi.HousingHelpRequest:
        formattedFilters.socialSupportType = 'HelpRequestHousing'
        break
      case TypeSuivi.FinancialHelpRequest:
      case TypeSuivi.OtherHelpRequest:
        formattedFilters.socialSupportType = 'HelpRequest'
        formattedFilters.fileInstruction =
          formattedFilters.fileInstruction || {}
        formattedFilters.fileInstruction.helpRequest =
          formattedFilters.fileInstruction.helpRequest || {}
        formattedFilters.fileInstruction.helpRequest = {
          financialSupport: filters.typeSuivi === TypeSuivi.FinancialHelpRequest
        }
    }
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
      fileInstruction: {
        include: {
          instructorOrganization: true,
          helpRequest: {
            include: {
              prescribingOrganization: true
            }
          },
          housingHelpRequest: true
        }
      },
      followup: {
        include: {
          prescribingOrganization: true
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
    orderBy: [{ date: 'desc' }, { created: 'desc' }]
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

    const { followup, fileInstruction } = socialSupport

    const conditions = {
      minister: appPermissions.module.ministere,
      details: socialSupportPermissions.get.details,
      privateSynthesis: socialSupportPermissions.get.privateSynthesis
    }

    const filteredSocialSupport = filterSocialSupport({
      socialSupport,
      conditions
    })
    const filteredFileInstruction = fileInstruction
      ? filterFileInstruction({
          fileInstruction,
          conditions
        })
      : null

    const helpRequest = fileInstruction?.helpRequest
    const housingHelpRequest = fileInstruction?.housingHelpRequest

    const filteredHousingHelpRequest = housingHelpRequest
      ? filterHousingHelpRequest({
          housingHelpRequest,
          conditions
        })
      : null
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
        fileInstruction: {
          ...filteredFileInstruction,
          helpRequest: filteredHelpRequest,
          housingHelpRequest: filteredHousingHelpRequest
        }
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

export const getSocialSupports = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
