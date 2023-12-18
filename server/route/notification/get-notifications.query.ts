import { NotificationType } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetNotificationsInput, getNotificationsSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'

const handler = async ({
  ctx: { user },
  input: { onlyUnread, type }
}: {
  ctx: ProtectedAppContext
  input: GetNotificationsInput
}) => {
  const where: {
    read?: boolean
    type?: NotificationType
  } = {}

  if (onlyUnread) {
    where.read = false
  }
  if (type) {
    where.type = type
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
