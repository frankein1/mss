import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'
import { Prisma } from '@prisma/client'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await NotificationRepo.findMany(user, {
    where: {
      recipientId: user.id
    },
    include: {
      beneficiary: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true,
          familyFile: {
            select: {
              id: true
            }
          }
        }
      },
      socialSupport: {
        select: {
          socialSupportType: true
        }
      },
      itemCreatedBy: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      comment: {
        select: {
          content: true
        }
      }
    },
    orderBy: {
      created: 'desc'
    }
  })
}

export const getArchiveNotificationsQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
