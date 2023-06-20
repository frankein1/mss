import { NotificationType, Prisma } from '@prisma/client'
import { UpdateNotificationInput, GetNotificationInput } from '../schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

export const updateNotificationHandler = async ({
  ctx: { user },
  input: { id, read }
}: {
  ctx: ProtectedAppContext
  input: UpdateNotificationInput
}) => {
  await prismaClient.notification.updateMany({
    where: { id, recipientId: user.id },
    data: { read }
  })
}

export const getNotificationHandler = async ({
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

export type GetNotificationOutput = Prisma.PromiseReturnType<
  typeof getNotificationHandler
>
