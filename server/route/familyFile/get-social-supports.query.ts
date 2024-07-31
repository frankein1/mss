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
import { FamilyFileSecurityTarget, FamilyFileService } from '~/server/services'
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
  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    input.familyFileId
  )
  return permissions.view.history
}

type HistoryFilters = GetHistoryInput['filters']

function prepareSocialSupportFilters(
  filters: HistoryFilters,
  familyFileId: string
) {
  const formattedFilters: Prisma.SocialSupportWhereInput = {}

  if (filters.referents?.length) {
    formattedFilters.familyFile = {
      id: familyFileId,
      referents: {
        some: { id: { in: filters.referents } }
      }
    }
  } else {
    formattedFilters.familyFile = { id: familyFileId }
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

  if (filters.socialSupportSubjects?.length) {
    formattedFilters.subjects = {
      some: { id: { in: filters.socialSupportSubjects } }
    }
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

  if (filters.beneficiaryId) {
    formattedFilters.beneficiary = { id: filters.beneficiaryId }
  }

  return formattedFilters
}

function loadSocialSupports(
  filters: HistoryFilters,
  user: SecurityRuleGrantee,
  familyFileId: string
) {
  return SocialSupportRepo.findMany(user, {
    where: prepareSocialSupportFilters(filters, familyFileId),
    include: {
      createdBy: true,
      familyFile: {
        include: {
          referents: true
        }
      },
      beneficiary: {
        select: {
          id: true,
          usualName: true,
          birthName: true,
          firstName: true,
          birthDate: true,
          birthPlace: true
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
          instructorOrganizationContact: true,
          helpRequest: {
            include: {
              prescribingOrganization: true,
              prescribingOrganizationContact: true
            }
          },
          housingHelpRequest: true
        }
      },
      followup: {
        include: {
          prescribingOrganization: true,
          prescribingOrganizationContact: true
        }
      },
      _count: {
        select: {
          notifications: {
            where: { read: false, recipientId: user.id }
          }
        }
      },
      subjects: true
    },
    orderBy: [{ date: 'desc' }, { created: 'desc' }]
  })
}

type SocialSupports = Prisma.PromiseReturnType<typeof loadSocialSupports>

function formatResult(
  socialSupports: SocialSupports,
  ctx: ProtectedAppContext,
  familyFile: FamilyFileSecurityTarget
) {
  return socialSupports.map(socialSupport => {
    const { _count } = socialSupport

    const socialSupportPermissions = getSocialSupportPermissions({
      ctx,
      familyFile,
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
        familyFile,
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
  const { familyFileId, filters } = input

  const [totalCount, socialSupports, familyFile] = await Promise.all([
    SocialSupportRepo.count(ctx.user, {
      where: {
        familyFileId
      }
    }),
    loadSocialSupports(filters, ctx.user, familyFileId),
    FamilyFileService.getFamilyFileSecurityTarget(ctx.user, input.familyFileId)
  ])

  return {
    items: formatResult(socialSupports, ctx, familyFile),
    totalCount
  }
}

export const getSocialSupports = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
