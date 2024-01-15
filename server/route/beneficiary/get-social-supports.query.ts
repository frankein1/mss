import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetHistoryInput, getHistorySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import {
  getDocumentPermissions,
  SecurityRuleGrantee,
  SecurityRuleContext,
  getSocialSupportPermissions
} from '~/server/security'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { SocialSupportRepo } from '~/server/database'
import {
  BeneficiarySecurityTarget,
  BeneficiaryService
} from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetHistoryInput
) => {
  const permissions = await BeneficiaryService.getEditionPermission(
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
        include: {
          prescribingOrganization: { select: { name: true } },
          instructorOrganization: { select: { name: true } }
        }
      },
      followup: {
        include: {
          prescribingOrganization: { select: { name: true } }
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

function flattenSocialSupports(
  socialSupports: SocialSupports,
  ctx: ProtectedAppContext,
  beneficiary: BeneficiarySecurityTarget
) {
  return socialSupports.map(socialSupport => {
    const { types, documents, _count, ...data } = socialSupport

    const documentsWithPermissions = documents?.map(document => ({
      document,
      permissions: getDocumentPermissions({
        ctx,
        beneficiary,
        document
      })
    }))

    const socialSupportPermissions = getSocialSupportPermissions({
      ctx,
      beneficiary,
      socialSupport
    })

    return {
      data: {
        ...data,
        documents: documentsWithPermissions,
        hasUnreadNotifications: !!_count.notifications,
        followUpTypes: types
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
    items: flattenSocialSupports(socialSupports, ctx, beneficiary),
    totalCount
  }
}

export const getSocialSupports = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
