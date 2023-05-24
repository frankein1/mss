// [NUXT/PRISMA]: Move to root folder

import { z } from 'zod'

const updateNotificationSchema = z.object({
  id: z.string().uuid(),
  read: z.boolean()
})

type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>

export { updateNotificationSchema }

export type { UpdateNotificationInput }

const getNotificationSchema = z.object({
  onlyUnread: z.boolean()
})

type GetNotificationInput = z.infer<typeof getNotificationSchema>

export { getNotificationSchema }

export type { GetNotificationInput }
