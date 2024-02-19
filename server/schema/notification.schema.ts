import { NotificationType } from '@prisma/client'
import { z } from 'zod'
import { paginatedSchema } from './helpers.schema'

const updateNotificationSchema = z.object({
  id: z.string().uuid(),
  read: z.boolean()
})

type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>

export { updateNotificationSchema }

export type { UpdateNotificationInput }

const getNotificationsSchema = z
  .object({
    onlyUnread: z.boolean(),
    types: z.array(z.nativeEnum(NotificationType)).nullish()
  })
  .merge(paginatedSchema)

type GetNotificationsInput = z.infer<typeof getNotificationsSchema>

export { getNotificationsSchema }

export type { GetNotificationsInput }
