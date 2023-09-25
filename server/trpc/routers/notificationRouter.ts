import {
  updateNotificationHandler,
  getNotificationHandler
} from '~/server/trpc/controller/notification'
import { protectedProcedure, router } from '~/server/trpc'
import {
  updateNotificationSchema,
  getNotificationSchema
} from '~/server/schema'

export const notificationRouter = router({
  get: protectedProcedure
    .input(getNotificationSchema)
    .query(getNotificationHandler),
  update: protectedProcedure
    .input(updateNotificationSchema)
    .mutation(updateNotificationHandler)
})
