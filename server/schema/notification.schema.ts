import { NotificationType } from '@prisma/client'
import { z } from 'zod/v4'
import { paginatedSchema } from './helpers.schema'

const updateNotificationSchema = z.object({
  id: z.uuid(),
  read: z.boolean()
})

type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>

export { updateNotificationSchema }

export type { UpdateNotificationInput }

const getNotificationsSchema = z
  .object({
    onlyUnread: z.boolean(),
    types: z.array(z.enum(NotificationType)).nullish()
  })
  .extend(paginatedSchema.shape)

type GetNotificationsInput = z.infer<typeof getNotificationsSchema>

export { getNotificationsSchema }

export type { GetNotificationsInput }
