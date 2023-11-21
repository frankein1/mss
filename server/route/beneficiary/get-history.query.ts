import { createQuery } from '~/server/route'
import { GetHistoryInput, getHistorySchema } from '~/server/schema'
import { TypeSuivi } from '~/types/history'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { COMMENT_RELATIONS_INCLUDE } from '~/utils/constants/comment'
import { prismaClient } from '~/server/prisma'

const createdBySelect = {
  firstName: true,
  lastName: true,
  email: true
}

const securityCheck = AllowSecurityCheck

const handler = async ({
  input,
  ctx: { user }
}: {
  input: GetHistoryInput
  ctx: ProtectedAppContext
}) => {
  const { beneficiaryId, filters } = input

  const totalCountQuery = prismaClient.beneficiaryHistory.count({
    where: {
      beneficiaryId
    }
  })

  const historiesQuery = await prismaClient.beneficiaryHistory.findMany({
    where: {
      beneficiary: {
        id: beneficiaryId,
        referents: filters.referents
          ? { some: { id: { in: filters.referents } } }
          : undefined
      },
      status: filters.status || undefined,
      medium: filters.medium ? { in: filters.medium } : undefined,
      examinationDate: filters.examinationDate || undefined,
      externalStructure: filters.externalStructure
        ? filters.externalStructure === 'true'
        : undefined,
      handlingDate: filters.handlingDate || undefined,
      typeIds: filters.followupTypes
        ? { hasSome: filters.followupTypes }
        : undefined,
      isFollowup: filters.typeSuivi
        ? filters.typeSuivi === TypeSuivi.Followup
        : undefined
    },
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

  const [totalCount, histories] = await Promise.all([
    totalCountQuery,
    historiesQuery
  ])

  return { histories, totalCount }
}

export const getBeneficiaryHistoryQuery = createQuery({
  inputValidation: getHistorySchema,
  securityCheck,
  handler
})
