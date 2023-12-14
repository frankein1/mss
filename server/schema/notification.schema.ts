import { NotificationType } from '@prisma/client'
import { z } from 'zod'

const updateNotificationSchema = z.object({
  id: z.string().uuid(),
  read: z.boolean()
})

type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>

export { updateNotificationSchema }

export type { UpdateNotificationInput }

const getNotificationsSchema = z.object({
  onlyUnread: z.boolean(),
  type: z.nativeEnum(NotificationType).nullish()
})

type GetNotificationsInput = z.infer<typeof getNotificationsSchema>

export { getNotificationsSchema }

export type { GetNotificationsInput }
