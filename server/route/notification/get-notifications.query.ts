import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetNotificationsInput, getNotificationsSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'

const handler = async ({
  ctx: { user },
  input: { onlyUnread, types }
}: {
  ctx: ProtectedAppContext
  input: GetNotificationsInput
}) => {
  const where: Prisma.NotificationWhereInput = {}

  if (onlyUnread) {
    where.read = false
  }
  if (types?.length) {
    where.type = { in: types }
  }

  const notifications = await NotificationRepo.findMany(user, {
    where,
    include: {
      beneficiary: {
        select: {
          id: true,
          firstName: true,
          usualName: true,
          birthName: true
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
      }
    },
    orderBy: {
      created: 'desc'
    }
  })

  return (notifications || []).map(n => {
    const { beneficiary, ...notificationDatas } = n
    return { beneficiary, notification: { ...notificationDatas } }
  })
}

export const getNotificationsQuery = createQuery({
  handler,
  inputValidation: getNotificationsSchema,
  securityCheck: AllowSecurityCheck
})
