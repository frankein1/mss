import { NotificationType, Prisma } from '@prisma/client'
import { createQuery } from '../createRequest'
import { GetNotificationInput, getNotificationSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  ctx: { user },
  input: { onlyUnread, type }
}: {
  ctx: ProtectedAppContext
  input: GetNotificationInput
}) => {
  const where: {
    recipientId: string
    read?: boolean
    type?: NotificationType
  } = {
    recipientId: user.id
  }

  if (onlyUnread) {
    where.read = false
  }
  if (type) {
    where.type = type
  }

  const notifications = await prismaClient.notification.findMany({
    where,
    include: {
      beneficiary: true
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
