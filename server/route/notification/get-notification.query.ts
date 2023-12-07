import { NotificationType, Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetNotificationInput, getNotificationSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'

const handler = async ({
  ctx: { user },
  input: { onlyUnread, type }
}: {
  ctx: ProtectedAppContext
  input: GetNotificationInput
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
      beneficiary: true,
      helpRequest: {
        select: { createdBy: { select: { lastName: true, firstName: true } } }
      },
      followup: {
        select: { createdBy: { select: { lastName: true, firstName: true } } }
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

export type GetNotificationOutput = Prisma.PromiseReturnType<typeof handler>

export const getNotificationQuery = createQuery({
  handler,
  inputValidation: getNotificationSchema,
  securityCheck: AllowSecurityCheck
})
