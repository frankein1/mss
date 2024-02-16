import { Prisma } from '@prisma/client'
import { createQuery } from '~/server/route'
import { GetNotificationsInput, getNotificationsSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { NotificationRepo } from '~/server/database'
import { takeAndSkipFromPagination } from '~/utils/table'

const handler = async ({
  ctx: { user },
  input: { onlyUnread, types, perPage, page }
}: {
  ctx: ProtectedAppContext
  input: GetNotificationsInput
}) => {
  const { take, skip } = takeAndSkipFromPagination({ perPage, page })

  const where: Prisma.NotificationWhereInput = {}

  if (onlyUnread) {
    where.read = false
  }
  if (types?.length) {
    where.type = { in: types }
  }

  const [notifications, totalCount] = await Promise.all([
    NotificationRepo.findMany(user, {
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
        },
        comment: {
          select: {
            content: true
          }
        }
      },
      orderBy: {
        created: 'desc'
      },
      take,
      skip
    }),
    NotificationRepo.count(user, { where })
  ])

  return { notifications, totalCount }
}

export const getNotificationsQuery = createQuery({
  handler,
  inputValidation: getNotificationsSchema,
  securityCheck: AllowSecurityCheck
})

type GetNotificationOutput = Prisma.PromiseReturnType<typeof handler>
export type NotificationItem = GetNotificationOutput['notifications'][number]
